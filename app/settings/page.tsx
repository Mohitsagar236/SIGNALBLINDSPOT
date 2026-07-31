import { AppShell } from "@/components/app-shell";
import { Card, PageHeader } from "@/components/ui";
import { updateScoringSettingsAction } from "@/lib/actions/product";

const fields = [
  ["evidenceQuantityWeight", "Evidence quantity", 0.15],
  ["segmentRepresentationWeight", "Segment representation", 0.3],
  ["sourceDiversityWeight", "Source diversity", 0.15],
  ["recencyWeight", "Recency", 0.1],
  ["targetSegmentCoverageWeight", "Target segment coverage", 0.15],
  ["churnedUserInclusionWeight", "Churned user inclusion", 0.075],
  ["accessibilityLanguageInclusionWeight", "Accessibility/language inclusion", 0.075]
] as const;

export default function SettingsPage() {
  async function saveSettings(formData: FormData) {
    "use server";
    await updateScoringSettingsAction(null, formData);
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Workspace controls" title="Settings" description="Configure organization profile, scoring weights, thresholds, segment dimensions, and demo data." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">Scoring weights</h2>
          <form action={saveSettings} className="mt-4 grid gap-4">
            {fields.map(([name, label, value]) => <label key={name} className="grid gap-2 text-sm font-semibold">{label}<input name={name} type="number" min="0" max="1" step="0.001" defaultValue={value} className="focus-ring rounded-md border border-slate-300 px-3 py-2" /></label>)}
            <label className="grid gap-2 text-sm font-semibold">Minimum evidence threshold<input name="minimumEvidenceThreshold" type="number" defaultValue={30} className="focus-ring rounded-md border border-slate-300 px-3 py-2" /></label>
            <label className="grid gap-2 text-sm font-semibold">Recency threshold days<input name="recencyThresholdDays" type="number" defaultValue={180} className="focus-ring rounded-md border border-slate-300 px-3 py-2" /></label>
            <button className="focus-ring rounded-md bg-ink px-4 py-2 font-semibold text-white">Save settings</button>
          </form>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">Organization profile</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-semibold">Workspace name<input defaultValue="SignalBlindspot Demo Workspace" className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2" /></label>
            <label className="block text-sm font-semibold">Default dimensions<textarea defaultValue="role, segment, region, language, plan, activityLevel, churnStatus, accessibilityNeed" className="focus-ring mt-2 h-24 w-full rounded-md border border-slate-300 px-3 py-2" /></label>
            <button className="focus-ring rounded-md border border-slate-300 px-4 py-2 font-semibold">Reset to defaults</button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
