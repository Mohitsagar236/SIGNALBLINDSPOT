import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { demoData, getAllBlindSpots } from "@/lib/demo-data";

export default function BlindSpotDetailPage({ params }: { params: { id: string } }) {
  const spot = getAllBlindSpots().find((record) => record.id === params.id);
  if (!spot) notFound();
  const item = demoData.roadmapItems.find((record) => record.id === spot.roadmapItemId)!;
  return (
    <AppShell>
      <PageHeader eyebrow="Blind-spot detail" title={spot.type} description={spot.explanation} />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card><h2 className="text-lg font-bold">Status</h2><div className="mt-4 space-y-3"><Badge tone={spot.severity === "Critical" ? "bad" : "warn"}>{spot.severity}</Badge><p>{spot.status}</p><p className="text-sm text-slate-600">Roadmap: {item.title}</p></div></Card>
        <Card><h2 className="text-lg font-bold">Population gap</h2><div className="mt-4 text-sm"><p>Actual: {spot.actualPopulationPercentage}%</p><p>Evidence: {spot.evidencePopulationPercentage}%</p><p>Gap: {spot.representationGap}pp</p></div></Card>
        <Card><h2 className="text-lg font-bold">Resolution</h2><p className="mt-4 text-sm text-slate-600">{spot.recommendedAction}</p><textarea aria-label="Resolution notes" className="focus-ring mt-4 h-28 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Resolution notes" /></Card>
      </div>
    </AppShell>
  );
}
