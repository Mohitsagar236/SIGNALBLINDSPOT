import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { demoData, getAllRecommendations } from "@/lib/demo-data";

export default function RecommendationDetailPage({ params }: { params: { id: string } }) {
  const rec = getAllRecommendations().find((record) => record.id === params.id);
  if (!rec) notFound();
  const item = demoData.roadmapItems.find((record) => record.id === rec.roadmapItemId)!;
  return (
    <AppShell>
      <PageHeader eyebrow="Recommendation detail" title={rec.title} description={rec.explanation} />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card><h2 className="text-lg font-bold">Research plan</h2><div className="mt-4 space-y-2 text-sm"><p>Roadmap: {item.title}</p><p>Segment: {rec.recommendedSegment}</p><p>Method: {rec.suggestedResearchMethod}</p><p>Sample size: {rec.suggestedSampleSize}</p><Badge>{rec.priority}</Badge></div></Card>
        <Card><h2 className="text-lg font-bold">Manage status</h2><select className="focus-ring mt-4 w-full rounded-md border border-slate-300 px-3 py-2"><option>{rec.status}</option><option>Planned</option><option>In Progress</option><option>Completed</option><option>Dismissed</option></select><input className="focus-ring mt-3 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={rec.owner} /></Card>
        <Card><h2 className="text-lg font-bold">Notes</h2><textarea aria-label="Recommendation notes" className="focus-ring mt-4 h-32 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={rec.notes} /></Card>
      </div>
    </AppShell>
  );
}
