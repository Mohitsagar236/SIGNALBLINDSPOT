import {
  calculateCoverageScore,
  detectBlindSpots,
  generateDecisionReport,
  generateResearchRecommendations
} from "./scoring";
import type {
  AccountRecord,
  BlindSpotRecord,
  EndUserRecord,
  EvidenceRecord,
  FeedbackRecord,
  InterviewRecord,
  ResearchRecommendationRecord,
  RoadmapItemRecord,
  ScoreBreakdown
} from "./types";

const roles = ["Operator", "Admin", "Manager", "External Collaborator", "Executive"] as const;
const segments = ["SMB", "Mid-Market", "Enterprise"] as const;
const regions = ["India", "US", "Europe", "APAC", "LATAM"] as const;
const languages = ["English", "Hindi", "Spanish", "German", "French"] as const;
const activity = ["Low", "Medium", "High", "Power User"] as const;
const accessibility = ["None", "Visual", "Motor", "Cognitive", "Hearing", "Unknown"] as const;
const churn = ["Active", "Churned", "At Risk"] as const;
const plans = ["Starter", "Business", "Enterprise"] as const;
const industries = ["Fintech", "Healthcare", "Manufacturing", "Education", "SaaS"] as const;
const sources = [
  "Support ticket",
  "Sales call",
  "Customer interview",
  "NPS survey",
  "App feedback",
  "Customer success note",
  "Internal stakeholder",
  "Churn interview",
  "Usability test",
  "Community forum"
];

function pick<T>(items: readonly T[], index: number): T {
  return items[index % items.length];
}

function weightedRole(index: number): (typeof roles)[number] {
  const mod = index % 100;
  if (mod < 55) return "Operator";
  if (mod < 70) return "Admin";
  if (mod < 90) return "Manager";
  if (mod < 98) return "External Collaborator";
  return "Executive";
}

function arrBand(arr: number): string {
  if (arr >= 150_000) return "High ARR";
  if (arr >= 50_000) return "Mid ARR";
  return "Low ARR";
}

export function buildDemoData() {
  const accounts: AccountRecord[] = Array.from({ length: 50 }, (_, index) => {
    const segment = index % 10 < 5 ? "SMB" : index % 10 < 8 ? "Mid-Market" : "Enterprise";
    const arr = segment === "Enterprise" ? 180_000 + index * 2700 : segment === "Mid-Market" ? 55_000 + index * 900 : 8_000 + index * 220;
    return {
      id: `acct-${index + 1}`,
      externalAccountId: `A-${String(index + 1).padStart(3, "0")}`,
      companyName: `${pick(["Atlas", "Nova", "Summit", "Kite", "Pulse"], index)} ${pick(["Systems", "Labs", "Works", "Cloud", "Group"], index + 2)}`,
      segment,
      arr,
      plan: segment === "Enterprise" ? "Enterprise" : segment === "Mid-Market" ? "Business" : "Starter",
      region: pick(regions, index),
      industry: pick(industries, index)
    };
  });

  const users: EndUserRecord[] = Array.from({ length: 500 }, (_, index) => {
    const account = accounts[index % accounts.length];
    const role = weightedRole(index);
    const language = index % 100 < 58 ? "English" : pick(languages, index);
    const accessibilityNeed = index % 100 < 84 ? "None" : pick(accessibility, index + 1);
    const churnStatus = index % 100 < 78 ? "Active" : index % 100 < 91 ? "At Risk" : "Churned";
    return {
      id: `user-${index + 1}`,
      externalUserId: `U-${String(index + 1).padStart(4, "0")}`,
      accountId: account.id,
      role,
      segment: account.segment,
      region: account.region,
      language,
      plan: account.plan,
      tenureMonths: 1 + ((index * 7) % 72),
      activityLevel: role === "Operator" ? pick(activity, index + 1) : pick(activity, index + 2),
      accessibilityNeed,
      churnStatus,
      industry: account.industry,
      arrBand: arrBand(account.arr)
    };
  });

  const roadmapItems: RoadmapItemRecord[] = [
    {
      id: "roadmap-admin-dashboard",
      externalRoadmapItemId: "R-001",
      title: "Redesign Admin Dashboard",
      description: "Modernize admin reporting, controls, and setup workflows for account administrators.",
      productArea: "Administration",
      priority: "High",
      status: "Evidence Review",
      decisionDate: new Date("2026-08-20"),
      owner: "Priya Shah",
      targetSegment: "Admin"
    },
    {
      id: "roadmap-mobile-workflow",
      externalRoadmapItemId: "R-002",
      title: "Improve Mobile Workflow Completion",
      description: "Reduce drop-off for field and mobile-heavy workflows used outside a desk setup.",
      productArea: "Mobile",
      priority: "High",
      status: "Research Gap Identified",
      decisionDate: new Date("2026-08-27"),
      owner: "Jordan Lee",
      targetSegment: "Operator"
    },
    ...Array.from({ length: 18 }, (_, index) => ({
      id: `roadmap-${index + 3}`,
      externalRoadmapItemId: `R-${String(index + 3).padStart(3, "0")}`,
      title: pick(
        [
          "Bulk Account Permissions",
          "Usage Anomaly Alerts",
          "Self-Serve Plan Upgrade",
          "Research Notes Intelligence",
          "Workflow Template Library",
          "Localization Review Queue"
        ],
        index
      ),
      description: "Evaluate representative evidence before roadmap prioritization.",
      productArea: pick(["Administration", "Growth", "Analytics", "Research", "Collaboration"], index),
      priority: pick(["Low", "Medium", "High"], index + 1),
      status: pick(["Draft", "Evidence Review", "More Research Needed", "Ready for Prioritization"], index) as RoadmapItemRecord["status"],
      decisionDate: new Date(2026, 7, 10 + index),
      owner: pick(["Priya Shah", "Jordan Lee", "Maya Chen", "Alex Morgan"], index),
      targetSegment: pick(["SMB", "Mid-Market", "Enterprise", "Operator", "Admin"], index)
    }))
  ];

  const feedback: FeedbackRecord[] = Array.from({ length: 1000 }, (_, index) => {
    const biasedAdminScenario = index < 210;
    const mobileScenario = index >= 210 && index < 360;
    let user = users[(index * 13) % users.length];
    if (biasedAdminScenario) {
      const adminEnterprise = users.filter((item) => item.role === "Admin" && item.segment === "Enterprise");
      user = adminEnterprise[index % adminEnterprise.length];
    }
    if (mobileScenario) {
      const enterpriseAdmins = users.filter((item) => item.role === "Admin" && item.segment === "Enterprise");
      user = enterpriseAdmins[index % enterpriseAdmins.length];
    }
    const linkedRoadmapItem = biasedAdminScenario
      ? "roadmap-admin-dashboard"
      : mobileScenario
        ? "roadmap-mobile-workflow"
        : index % 3 === 0
          ? roadmapItems[(index % roadmapItems.length)].id
          : undefined;
    const source = mobileScenario && index % 2 === 0 ? "Internal stakeholder" : pick(sources, index);
    return {
      id: `feedback-${index + 1}`,
      externalFeedbackId: `F-${String(index + 1).padStart(5, "0")}`,
      userId: user.id,
      accountId: user.accountId,
      source,
      feedbackText: linkedRoadmapItem
        ? `Evidence for ${roadmapItems.find((item) => item.id === linkedRoadmapItem)?.title}: workflow friction, confidence gaps, and segment-specific needs.`
        : "General product feedback about reporting, collaboration, setup, and workflow reliability.",
      topic: linkedRoadmapItem?.includes("mobile") ? "Mobile workflow" : linkedRoadmapItem?.includes("admin") ? "Admin dashboard" : pick(["Reporting", "Permissions", "Onboarding", "Reliability"], index),
      sentiment: pick(["Negative", "Neutral", "Positive"], index + 1),
      createdAtSource: new Date(2026, 6 - (index % 6), 1 + (index % 26)),
      linkedRoadmapItem,
      severity: pick(["Low", "Medium", "High", "Critical"], index + 2),
      revenueWeight: user.segment === "Enterprise" ? 2.2 : user.segment === "Mid-Market" ? 1.3 : 0.8
    };
  });

  const interviews: InterviewRecord[] = Array.from({ length: 80 }, (_, index) => {
    let user = users[(index * 17) % users.length];
    let linkedRoadmapItem: string | undefined;
    if (index < 18) {
      const admins = users.filter((item) => item.role === "Admin" && item.segment === "Enterprise");
      user = admins[index % admins.length];
      linkedRoadmapItem = "roadmap-admin-dashboard";
    } else if (index < 28) {
      const admins = users.filter((item) => item.role === "Admin");
      user = admins[index % admins.length];
      linkedRoadmapItem = "roadmap-mobile-workflow";
    } else if (index % 3 === 0) {
      linkedRoadmapItem = roadmapItems[index % roadmapItems.length].id;
    }
    return {
      id: `interview-${index + 1}`,
      externalInterviewId: `I-${String(index + 1).padStart(4, "0")}`,
      userId: user.id,
      researcher: pick(["Maya Chen", "Sam Rivera", "Anika Rao"], index),
      topic: linkedRoadmapItem?.includes("mobile") ? "Mobile workflow" : linkedRoadmapItem?.includes("admin") ? "Admin dashboard" : "Discovery interview",
      interviewDate: new Date(2026, 6 - (index % 5), 2 + (index % 24)),
      notes: "Synthetic interview notes covering user workflow, switching costs, severity, and unmet needs.",
      linkedRoadmapItem
    };
  });

  const evidence: EvidenceRecord[] = [
    ...feedback
      .filter((item) => item.linkedRoadmapItem)
      .map((item) => ({
        id: `ev-${item.id}`,
        roadmapItemId: item.linkedRoadmapItem!,
        evidenceType: "Feedback" as const,
        user: users.find((user) => user.id === item.userId)!,
        source: item.source,
        createdAt: item.createdAtSource,
        severity: item.severity,
        revenueWeight: item.revenueWeight,
        text: item.feedbackText
      })),
    ...interviews
      .filter((item) => item.linkedRoadmapItem)
      .map((item) => ({
        id: `ev-${item.id}`,
        roadmapItemId: item.linkedRoadmapItem!,
        evidenceType: "Interview" as const,
        user: users.find((user) => user.id === item.userId)!,
        source: "Customer interview",
        createdAt: item.interviewDate,
        text: item.notes
      }))
  ];

  const scores = new Map<string, ScoreBreakdown>();
  const blindSpots = new Map<string, BlindSpotRecord[]>();
  const recommendations = new Map<string, ResearchRecommendationRecord[]>();
  const reports = new Map<string, string>();

  for (const item of roadmapItems) {
    const itemEvidence = evidence.filter((record) => record.roadmapItemId === item.id);
    const score = calculateCoverageScore(item, users, itemEvidence, "role");
    const spots = detectBlindSpots(item, users, itemEvidence, score);
    const recs = generateResearchRecommendations(spots, item, users);
    scores.set(item.id, score);
    blindSpots.set(item.id, spots);
    recommendations.set(item.id, recs);
    reports.set(item.id, generateDecisionReport(item, score, spots, recs));
  }

  return { accounts, users, feedback, interviews, roadmapItems, evidence, scores, blindSpots, recommendations, reports };
}

export const demoData = buildDemoData();

export function getRoadmapEvidence(roadmapItemId: string) {
  return demoData.evidence.filter((item) => item.roadmapItemId === roadmapItemId);
}

export function getAllBlindSpots() {
  return Array.from(demoData.blindSpots.values()).flat();
}

export function getAllRecommendations() {
  return Array.from(demoData.recommendations.values()).flat();
}

export function getDashboardMetrics() {
  const allBlindSpots = getAllBlindSpots();
  const allRecommendations = getAllRecommendations();
  const scores = Array.from(demoData.scores.values());
  return {
    totalFeedback: demoData.feedback.length,
    totalRoadmap: demoData.roadmapItems.length,
    totalInterviews: demoData.interviews.length,
    averageCoverage: Math.round(scores.reduce((sum, score) => sum + score.overallScore, 0) / scores.length),
    roadmapWithBlindSpots: new Set(allBlindSpots.map((spot) => spot.roadmapItemId)).size,
    lowConfidence: scores.filter((score) => score.confidenceLabel === "Low" || score.confidenceLabel === "Insufficient Evidence").length,
    underrepresented: allBlindSpots.filter((spot) => spot.type.includes("underrepresented") || spot.type.includes("missing")).length,
    overrepresented: allBlindSpots.filter((spot) => spot.type.includes("overrepresented")).length,
    recommendationsOpen: allRecommendations.filter((rec) => rec.status === "Open").length,
    coverageImprovement: 18
  };
}
