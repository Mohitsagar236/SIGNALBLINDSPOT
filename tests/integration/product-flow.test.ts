import { describe, expect, it } from "vitest";
import { validateCsv } from "../../lib/csv";
import { demoData } from "../../lib/demo-data";
import {
  calculateCoverageScore,
  detectBlindSpots,
  generateDecisionReport,
  generateResearchRecommendations
} from "../../lib/scoring";

describe("product integration flow", () => {
  it("imports users and calculates a score", () => {
    const csv = `user_id,account_id,role,segment,region,language,plan,tenure_months,activity_level,accessibility_need,churn_status
U-1,A-1,Operator,SMB,India,Hindi,Starter,4,Medium,None,Active`;
    expect(validateCsv("users", csv).validRows).toBe(1);
    const roadmapItem = demoData.roadmapItems[0];
    const evidence = demoData.evidence.filter((item) => item.roadmapItemId === roadmapItem.id);
    expect(calculateCoverageScore(roadmapItem, demoData.users, evidence).overallScore).toBeGreaterThan(0);
  });

  it("links evidence to roadmap item and detects blind spots", () => {
    const roadmapItem = demoData.roadmapItems[0];
    const evidence = demoData.evidence.filter((item) => item.roadmapItemId === roadmapItem.id);
    const score = calculateCoverageScore(roadmapItem, demoData.users, evidence);
    expect(detectBlindSpots(roadmapItem, demoData.users, evidence, score).length).toBeGreaterThan(0);
  });

  it("generates recommendations from blind spots", () => {
    const roadmapItem = demoData.roadmapItems[1];
    const evidence = demoData.evidence.filter((item) => item.roadmapItemId === roadmapItem.id);
    const score = calculateCoverageScore(roadmapItem, demoData.users, evidence);
    const spots = detectBlindSpots(roadmapItem, demoData.users, evidence, score);
    expect(generateResearchRecommendations(spots, roadmapItem, demoData.users).length).toBeGreaterThan(0);
  });

  it("generates a decision report from scoring outputs", () => {
    const roadmapItem = demoData.roadmapItems[0];
    const evidence = demoData.evidence.filter((item) => item.roadmapItemId === roadmapItem.id);
    const score = calculateCoverageScore(roadmapItem, demoData.users, evidence);
    const spots = detectBlindSpots(roadmapItem, demoData.users, evidence, score);
    const recs = generateResearchRecommendations(spots, roadmapItem, demoData.users);
    expect(generateDecisionReport(roadmapItem, score, spots, recs)).toContain(roadmapItem.title);
  });
});
