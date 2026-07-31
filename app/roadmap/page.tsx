import { AlertTriangle, ArrowUpDown, CalendarClock, Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, MetricCard, PageHeader, ProgressBar, SectionHeader, confidenceTone } from "@/components/ui";
import { demoData, getRoadmapEvidence } from "@/lib/demo-data";

export default function RoadmapPage() {
  const lowConfidence = Array.from(demoData.scores.values()).filter((score) => score.confidenceLabel === "Low" || score.confidenceLabel === "Insufficient Evidence").length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Decision evidence"
        title="Roadmap evidence review"
        description="Search, filter, and sort roadmap decisions by evidence quality, confidence, priority, owner, and status."
        action={<button className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} aria-hidden /> New roadmap item</button>}
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard label="Decision backlog" value={demoData.roadmapItems.length} detail="Items awaiting evidence review" icon={<CalendarClock size={17} />} />
        <MetricCard label="Low-confidence items" value={lowConfidence} detail="Need research before prioritization" icon={<AlertTriangle size={17} />} tone="bad" />
        <MetricCard label="Avg evidence per item" value={Math.round(demoData.evidence.length / demoData.roadmapItems.length)} detail="Feedback and interview links" icon={<ArrowUpDown size={17} />} tone="info" />
      </div>
      <Card>
        <SectionHeader title="Prioritization queue" description="Coverage score combines quantity, representation, diversity, recency, target fit, churned users, and inclusion." />
        <div className="grid gap-3 md:grid-cols-5">
          <label className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} aria-hidden />
            <input aria-label="Search roadmap" placeholder="Search roadmap" className="focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pl-10" />
          </label>
          <label className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} aria-hidden />
            <select aria-label="Filter by product area" className="focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pl-10"><option>All product areas</option><option>Administration</option><option>Mobile</option></select>
          </label>
          <select aria-label="Filter by confidence" className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2.5"><option>All confidence levels</option><option>High</option><option>Medium</option><option>Low</option></select>
          <select aria-label="Sort roadmap" className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2.5"><option>Sort by coverage score</option><option>Priority</option><option>Decision date</option></select>
        </div>
        <div className="table-scroll mt-5 overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="border-b border-slate-200 py-3">Roadmap item</th>
                <th className="border-b border-slate-200">Area</th>
                <th className="border-b border-slate-200">Owner</th>
                <th className="border-b border-slate-200">Status</th>
                <th className="border-b border-slate-200">Evidence</th>
                <th className="border-b border-slate-200">Coverage</th>
                <th className="border-b border-slate-200">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {demoData.roadmapItems.map((item) => {
                const score = demoData.scores.get(item.id)!;
                const tone = confidenceTone(score.confidenceLabel);
                return (
                  <tr key={item.id} className="group">
                    <td className="border-b border-slate-100 py-4">
                      <Link href={`/roadmap/${item.id}`} className="font-bold text-ink group-hover:text-moss">{item.title}</Link>
                      <div className="mt-1 text-xs text-slate-500">Target: {item.targetSegment}</div>
                    </td>
                    <td className="border-b border-slate-100">{item.productArea}</td>
                    <td className="border-b border-slate-100">{item.owner}</td>
                    <td className="border-b border-slate-100"><Badge>{item.status}</Badge></td>
                    <td className="border-b border-slate-100 font-bold">{getRoadmapEvidence(item.id).length}</td>
                    <td className="border-b border-slate-100">
                      <div className="flex min-w-40 items-center gap-3">
                        <div className="flex-1"><ProgressBar value={score.overallScore} tone={tone} /></div>
                        <span className="w-10 text-right font-bold">{score.overallScore}</span>
                      </div>
                    </td>
                    <td className="border-b border-slate-100"><Badge tone={tone}>{score.confidenceLabel}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
