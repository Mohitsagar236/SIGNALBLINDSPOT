import { expect, test } from "@playwright/test";

test("demo user can inspect roadmap evidence and export report", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("SignalBlindspot").first()).toBeVisible();
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Evidence command center" })).toBeVisible();
  await page.goto("/roadmap/roadmap-admin-dashboard", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Redesign Admin Dashboard" })).toBeVisible();
  await expect(page.getByText("Evidence coverage score")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Blind spots" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recommended research actions" })).toBeVisible();
  await page.goto("/roadmap/roadmap-admin-dashboard/report", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Decision Report: Redesign Admin Dashboard")).toBeVisible();
});
