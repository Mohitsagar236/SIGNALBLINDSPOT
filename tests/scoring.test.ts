import { describe, expect, it } from "vitest";
import { demoData } from "../lib/demo-data";
import {
  calculateActualPopulationDistribution,
  calculateAccessibilityLanguageInclusionScore,
  calculateChurnedUserInclusionScore,
  calculateCoverageScore,
  calculateEvidencePopulationDistribution,
  calculateEvidenceQuantityScore,
  calculateOverallCoverageScore,
  calculateRecencyScore,
  calculateRepresentationGap,
  calculateSegmentRepresentationScore,
  calculateSourceDiversityScore,
  calculateTargetSegmentCoverageScore,
  defaultScoringWeights,
  detectBlindSpots,
  detectOverrepresentedSegments,
  detectUnderrepresentedSegments,
  determineDecisionConfidence,
  generateDecisionRecommendation,
  generateDecisionReport,
  generateResearchRecommendations,
  validateScoringWeights,
  validateWorkflowTransition
} from "../lib/scoring";

describe("scoring engine", () => {
  const roadmapItem = demoData.roadmapItems[0];
  const evidence = demoData.evidence.filter((item) => item.roadmapItemId === roadmapItem.id);
  const evidenceUsers = evidence.map((item) => item.user);
  const actual = calculateActualPopulationDistribution(demoData.users, "role");
  const evidenceDistribution = calculateEvidencePopulationDistribution(evidenceUsers, "role");
  const gaps = calculateRepresentationGap(actual, evidenceDistribution);

  it("calculates actual population distribution", () => {
    expect(actual.reduce((sum, item) => sum + item.count, 0)).toBe(500);
    expect(actual[0].segment).toBe("Operator");
  });

  it("calculates evidence population distribution", () => {
    expect(evidenceDistribution.reduce((sum, item) => sum + item.count, 0)).toBe(evidenceUsers.length);
    expect(evidenceDistribution[0].segment).toBe("Admin");
  });

  it("calculates representation gaps", () => {
    expect(gaps[0].direction).toMatch(/underrepresented|overrepresented/);
    expect(Math.abs(gaps[0].gap)).toBeGreaterThan(20);
  });

  it("detects overrepresented segments", () => {
    expect(detectOverrepresentedSegments(actual, evidenceDistribution).some((gap) => gap.segment === "Admin")).toBe(true);
  });

  it("detects underrepresented segments", () => {
    expect(detectUnderrepresentedSegments(actual, evidenceDistribution).some((gap) => gap.segment === "Operator")).toBe(true);
  });

  it("scores evidence quantity", () => {
    expect(calculateEvidenceQuantityScore(0, 10)).toBe(0);
    expect(calculateEvidenceQuantityScore(10, 10)).toBe(100);
  });

  it("scores segment representation", () => {
    expect(calculateSegmentRepresentationScore(gaps)).toBeLessThan(80);
  });

  it("scores source diversity", () => {
    expect(calculateSourceDiversityScore(["A", "B", "C", "D", "E"])).toBeGreaterThan(60);
    expect(calculateSourceDiversityScore([])).toBe(0);
  });

  it("scores recency", () => {
    expect(calculateRecencyScore([new Date("2026-07-20")], 180)).toBeGreaterThan(90);
    expect(calculateRecencyScore([])).toBe(0);
  });

  it("scores target segment coverage", () => {
    expect(calculateTargetSegmentCoverageScore("Admin", evidenceUsers)).toBeGreaterThan(50);
  });

  it("scores churned user inclusion", () => {
    expect(calculateChurnedUserInclusionScore([])).toBe(0);
  });

  it("scores accessibility and language inclusion", () => {
    expect(calculateAccessibilityLanguageInclusionScore(evidenceUsers)).toBeGreaterThanOrEqual(0);
  });

  it("calculates overall coverage score", () => {
    const score = calculateOverallCoverageScore(
      {
        evidenceQuantityScore: 100,
        segmentRepresentationScore: 50,
        sourceDiversityScore: 75,
        recencyScore: 90,
        targetSegmentCoverageScore: 80,
        churnedUserInclusionScore: 20,
        accessibilityLanguageInclusionScore: 20
      },
      defaultScoringWeights
    );
    expect(score).toBeGreaterThan(50);
  });

  it("determines confidence labels", () => {
    expect(determineDecisionConfidence(85)).toBe("High");
    expect(determineDecisionConfidence(65)).toBe("Medium");
    expect(determineDecisionConfidence(45)).toBe("Low");
    expect(determineDecisionConfidence(20)).toBe("Insufficient Evidence");
  });

  it("detects blind spots", () => {
    const score = calculateCoverageScore(roadmapItem, demoData.users, evidence);
    const spots = detectBlindSpots(roadmapItem, demoData.users, evidence, score);
    expect(spots.some((spot) => spot.type.includes("Operator"))).toBe(true);
  });

  it("generates research recommendations", () => {
    const score = calculateCoverageScore(roadmapItem, demoData.users, evidence);
    const spots = detectBlindSpots(roadmapItem, demoData.users, evidence, score);
    const recommendations = generateResearchRecommendations(spots, roadmapItem, demoData.users);
    expect(recommendations[0].suggestedSampleSize).toBeGreaterThan(0);
  });

  it("generates decision reports", () => {
    const score = calculateCoverageScore(roadmapItem, demoData.users, evidence);
    const spots = detectBlindSpots(roadmapItem, demoData.users, evidence, score);
    const recommendations = generateResearchRecommendations(spots, roadmapItem, demoData.users);
    expect(generateDecisionReport(roadmapItem, score, spots, recommendations)).toContain("Decision Recommendation");
  });

  it("validates scoring weights", () => {
    expect(validateScoringWeights(defaultScoringWeights)).toBe(true);
    expect(validateScoringWeights({ ...defaultScoringWeights, recency: 0.5 })).toBe(false);
  });

  it("validates workflow transitions", () => {
    expect(validateWorkflowTransition("Draft", "Evidence Review")).toBe(true);
    expect(validateWorkflowTransition("Shipped", "Draft")).toBe(false);
  });

  it("generates decision recommendation", () => {
    const score = calculateCoverageScore(roadmapItem, demoData.users, evidence);
    const spots = detectBlindSpots(roadmapItem, demoData.users, evidence, score);
    expect(generateDecisionRecommendation(score, spots)).toMatch(/Proceed|Collect|Do not|Re-scope/);
  });
});
