import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { getAllRecommendations } from "@/lib/demo-data";

export default function RecommendationsPage() {
  const recs = getAllRecommendations();
  return (
    <AppShell>
      <PageHeader eyebrow="Research planning" title="Recommendations" description="Manage suggested research actions by segment, priority, owner, and status." />
      <Card>
        <div className="grid gap-3 md:grid-cols-4"><select className="focus-ring rounded-md border border-slate-300 px-3 py-2"><option>All priorities</option></select><select className="focus-ring rounded-md border border-slate-300 px-3 py-2"><option>All statuses</option></select><select className="focus-ring rounded-md border border-slate-300 px-3 py-2"><option>All owners</option></select><input placeholder="Search recommendations" className="focus-ring rounded-md border border-slate-300 px-3 py-2" /></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{recs.map((rec) => <Link key={rec.id} href={`/recommendations/${rec.id}`} className="rounded-md border border-slate-200 p-4 hover:bg-mist"><div className="flex justify-between gap-2"><h2 className="font-bold">{rec.title}</h2><Badge>{rec.priority}</Badge></div><p className="mt-2 text-sm text-slate-600">{rec.explanation}</p><p className="mt-3 text-sm font-semibold">{rec.suggestedResearchMethod} - {rec.suggestedSampleSize} users</p></Link>)}</div>
      </Card>
    </AppShell>
  );
}
