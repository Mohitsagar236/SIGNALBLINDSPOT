import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const cookieName = "signalblindspot_user";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function setSession(userId: string) {
  cookies().set(cookieName, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSession() {
  cookies().delete(cookieName);
}

export async function getCurrentUser() {
  const userId = cookies().get(cookieName)?.value;
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true }
  });
}
