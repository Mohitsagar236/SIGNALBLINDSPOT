import { AlertTriangle, ArrowUpRight, ClipboardList, FileText, FlaskConical, MessageSquareText, Users } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { CompareBars, TrendLine } from "@/components/charts";
import { Badge, Card, MetricCard, PageHeader, ProgressBar, SectionHeader, confidenceTone } from "@/components/ui";
import { demoData, getAllBlindSpots, getAllRecommendations, getDashboardMetrics } from "@/lib/demo-data";
import { calculateActualPopulationDistribution, calculateEvidencePopulationDistribution } from "@/lib/scoring";

export default function DashboardPage() {
  const metrics = getDashboardMetrics();
  const adminEvidence = demoData.evidence.filter((item) => item.roadmapItemId === "roadmap-admin-dashboard");
  const actual = calculateActualPopulationDistribution(demoData.users, "role");
  const evidence = calculateEvidencePopulationDistribution(adminEvidence.map((item) => item.user), "role");
  const comparison = actual.map((item) => ({
    segment: item.segment,
    actual: item.percentage,
    evidence: evidence.find((record) => record.segment === item.segment)?.percentage ?? 0
  }));
  const blindSpots = getAllBlindSpots().slice(0, 6);
  const recs = getAllRecommendations().slice(0, 5);
  const trend = Array.from(demoData.scores.values())
    .slice(0, 8)
    .map((score, index) => ({ label: `D${index + 1}`, score: score.overallScore }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Roadmap evidence quality"
        title="Evidence command center"
        description="Monitor which roadmap decisions are ready for prioritization, which are biased, and what research will improve confidence fastest."
        action={
          <Link href="/roadmap/roadmap-admin-dashboard" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-bold text-white shadow-sm">
            Review top risk <ArrowUpRight size={16} aria-hidden />
          </Link>
        }
      />

      <section className="noise-panel mb-6 overflow-hidden rounded-lg border border-slate-200/80 p-5 shadow-sm">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="warn">3 high-risk decisions</Badge>
              <Badge tone="info">Demo scenario active</Badge>
              <Badge tone="neutral">Last scored July 31, 2026</Badge>
            </div>
            <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-ink md:text-4xl">
              Admin demand is loud, but operators are missing from the evidence.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
              SignalBlindspot compares who gave evidence against who actually uses the product, then turns the gaps into research actions before roadmap lock.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/80 bg-white/80 p-4">
                <div className="text-sm font-bold text-slate-500">Operators actual</div>
                <div className="mt-1 text-2xl font-black text-ink">55%</div>
              </div>
              <div className="rounded-lg border border-white/80 bg-white/80 p-4">
                <div className="text-sm font-bold text-slate-500">Operators evidence</div>
                <div className="mt-1 text-2xl font-black text-rose-700">7%</div>
              </div>
              <div className="rounded-lg border border-white/80 bg-white/80 p-4">
                <div className="text-sm font-bold text-slate-500">Suggested action</div>
                <div className="mt-1 text-2xl font-black text-moss">5 interviews</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-500">North star</div>
                <div className="text-lg font-black text-ink">Representative roadmap decisions</div>
              </div>
              <Badge tone="warn">{metrics.averageCoverage}/100 avg.</Badge>
            </div>
            <div className="mt-5 space-y-4">
              {[
                ["Evidence coverage", metrics.averageCoverage, "warn"],
                ["Research actions open", Math.min(100, metrics.recommendationsOpen * 4), "info"],
                ["Coverage improvement", metrics.coverageImprovement, "good"]
              ].map(([label, value, tone]) => (
                <div key={label as string}>
                  <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600"><span>{label}</span><span>{value}%</span></div>
                  <ProgressBar value={value as number} tone={tone as "warn" | "info" | "good"} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Feedback items" value={metrics.totalFeedback} detail="Imported evidence volume" icon={<MessageSquareText size={17} />} tone="info" />
        <MetricCard label="Roadmap items" value={metrics.totalRoadmap} detail="Decisions under review" icon={<ClipboardList size={17} />} />
        <MetricCard label="Interviews" value={metrics.totalInterviews} detail="Research repository" icon={<Users size={17} />} tone="good" />
        <MetricCard label="Low confidence" value={metrics.lowConfidence} detail="Needs PM attention" icon={<AlertTriangle size={17} />} tone="bad" />
        <MetricCard label="Research actions" value={metrics.recommendationsOpen} detail="Open recommendations" icon={<FlaskConical size={17} />} tone="warn" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <SectionHeader
            title="Evidence vs actual population"
            description="Redesign Admin Dashboard shows the classic bias pattern: admins dominate evidence while operators dominate the actual user base."
          />
          <CompareBars data={comparison} />
        </Card>
        <Card>
          <SectionHeader title="Roadmap confidence trend" description="Coverage scores across the latest decisions." />
          <TrendLine data={trend} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <SectionHeader title="Decision risk queue" description="Start with the roadmap items where biased evidence could change prioritization." />
          <div className="mt-4 space-y-3">
            {demoData.roadmapItems.slice(0, 6).map((item) => {
              const score = demoData.scores.get(item.id)!;
              return (
                <Link key={item.id} href={`/roadmap/${item.id}`} className="block rounded-lg border border-slate-200 p-3 transition hover:border-moss/40 hover:bg-mist">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{item.title}</span>
                    <Badge tone={confidenceTone(score.confidenceLabel)}>{score.confidenceLabel}</Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="min-w-0 flex-1"><ProgressBar value={score.overallScore} tone={confidenceTone(score.confidenceLabel)} /></div>
                    <div className="text-sm font-bold text-slate-600">{score.overallScore}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Top blind spots" description="Automatically detected representation gaps." />
          <div className="mt-4 space-y-3">
            {blindSpots.map((spot) => (
              <div key={spot.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{spot.type}</span>
                  <Badge tone={spot.severity === "Critical" ? "bad" : "warn"}>{spot.severity}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{spot.explanation}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Research recommendations due" description="Concrete actions to improve decision confidence." action={<FileText size={18} className="text-slate-400" />} />
          <div className="mt-4 space-y-3">
            {recs.map((rec) => (
              <div key={rec.id} className="rounded-lg border border-slate-200 p-3">
                <div className="font-semibold">{rec.title}</div>
                <p className="mt-1 text-sm text-slate-600">{rec.suggestedResearchMethod} with {rec.suggestedSampleSize} users</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
