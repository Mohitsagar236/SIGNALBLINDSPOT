import type {
  BlindSpotRecord,
  ConfidenceLabel,
  DistributionItem,
  EndUserRecord,
  EvidenceRecord,
  RecommendationStatus,
  RepresentationGap,
  ResearchRecommendationRecord,
  RoadmapItemRecord,
  ScoreBreakdown,
  ScoringWeights,
  SegmentDimension,
  Severity
} from "./types";

export const defaultScoringWeights: ScoringWeights = {
  evidenceQuantity: 0.15,
  segmentRepresentation: 0.3,
  sourceDiversity: 0.15,
  recency: 0.1,
  targetSegmentCoverage: 0.15,
  churnedUserInclusion: 0.075,
  accessibilityLanguageInclusion: 0.075
};

export const defaultScoringSettings = {
  weights: defaultScoringWeights,
  minimumEvidenceThreshold: 30,
  recencyThresholdDays: 180
};

const round = (value: number) => Math.round(value * 10) / 10;
const clampScore = (value: number) => Math.max(0, Math.min(100, round(value)));

export function validateScoringWeights(weights: ScoringWeights): boolean {
  const values = Object.values(weights);
  const total = values.reduce((sum, weight) => sum + weight, 0);
  return values.every((weight) => Number.isFinite(weight) && weight >= 0) && Math.abs(total - 1) < 0.001;
}

function valueForDimension(user: EndUserRecord, dimension: SegmentDimension): string {
  if (dimension === "tenure") {
    if (user.tenureMonths < 6) return "New users";
    if (user.tenureMonths < 24) return "Established users";
    return "Long-tenured users";
  }
  if (dimension === "arrBand") return user.arrBand ?? "Unknown ARR";
  if (dimension === "industry") return user.industry ?? "Unknown industry";
  return String(user[dimension] ?? "Unknown");
}

function distribution(records: EndUserRecord[], dimension: SegmentDimension): DistributionItem[] {
  const counts = new Map<string, number>();
  for (const user of records) {
    const key = valueForDimension(user, dimension);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const total = Math.max(records.length, 1);
  return Array.from(counts.entries())
    .map(([segment, count]) => ({ segment, count, percentage: round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count || a.segment.localeCompare(b.segment));
}

export function calculateActualPopulationDistribution(
  users: EndUserRecord[],
  dimension: SegmentDimension
): DistributionItem[] {
  return distribution(users, dimension);
}

export function calculateEvidencePopulationDistribution(
  evidenceUsers: EndUserRecord[],
  dimension: SegmentDimension
): DistributionItem[] {
  return distribution(evidenceUsers, dimension);
}

export function calculateRepresentationGap(
  actualDistribution: DistributionItem[],
  evidenceDistribution: DistributionItem[]
): RepresentationGap[] {
  const evidenceMap = new Map(evidenceDistribution.map((item) => [item.segment, item.percentage]));
  const actualMap = new Map(actualDistribution.map((item) => [item.segment, item.percentage]));
  const segments = new Set([...actualMap.keys(), ...evidenceMap.keys()]);

  return Array.from(segments)
    .map((segment) => {
      const actualPercentage = actualMap.get(segment) ?? 0;
      const evidencePercentage = evidenceMap.get(segment) ?? 0;
      const gap = round(evidencePercentage - actualPercentage);
      const direction: RepresentationGap["direction"] =
        Math.abs(gap) < 5 ? "balanced" : gap < 0 ? "underrepresented" : "overrepresented";
      return { segment, actualPercentage, evidencePercentage, gap, direction };
    })
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
}

export function detectOverrepresentedSegments(
  actualDistribution: DistributionItem[],
  evidenceDistribution: DistributionItem[],
  threshold = 12
): RepresentationGap[] {
  return calculateRepresentationGap(actualDistribution, evidenceDistribution).filter(
    (gap) => gap.gap >= threshold
  );
}

export function detectUnderrepresentedSegments(
  actualDistribution: DistributionItem[],
  evidenceDistribution: DistributionItem[],
  threshold = 12
): RepresentationGap[] {
  return calculateRepresentationGap(actualDistribution, evidenceDistribution).filter(
    (gap) => gap.gap <= -threshold
  );
}

export function calculateEvidenceQuantityScore(evidenceCount: number, threshold = 30): number {
  if (evidenceCount <= 0) return 0;
  return clampScore((Math.min(evidenceCount, threshold) / threshold) * 100);
}

export function calculateSegmentRepresentationScore(representationGaps: RepresentationGap[]): number {
  if (representationGaps.length === 0) return 0;
  const weightedMismatch = representationGaps.reduce(
    (sum, gap) => sum + Math.abs(gap.gap) * (gap.actualPercentage / 100),
    0
  );
  return clampScore(100 - weightedMismatch * 2.2);
}

export function calculateSourceDiversityScore(evidenceSources: string[]): number {
  if (evidenceSources.length === 0) return 0;
  const counts = new Map<string, number>();
  for (const source of evidenceSources) counts.set(source, (counts.get(source) ?? 0) + 1);
  const uniqueScore = Math.min(counts.size / 5, 1) * 65;
  const total = evidenceSources.length;
  const balance = 1 - Math.max(...counts.values()) / total;
  return clampScore(uniqueScore + balance * 35);
}

export function calculateRecencyScore(evidenceDates: Date[], thresholdDays = 180): number {
  if (evidenceDates.length === 0) return 0;
  const now = new Date("2026-07-31T00:00:00.000Z");
  const averageAge =
    evidenceDates.reduce((sum, date) => sum + Math.max(0, now.getTime() - date.getTime()), 0) /
    evidenceDates.length /
    86_400_000;
  return clampScore(100 - (averageAge / thresholdDays) * 100);
}

export function calculateTargetSegmentCoverageScore(
  targetSegment: string,
  evidenceUsers: EndUserRecord[]
): number {
  if (evidenceUsers.length === 0) return 0;
  const normalizedTarget = targetSegment.toLowerCase();
  const matches = evidenceUsers.filter((user) =>
    [user.role, user.segment, user.region, user.language, user.plan, user.activityLevel]
      .join(" ")
      .toLowerCase()
      .includes(normalizedTarget)
  ).length;
  return clampScore((matches / Math.max(5, evidenceUsers.length * 0.2)) * 100);
}

export function calculateChurnedUserInclusionScore(evidenceUsers: EndUserRecord[]): number {
  if (evidenceUsers.length === 0) return 0;
  const riskyUsers = evidenceUsers.filter((user) => user.churnStatus !== "Active").length;
  return clampScore((riskyUsers / Math.max(3, evidenceUsers.length * 0.12)) * 100);
}

export function calculateAccessibilityLanguageInclusionScore(evidenceUsers: EndUserRecord[]): number {
  if (evidenceUsers.length === 0) return 0;
  const inclusiveUsers = evidenceUsers.filter(
    (user) => user.accessibilityNeed !== "None" || user.language !== "English"
  ).length;
  return clampScore((inclusiveUsers / Math.max(5, evidenceUsers.length * 0.18)) * 100);
}

export function calculateOverallCoverageScore(
  scoreParts: Omit<ScoreBreakdown, "overallScore" | "confidenceLabel" | "explanation" | "gaps">,
  weights: ScoringWeights
): number {
  if (!validateScoringWeights(weights)) {
    throw new Error("Scoring weights must be non-negative and sum to 1.");
  }
  return clampScore(
    scoreParts.evidenceQuantityScore * weights.evidenceQuantity +
      scoreParts.segmentRepresentationScore * weights.segmentRepresentation +
      scoreParts.sourceDiversityScore * weights.sourceDiversity +
      scoreParts.recencyScore * weights.recency +
      scoreParts.targetSegmentCoverageScore * weights.targetSegmentCoverage +
      scoreParts.churnedUserInclusionScore * weights.churnedUserInclusion +
      scoreParts.accessibilityLanguageInclusionScore * weights.accessibilityLanguageInclusion
  );
}

export function determineDecisionConfidence(overallScore: number): ConfidenceLabel {
  if (overallScore >= 80) return "High";
  if (overallScore >= 60) return "Medium";
  if (overallScore >= 40) return "Low";
  return "Insufficient Evidence";
}

export function calculateCoverageScore(
  roadmapItem: RoadmapItemRecord,
  users: EndUserRecord[],
  evidence: EvidenceRecord[],
  dimension: SegmentDimension = "role",
  weights: ScoringWeights = defaultScoringWeights,
  minimumEvidenceThreshold = 30,
  recencyThresholdDays = 180
): ScoreBreakdown {
  const evidenceUsers = evidence.map((item) => item.user);
  const actualDistribution = calculateActualPopulationDistribution(users, dimension);
  const evidenceDistribution = calculateEvidencePopulationDistribution(evidenceUsers, dimension);
  const gaps = calculateRepresentationGap(actualDistribution, evidenceDistribution);
  const parts = {
    evidenceQuantityScore: calculateEvidenceQuantityScore(evidence.length, minimumEvidenceThreshold),
    segmentRepresentationScore: calculateSegmentRepresentationScore(gaps),
    sourceDiversityScore: calculateSourceDiversityScore(evidence.map((item) => item.source)),
    recencyScore: calculateRecencyScore(evidence.map((item) => item.createdAt), recencyThresholdDays),
    targetSegmentCoverageScore: calculateTargetSegmentCoverageScore(
      roadmapItem.targetSegment,
      evidenceUsers
    ),
    churnedUserInclusionScore: calculateChurnedUserInclusionScore(evidenceUsers),
    accessibilityLanguageInclusionScore: calculateAccessibilityLanguageInclusionScore(evidenceUsers)
  };
  const overallScore = calculateOverallCoverageScore(parts, weights);
  const confidenceLabel = determineDecisionConfidence(overallScore);
  const largestGap = gaps[0];
  const explanation = largestGap
    ? `${confidenceLabel} confidence: ${largestGap.segment} is ${largestGap.direction} by ${Math.abs(
        largestGap.gap
      ).toFixed(1)} percentage points.`
    : `${confidenceLabel} confidence: no linked evidence is available.`;
  return { ...parts, overallScore, confidenceLabel, explanation, gaps };
}

function severityFromGap(gap: number): Severity {
  const absolute = Math.abs(gap);
  if (absolute >= 45) return "Critical";
  if (absolute >= 28) return "High";
  if (absolute >= 14) return "Medium";
  return "Low";
}

export function detectBlindSpots(
  roadmapItem: RoadmapItemRecord,
  users: EndUserRecord[],
  evidence: EvidenceRecord[],
  scoreBreakdown: ScoreBreakdown
): BlindSpotRecord[] {
  const spots: BlindSpotRecord[] = [];
  const evidenceUsers = evidence.map((item) => item.user);
  const now = new Date("2026-07-31T00:00:00.000Z");
  const id = (name: string) => `${roadmapItem.id}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  for (const gap of scoreBreakdown.gaps.filter((item) => Math.abs(item.gap) >= 12)) {
    const direction = gap.gap < 0 ? "underrepresented" : "overrepresented";
    spots.push({
      id: id(`${gap.segment}-${direction}`),
      roadmapItemId: roadmapItem.id,
      type: `${gap.segment} ${direction}`,
      severity: severityFromGap(gap.gap),
      explanation: `${gap.segment} represents ${gap.actualPercentage}% of users but ${gap.evidencePercentage}% of linked evidence for this decision.`,
      affectedSegment: gap.segment,
      actualPopulationPercentage: gap.actualPercentage,
      evidencePopulationPercentage: gap.evidencePercentage,
      representationGap: gap.gap,
      recommendedAction:
        gap.gap < 0
          ? `Interview at least ${Math.max(5, Math.ceil(Math.abs(gap.gap) / 8))} ${gap.segment} users before prioritization.`
          : `Balance the evidence by recruiting non-${gap.segment} users before treating volume as representative.`,
      status: "Open",
      createdAt: now
    });
  }

  if (!evidenceUsers.some((user) => user.churnStatus === "Churned")) {
    spots.push({
      id: id("churned-users-missing"),
      roadmapItemId: roadmapItem.id,
      type: "Churned users missing",
      severity: "High",
      explanation: "No linked evidence includes churned users, so lost-customer needs may be invisible.",
      affectedSegment: "Churned users",
      actualPopulationPercentage: round(
        (users.filter((user) => user.churnStatus === "Churned").length / users.length) * 100
      ),
      evidencePopulationPercentage: 0,
      representationGap: -100,
      recommendedAction: "Add churn interviews or win-loss research before final prioritization.",
      status: "Open",
      createdAt: now
    });
  }

  if (!evidenceUsers.some((user) => user.accessibilityNeed !== "None")) {
    spots.push({
      id: id("accessibility-needs-missing"),
      roadmapItemId: roadmapItem.id,
      type: "Accessibility-needs users missing",
      severity: "Medium",
      explanation: "Linked evidence does not include users with accessibility needs.",
      affectedSegment: "Accessibility needs",
      actualPopulationPercentage: round(
        (users.filter((user) => user.accessibilityNeed !== "None").length / users.length) * 100
      ),
      evidencePopulationPercentage: 0,
      representationGap: -100,
      recommendedAction: "Recruit users with visual, motor, cognitive, or hearing needs for usability validation.",
      status: "Open",
      createdAt: now
    });
  }

  if (!evidenceUsers.some((user) => user.language !== "English")) {
    spots.push({
      id: id("non-english-users-missing"),
      roadmapItemId: roadmapItem.id,
      type: "Non-English users missing",
      severity: "Medium",
      explanation: "Evidence is English-only, which can hide localization and comprehension risks.",
      affectedSegment: "Non-English users",
      actualPopulationPercentage: round(
        (users.filter((user) => user.language !== "English").length / users.length) * 100
      ),
      evidencePopulationPercentage: 0,
      representationGap: -100,
      recommendedAction: "Add non-English interviews or translated survey responses before launch planning.",
      status: "Open",
      createdAt: now
    });
  }

  const internalShare =
    evidence.length === 0
      ? 0
      : evidence.filter((item) => item.source === "Internal stakeholder").length / evidence.length;
  if (internalShare > 0.35) {
    spots.push({
      id: id("internal-feedback-outweighs-user-evidence"),
      roadmapItemId: roadmapItem.id,
      type: "Internal feedback outweighs user evidence",
      severity: "High",
      explanation: `${round(internalShare * 100)}% of linked evidence comes from internal stakeholders.`,
      affectedSegment: "Internal stakeholders",
      actualPopulationPercentage: 0,
      evidencePopulationPercentage: round(internalShare * 100),
      representationGap: round(internalShare * 100),
      recommendedAction: "Add direct customer evidence from the target workflow before using this decision in roadmap ranking.",
      status: "Open",
      createdAt: now
    });
  }

  if (scoreBreakdown.recencyScore < 35) {
    spots.push({
      id: id("feedback-too-old"),
      roadmapItemId: roadmapItem.id,
      type: "Feedback too old",
      severity: "Medium",
      explanation: "Most linked evidence is outside the configured recency window.",
      affectedSegment: "Recent evidence",
      actualPopulationPercentage: 100,
      evidencePopulationPercentage: scoreBreakdown.recencyScore,
      representationGap: scoreBreakdown.recencyScore - 100,
      recommendedAction: "Collect fresh evidence from the target segment before committing engineering capacity.",
      status: "Open",
      createdAt: now
    });
  }

  return spots.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}

function severityRank(severity: Severity): number {
  return { Low: 1, Medium: 2, High: 3, Critical: 4 }[severity];
}

export function generateResearchRecommendations(
  blindSpots: BlindSpotRecord[],
  roadmapItem: RoadmapItemRecord,
  users: EndUserRecord[]
): ResearchRecommendationRecord[] {
  return blindSpots.slice(0, 8).map((spot, index) => {
    const sampleSize =
      spot.severity === "Critical" ? 8 : spot.severity === "High" ? 6 : spot.severity === "Medium" ? 4 : 3;
    const method = spot.type.includes("Accessibility")
      ? "Moderated accessibility usability test"
      : spot.type.includes("Churned")
        ? "Churn interview"
        : spot.type.includes("Non-English")
          ? "Localized customer interview"
          : spot.type.includes("Internal")
            ? "Customer validation interview"
            : "Targeted user interview";
    const recruitable = users.filter((user) =>
      [user.role, user.segment, user.region, user.language, user.activityLevel, user.churnStatus]
        .join(" ")
        .toLowerCase()
        .includes(spot.affectedSegment.toLowerCase())
    ).length;
    return {
      id: `${spot.id}-recommendation`,
      roadmapItemId: roadmapItem.id,
      blindSpotId: spot.id,
      title: `Validate ${roadmapItem.title} with ${spot.affectedSegment}`,
      explanation: `${spot.explanation} ${spot.recommendedAction}`,
      recommendedSegment: spot.affectedSegment,
      suggestedSampleSize: Math.min(Math.max(sampleSize, Math.ceil(recruitable * 0.02)), 12),
      suggestedResearchMethod: method,
      priority: spot.severity,
      expectedImpact: "Improves roadmap confidence by reducing segment bias before prioritization.",
      status: "Open" satisfies RecommendationStatus,
      owner: index % 2 === 0 ? "Priya Shah" : "Jordan Lee",
      notes: "Generated from the active blind-spot rules."
    };
  });
}

export function generateDecisionRecommendation(
  coverageScore: ScoreBreakdown,
  blindSpots: BlindSpotRecord[]
): "Proceed" | "Proceed with caution" | "Collect more evidence" | "Re-scope roadmap item" | "Do not proceed yet" {
  const critical = blindSpots.some((spot) => spot.severity === "Critical");
  const highCount = blindSpots.filter((spot) => spot.severity === "High").length;
  if (coverageScore.overallScore < 30 || critical) return "Do not proceed yet";
  if (coverageScore.overallScore < 50 || highCount >= 2) return "Collect more evidence";
  if (coverageScore.overallScore < 65) return "Proceed with caution";
  if (blindSpots.some((spot) => spot.type.includes("Target"))) return "Re-scope roadmap item";
  return "Proceed";
}

export function generateDecisionReport(
  roadmapItem: RoadmapItemRecord,
  coverageScore: ScoreBreakdown,
  blindSpots: BlindSpotRecord[],
  recommendations: ResearchRecommendationRecord[]
): string {
  const decision = generateDecisionRecommendation(coverageScore, blindSpots);
  const gaps = coverageScore.gaps
    .slice(0, 6)
    .map(
      (gap) =>
        `- ${gap.segment}: actual ${gap.actualPercentage}%, evidence ${gap.evidencePercentage}%, gap ${gap.gap > 0 ? "+" : ""}${gap.gap}pp`
    )
    .join("\n");
  const spotList = blindSpots
    .slice(0, 6)
    .map((spot) => `- ${spot.severity}: ${spot.type}. ${spot.recommendedAction}`)
    .join("\n");
  const recList = recommendations
    .slice(0, 5)
    .map((rec) => `- ${rec.title}: ${rec.suggestedResearchMethod} with ${rec.suggestedSampleSize} users.`)
    .join("\n");

  return `# Decision Report: ${roadmapItem.title}

## Executive Summary
SignalBlindspot rates this roadmap decision at ${coverageScore.overallScore}/100 (${coverageScore.confidenceLabel}). ${coverageScore.explanation}

## Roadmap Decision
${roadmapItem.description}

- Product area: ${roadmapItem.productArea}
- Owner: ${roadmapItem.owner}
- Priority: ${roadmapItem.priority}
- Target segment: ${roadmapItem.targetSegment}
- Current status: ${roadmapItem.status}

## Evidence Coverage Score
- Evidence quantity: ${coverageScore.evidenceQuantityScore}
- Segment representation: ${coverageScore.segmentRepresentationScore}
- Source diversity: ${coverageScore.sourceDiversityScore}
- Recency: ${coverageScore.recencyScore}
- Target segment coverage: ${coverageScore.targetSegmentCoverageScore}
- Churned and at-risk inclusion: ${coverageScore.churnedUserInclusionScore}
- Accessibility and language inclusion: ${coverageScore.accessibilityLanguageInclusionScore}

## Segment Representation Analysis
${gaps || "- No segment data available."}

## Research Blind Spots
${spotList || "- No blind spots detected."}

## Recommended Next Research
${recList || "- No extra research required."}

## Decision Recommendation
${decision}

## Risks
- Feedback volume may still be biased toward users who are easiest to reach.
- Revenue weighting should inform commercial priority, not erase representation gaps.
- Missing churned or non-English users can create post-launch surprises.

## PM Notes
Use this report before prioritization review. Update the decision log after recommended research is completed.
`;
}

export function validateWorkflowTransition(currentStatus: string, nextStatus: string): boolean {
  const transitions: Record<string, string[]> = {
    Draft: ["Evidence Review", "Paused", "Archived"],
    "Evidence Review": ["Research Gap Identified", "Ready for Prioritization", "More Research Needed"],
    "Research Gap Identified": ["More Research Needed", "Research Review", "Paused"],
    "More Research Needed": ["Evidence Review", "Ready for Prioritization", "Paused"],
    "Ready for Prioritization": ["Prioritized", "Paused"],
    Prioritized: ["Shipped", "Paused", "Archived"],
    Paused: ["Evidence Review", "Archived"],
    Shipped: ["Archived"],
    Archived: []
  };
  return transitions[currentStatus]?.includes(nextStatus) ?? false;
}
