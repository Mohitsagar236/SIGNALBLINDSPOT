import { AppShell } from "@/components/app-shell";
import { CompareBars } from "@/components/charts";
import { Badge, Card, PageHeader } from "@/components/ui";
import { demoData } from "@/lib/demo-data";
import { calculateActualPopulationDistribution, calculateEvidencePopulationDistribution } from "@/lib/scoring";

export default function SegmentsPage() {
  const evidence = demoData.evidence.filter((item) => item.roadmapItemId === "roadmap-admin-dashboard");
  const actualRoles = calculateActualPopulationDistribution(demoData.users, "role");
  const evidenceRoles = calculateEvidencePopulationDistribution(evidence.map((item) => item.user), "role");
  const data = actualRoles.map((item) => ({ segment: item.segment, actual: item.percentage, evidence: evidenceRoles.find((record) => record.segment === item.segment)?.percentage ?? 0 }));
  const dimensions = ["User role", "Customer segment", "Region", "Language", "Plan", "Activity level", "Tenure", "Accessibility need", "Churn status", "Account ARR band", "Industry"];
  return (
    <AppShell>
      <PageHeader eyebrow="Segment modeling" title="Segments" description="Define which population dimensions matter for a roadmap decision and compare actual vs evidence coverage." />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-lg font-bold">Default scoring dimensions</h2>
          <div className="mt-4 flex flex-wrap gap-2">{dimensions.map((dimension) => <Badge key={dimension}>{dimension}</Badge>)}</div>
          <form className="mt-6 space-y-4">
            <label className="block text-sm font-semibold">Custom segment name</label>
            <input className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" defaultValue="Enterprise Admins in Europe using Business plan" />
            <label className="block text-sm font-semibold">Dimension</label>
            <select className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2"><option>Role + Segment + Region + Plan</option></select>
            <button className="focus-ring rounded-md bg-ink px-4 py-2 font-semibold text-white">Save segment definition</button>
          </form>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">Actual population vs evidence population</h2>
          <CompareBars data={data} />
        </Card>
      </div>
    </AppShell>
  );
}
