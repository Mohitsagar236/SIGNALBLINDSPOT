"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "../auth";
import { validateCsv, type ImportType } from "../csv";
import { demoData } from "../demo-data";
import { prisma } from "../prisma";
import {
  calculateCoverageScore,
  detectBlindSpots,
  generateDecisionReport,
  generateResearchRecommendations
} from "../scoring";

async function currentOrgId() {
  const current = await getCurrentUser();
  return current?.organizationId ?? null;
}

export async function updateScoringSettingsAction(_: unknown, formData: FormData) {
  const organizationId = await currentOrgId();
  if (!organizationId) return { ok: false, error: "Login required." };
  const schema = z.object({
    evidenceQuantityWeight: z.coerce.number().min(0),
    segmentRepresentationWeight: z.coerce.number().min(0),
    sourceDiversityWeight: z.coerce.number().min(0),
    recencyWeight: z.coerce.number().min(0),
    targetSegmentCoverageWeight: z.coerce.number().min(0),
    churnedUserInclusionWeight: z.coerce.number().min(0),
    accessibilityLanguageInclusionWeight: z.coerce.number().min(0),
    minimumEvidenceThreshold: z.coerce.number().int().min(1),
    recencyThresholdDays: z.coerce.number().int().min(1)
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Invalid scoring settings." };
  await prisma.scoringSetting.upsert({
    where: { organizationId },
    create: { organizationId, ...parsed.data },
    update: parsed.data
  });
  revalidatePath("/settings");
  return { ok: true };
}

export async function createEvidenceLinkAction(_: unknown, formData: FormData) {
  const organizationId = await currentOrgId();
  if (!organizationId) return { ok: false, error: "Login required." };
  const parsed = z
    .object({
      roadmapItemId: z.string().min(1),
      evidenceType: z.enum(["Feedback", "Interview"]),
      feedbackId: z.string().optional(),
      interviewId: z.string().optional(),
      linkReason: z.string().min(2),
      confidence: z.string().min(1),
      notes: z.string().optional()
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Invalid evidence link." };
  const current = await getCurrentUser();
  await prisma.roadmapEvidenceLink.create({
    data: { organizationId, ...parsed.data, linkedById: current?.id }
  });
  revalidatePath(`/roadmap/${parsed.data.roadmapItemId}`);
  return { ok: true };
}

export async function previewCsvAction(_: unknown, formData: FormData) {
  const type = formData.get("type") as ImportType;
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Upload a CSV file." };
  const text = await file.text();
  return { ok: true, preview: validateCsv(type, text) };
}

export async function reloadDemoDataAction() {
  const organizationId = await currentOrgId();
  if (!organizationId) return { ok: false, error: "Login required." };
  await prisma.importBatch.create({
    data: {
      organizationId,
      type: "demo",
      filename: "synthetic-demo-data",
      status: "Completed",
      totalRows: 1650,
      successfulRows: 1650,
      failedRows: 0
    }
  });
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function calculateDemoScoreAction(_: unknown, formData: FormData) {
  const roadmapItemId = String(formData.get("roadmapItemId") ?? "");
  const item = demoData.roadmapItems.find((record) => record.id === roadmapItemId);
  if (!item) return { ok: false, error: "Roadmap item not found." };
  const evidence = demoData.evidence.filter((record) => record.roadmapItemId === roadmapItemId);
  const score = calculateCoverageScore(item, demoData.users, evidence);
  const blindSpots = detectBlindSpots(item, demoData.users, evidence, score);
  const recommendations = generateResearchRecommendations(blindSpots, item, demoData.users);
  return { ok: true, score, blindSpots, recommendations, report: generateDecisionReport(item, score, blindSpots, recommendations) };
}
