import { ArrowUpRight, ClipboardCheck, Link2, MessageSquareText, Radar, UsersRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { AppShell } from "@/components/app-shell";
import { CompareBars } from "@/components/charts";
import { Badge, Card, MetricCard, PageHeader, ProgressBar, SectionHeader, confidenceTone } from "@/components/ui";
import { demoData, getRoadmapEvidence } from "@/lib/demo-data";
import { calculateActualPopulationDistribution, calculateEvidencePopulationDistribution } from "@/lib/scoring";

export default function RoadmapDetailPage({ params }: { params: { id: string } }) {
  const item = demoData.roadmapItems.find((record) => record.id === params.id);
  if (!item) notFound();
  const score = demoData.scores.get(item.id)!;
  const evidence = getRoadmapEvidence(item.id);
  const spots = demoData.blindSpots.get(item.id)!;
  const recs = demoData.recommendations.get(item.id)!;
  const actual = calculateActualPopulationDistribution(demoData.users, "role");
  const evidenceDistribution = calculateEvidencePopulationDistribution(evidence.map((record) => record.user), "role");
  const chart = actual.map((record) => ({
    segment: record.segment,
    actual: record.percentage,
    evidence: evidenceDistribution.find((item) => item.segment === record.segment)?.percentage ?? 0
  }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Roadmap decision"
        title={item.title}
        description={item.description}
        action={<Link href={`/roadmap/${item.id}/report`} className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-bold text-white shadow-sm">View report <ArrowUpRight size={16} aria-hidden /></Link>}
      />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard label="Evidence links" value={evidence.length} detail="Feedback and interviews" icon={<Link2 size={17} />} tone="info" />
        <MetricCard label="Blind spots" value={spots.length} detail="Detected representation risks" icon={<Radar size={17} />} tone={spots.length > 4 ? "bad" : "warn"} />
        <MetricCard label="Research actions" value={recs.length} detail="Generated recommendations" icon={<ClipboardCheck size={17} />} tone="warn" />
        <MetricCard label="Target segment" value={item.targetSegment} detail={item.productArea} icon={<UsersRound size={17} />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="overflow-hidden">
          <SectionHeader title="Evidence coverage score" description="Weighted view of evidence quantity, representation, diversity, recency, target fit, and inclusion." action={<Badge tone={confidenceTone(score.confidenceLabel)}>{score.confidenceLabel}</Badge>} />
          <div className="mt-4 flex items-center gap-5">
            <div
              className="score-ring grid size-36 shrink-0 place-items-center rounded-full"
              style={{ "--score": score.overallScore, "--ring-color": score.overallScore >= 60 ? "#4f6f52" : score.overallScore >= 40 ? "#d8a748" : "#e11d48" } as CSSProperties}
            >
              <div className="grid size-28 place-items-center rounded-full bg-white text-center shadow-inner">
                <div>
                  <div className="text-3xl font-black">{score.overallScore}</div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">of 100</div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm leading-6 text-slate-600">{score.explanation}</p>
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
                Revenue weighting can inform priority, but representation quality controls confidence.
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              ["Quantity", score.evidenceQuantityScore],
              ["Segment representation", score.segmentRepresentationScore],
              ["Source diversity", score.sourceDiversityScore],
              ["Recency", score.recencyScore],
              ["Target segment", score.targetSegmentCoverageScore],
              ["Churned inclusion", score.churnedUserInclusionScore],
              ["Accessibility/language", score.accessibilityLanguageInclusionScore]
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-1 flex justify-between text-sm font-semibold text-slate-600"><span>{label}</span><span>{value as number}</span></div>
                <ProgressBar value={value as number} tone={confidenceTone(score.confidenceLabel)} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Actual population vs evidence population" description="The gap chart explains why the score is not just a request count." />
          <CompareBars data={chart} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <SectionHeader title="Linked evidence" description="Recent feedback and interviews currently supporting this decision." action={<MessageSquareText size={18} className="text-slate-400" />} />
          <div className="mt-4 space-y-3">
            {evidence.slice(0, 8).map((record) => (
              <div key={record.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2"><span className="font-semibold">{record.source}</span><Badge>{record.evidenceType}</Badge></div>
                <p className="mt-1 text-sm text-slate-600">{record.user.role} - {record.user.segment} - {record.user.language}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Blind spots" description="Segments that could be ignored if the team prioritizes now." />
          <div className="mt-4 space-y-3">
            {spots.slice(0, 8).map((spot) => (
              <Link key={spot.id} href={`/blind-spots/${spot.id}`} className="block rounded-lg border border-slate-200 p-3 transition hover:border-moss/40 hover:bg-mist">
                <div className="flex items-center justify-between gap-2"><span className="font-semibold">{spot.type}</span><Badge tone={spot.severity === "Critical" ? "bad" : "warn"}>{spot.severity}</Badge></div>
                <p className="mt-1 text-sm text-slate-600">{spot.recommendedAction}</p>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Recommended research actions" description="Practical next steps before status moves to prioritized." />
          <div className="mt-4 space-y-3">
            {recs.slice(0, 8).map((rec) => (
              <Link key={rec.id} href={`/recommendations/${rec.id}`} className="block rounded-lg border border-slate-200 p-3 transition hover:border-moss/40 hover:bg-mist">
                <div className="font-semibold">{rec.title}</div>
                <p className="mt-1 text-sm text-slate-600">{rec.suggestedResearchMethod} - {rec.suggestedSampleSize} users</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
