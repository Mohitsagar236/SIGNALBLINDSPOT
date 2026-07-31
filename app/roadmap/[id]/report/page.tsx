import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, PageHeader } from "@/components/ui";
import { demoData } from "@/lib/demo-data";

export default function RoadmapReportPage({ params }: { params: { id: string } }) {
  const item = demoData.roadmapItems.find((record) => record.id === params.id);
  if (!item) notFound();
  const report = demoData.reports.get(item.id)!;
  return (
    <AppShell>
      <PageHeader eyebrow="Decision report" title={item.title} description="Copy or export this Markdown report for prioritization review." />
      <Card>
        <div className="mb-4 flex gap-3">
          <button className="focus-ring rounded-md bg-ink px-4 py-2 font-semibold text-white">Copy report</button>
          <a href={`data:text/markdown;charset=utf-8,${encodeURIComponent(report)}`} download={`${item.externalRoadmapItemId}-decision-report.md`} className="focus-ring rounded-md border border-slate-300 px-4 py-2 font-semibold">Export Markdown</a>
        </div>
        <pre className="whitespace-pre-wrap rounded-md bg-slate-950 p-5 text-sm leading-6 text-slate-100">{report}</pre>
      </Card>
    </AppShell>
  );
}
