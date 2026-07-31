import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader, confidenceTone } from "@/components/ui";
import { demoData } from "@/lib/demo-data";

export default function ReportsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Decision reports" title="Reports" description="Recently generated reports for roadmap prioritization reviews." />
      <Card>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {demoData.roadmapItems.slice(0, 12).map((item) => {
            const score = demoData.scores.get(item.id)!;
            return <Link key={item.id} href={`/roadmap/${item.id}/report`} className="rounded-md border border-slate-200 p-4 hover:bg-mist"><div className="flex items-start justify-between gap-2"><h2 className="font-bold">{item.title}</h2><Badge tone={confidenceTone(score.confidenceLabel)}>{score.confidenceLabel}</Badge></div><p className="mt-2 text-sm text-slate-600">{score.overallScore}/100 evidence coverage</p></Link>;
          })}
        </div>
      </Card>
    </AppShell>
  );
}
