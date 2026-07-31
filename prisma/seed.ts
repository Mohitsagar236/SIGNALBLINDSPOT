import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { demoData } from "../lib/demo-data";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.organization.findFirst({ where: { name: "SignalBlindspot Demo Workspace" } });
  if (existing) await prisma.organization.delete({ where: { id: existing.id } });

  const org = await prisma.organization.create({ data: { name: "SignalBlindspot Demo Workspace" } });
  const passwordHash = await bcrypt.hash("SignalBlindspot123!", 12);

  const admin = await prisma.user.create({
    data: { name: "Avery Admin", email: "admin@signalblindspot.dev", passwordHash, role: "Admin", organizationId: org.id }
  });
  await prisma.user.createMany({
    data: [
      { name: "Priya Product", email: "pm@signalblindspot.dev", passwordHash, role: "Product Manager", organizationId: org.id },
      { name: "Maya Research", email: "researcher@signalblindspot.dev", passwordHash, role: "Researcher", organizationId: org.id },
      { name: "Vera Viewer", email: "viewer@signalblindspot.dev", passwordHash, role: "Viewer", organizationId: org.id }
    ]
  });

  await prisma.scoringSetting.create({
    data: {
      organizationId: org.id,
      evidenceQuantityWeight: 0.15,
      segmentRepresentationWeight: 0.3,
      sourceDiversityWeight: 0.15,
      recencyWeight: 0.1,
      targetSegmentCoverageWeight: 0.15,
      churnedUserInclusionWeight: 0.075,
      accessibilityLanguageInclusionWeight: 0.075,
      minimumEvidenceThreshold: 30,
      recencyThresholdDays: 180
    }
  });

  await prisma.account.createMany({
    data: demoData.accounts.map((account) => ({
      organizationId: org.id,
      externalAccountId: account.externalAccountId,
      companyName: account.companyName,
      segment: account.segment,
      arr: account.arr,
      plan: account.plan,
      region: account.region,
      industry: account.industry
    }))
  });
  const accountRows = await prisma.account.findMany({ where: { organizationId: org.id } });
  const accountByExternal = new Map(accountRows.map((account) => [account.externalAccountId, account.id]));
  const accountByDemo = new Map(demoData.accounts.map((account) => [account.id, accountByExternal.get(account.externalAccountId)!]));

  await prisma.endUser.createMany({
    data: demoData.users.map((user) => ({
      organizationId: org.id,
      externalUserId: user.externalUserId,
      accountId: accountByDemo.get(user.accountId),
      role: user.role,
      segment: user.segment,
      region: user.region,
      language: user.language,
      plan: user.plan,
      tenureMonths: user.tenureMonths,
      activityLevel: user.activityLevel,
      accessibilityNeed: user.accessibilityNeed,
      churnStatus: user.churnStatus
    }))
  });
  const userRows = await prisma.endUser.findMany({ where: { organizationId: org.id } });
  const userByExternal = new Map(userRows.map((user) => [user.externalUserId, user.id]));
  const userByDemo = new Map(demoData.users.map((user) => [user.id, userByExternal.get(user.externalUserId)!]));

  await prisma.roadmapItem.createMany({
    data: demoData.roadmapItems.map((item) => {
      const score = demoData.scores.get(item.id)!;
      return {
        organizationId: org.id,
        externalRoadmapItemId: item.externalRoadmapItemId,
        title: item.title,
        description: item.description,
        productArea: item.productArea,
        priority: item.priority,
        status: item.status,
        decisionDate: item.decisionDate,
        owner: item.owner,
        targetSegment: item.targetSegment,
        evidenceCoverageScore: score.overallScore,
        decisionConfidence: score.confidenceLabel
      };
    })
  });
  const roadmapRows = await prisma.roadmapItem.findMany({ where: { organizationId: org.id } });
  const roadmapByExternal = new Map(roadmapRows.map((item) => [item.externalRoadmapItemId, item.id]));
  const roadmapByDemo = new Map(demoData.roadmapItems.map((item) => [item.id, roadmapByExternal.get(item.externalRoadmapItemId)!]));

  await prisma.feedback.createMany({
    data: demoData.feedback.map((item) => ({
      organizationId: org.id,
      externalFeedbackId: item.externalFeedbackId,
      userId: userByDemo.get(item.userId),
      accountId: accountByDemo.get(item.accountId),
      source: item.source,
      feedbackText: item.feedbackText,
      topic: item.topic,
      sentiment: item.sentiment,
      createdAtSource: item.createdAtSource,
      severity: item.severity,
      revenueWeight: item.revenueWeight
    }))
  });
  await prisma.interview.createMany({
    data: demoData.interviews.map((item) => ({
      organizationId: org.id,
      externalInterviewId: item.externalInterviewId,
      userId: userByDemo.get(item.userId),
      researcher: item.researcher,
      topic: item.topic,
      interviewDate: item.interviewDate,
      notes: item.notes
    }))
  });

  const feedbackRows = await prisma.feedback.findMany({ where: { organizationId: org.id } });
  const interviewsRows = await prisma.interview.findMany({ where: { organizationId: org.id } });
  const feedbackByExternal = new Map(feedbackRows.map((item) => [item.externalFeedbackId, item.id]));
  const interviewByExternal = new Map(interviewsRows.map((item) => [item.externalInterviewId, item.id]));
  const evidenceLinks = [
    ...demoData.feedback
      .filter((item) => item.linkedRoadmapItem)
      .map((item) => ({
        organizationId: org.id,
        roadmapItemId: roadmapByDemo.get(item.linkedRoadmapItem!)!,
        evidenceType: "Feedback",
        feedbackId: feedbackByExternal.get(item.externalFeedbackId),
        linkReason: "Seeded from linked_roadmap_item",
        linkedById: admin.id,
        confidence: "Medium",
        notes: "Synthetic evidence link"
      })),
    ...demoData.interviews
      .filter((item) => item.linkedRoadmapItem)
      .map((item) => ({
        organizationId: org.id,
        roadmapItemId: roadmapByDemo.get(item.linkedRoadmapItem!)!,
        evidenceType: "Interview",
        interviewId: interviewByExternal.get(item.externalInterviewId),
        linkReason: "Seeded from linked_roadmap_item",
        linkedById: admin.id,
        confidence: "High",
        notes: "Synthetic interview link"
      }))
  ];
  await prisma.roadmapEvidenceLink.createMany({ data: evidenceLinks });

  for (const item of demoData.roadmapItems) {
    const roadmapItemId = roadmapByDemo.get(item.id)!;
    const score = demoData.scores.get(item.id)!;
    await prisma.coverageScore.create({
      data: {
        organizationId: org.id,
        roadmapItemId,
        overallScore: score.overallScore,
        evidenceQuantityScore: score.evidenceQuantityScore,
        segmentRepresentationScore: score.segmentRepresentationScore,
        sourceDiversityScore: score.sourceDiversityScore,
        recencyScore: score.recencyScore,
        targetSegmentCoverageScore: score.targetSegmentCoverageScore,
        churnedUserInclusionScore: score.churnedUserInclusionScore,
        accessibilityLanguageInclusionScore: score.accessibilityLanguageInclusionScore,
        confidenceLabel: score.confidenceLabel,
        explanation: score.explanation,
        scoreBreakdown: score as unknown as object
      }
    });
    for (const spot of demoData.blindSpots.get(item.id) ?? []) {
      const createdSpot = await prisma.blindSpot.create({
        data: {
          organizationId: org.id,
          roadmapItemId,
          type: spot.type,
          severity: spot.severity,
          explanation: spot.explanation,
          affectedSegment: spot.affectedSegment,
          actualPopulationPercentage: spot.actualPopulationPercentage,
          evidencePopulationPercentage: spot.evidencePopulationPercentage,
          representationGap: spot.representationGap,
          recommendedAction: spot.recommendedAction,
          status: spot.status,
          ownerId: admin.id
        }
      });
      const rec = (demoData.recommendations.get(item.id) ?? []).find((candidate) => candidate.blindSpotId === spot.id);
      if (rec) {
        await prisma.researchRecommendation.create({
          data: {
            organizationId: org.id,
            roadmapItemId,
            blindSpotId: createdSpot.id,
            title: rec.title,
            explanation: rec.explanation,
            recommendedSegment: rec.recommendedSegment,
            suggestedSampleSize: rec.suggestedSampleSize,
            suggestedResearchMethod: rec.suggestedResearchMethod,
            priority: rec.priority,
            expectedImpact: rec.expectedImpact,
            status: rec.status,
            ownerId: admin.id,
            notes: rec.notes
          }
        });
      }
    }
    await prisma.decisionReport.create({
      data: {
        organizationId: org.id,
        roadmapItemId,
        title: `Decision Report: ${item.title}`,
        markdownContent: demoData.reports.get(item.id)!,
        decisionRecommendation: score.overallScore >= 60 ? "Proceed with caution" : "Collect more evidence",
        createdById: admin.id
      }
    });
  }

  await prisma.importBatch.create({
    data: {
      organizationId: org.id,
      type: "demo",
      filename: "synthetic-demo-data",
      status: "Completed",
      totalRows: 1650,
      successfulRows: 1650,
      failedRows: 0
    }
  });

  console.log("Seed complete");
  console.log("Demo login: pm@signalblindspot.dev / SignalBlindspot123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
