"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { clearSession, hashPassword, setSession, verifyPassword } from "../auth";
import { prisma } from "../prisma";

const credentialsSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function signupAction(_: unknown, formData: FormData) {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Enter a valid email and an 8+ character password." };
  const organization = await prisma.organization.create({ data: { name: "SignalBlindspot Demo Workspace" } });
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name ?? parsed.data.email.split("@")[0],
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.data.password),
      role: "Admin",
      organizationId: organization.id
    }
  });
  await prisma.scoringSetting.create({
    data: {
      organizationId: organization.id,
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
  await setSession(user.id);
  redirect("/dashboard");
}

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = credentialsSchema.omit({ name: true }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Enter a valid email and password." };
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { ok: false, error: "Invalid credentials." };
  }
  await setSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  clearSession();
  redirect("/");
}
