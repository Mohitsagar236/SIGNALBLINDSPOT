import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Radar,
  Scale,
  SearchCheck,
  ShieldAlert,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";

export default function LandingPage() {
  const features: Array<{ Icon: LucideIcon; title: string; body: string }> = [
    { Icon: BarChart3, title: "Evidence coverage scoring", body: "Seven explainable factors with configurable weights." },
    { Icon: Radar, title: "Blind-spot detection", body: "Rules for target gaps, churned users, accessibility, language, and source bias." },
    { Icon: Scale, title: "Responsible prioritization", body: "Revenue can influence priority without overriding representativeness." },
    { Icon: CheckCircle2, title: "Decision reports", body: "Markdown-ready reports for product review meetings." }
  ];

  return (
    <main className="text-ink">
      <section className="mx-auto grid min-h-[86vh] max-w-7xl gap-10 px-6 py-8 md:grid-cols-[1.02fr_0.98fr] md:items-center">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="info">Product discovery platform</Badge>
            <Badge tone="warn">Representative evidence review</Badge>
          </div>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            SignalBlindspot
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-600">
            Find the user segments your roadmap is ignoring. Detect biased roadmap evidence before teams commit to the wrong priorities.
          </p>
          <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["500", "synthetic users"],
              ["1,080", "evidence items"],
              ["20", "roadmap decisions"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm">
                <div className="text-2xl font-black">{value}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 font-bold text-white shadow-sm">
              Open demo <ArrowRight size={18} aria-hidden />
            </Link>
            <Link href="/case-study" className="focus-ring rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold shadow-sm">
              Read PM case study
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_30px_70px_rgba(24,33,47,0.12)]">
          <div className="rounded-lg border border-slate-200 bg-[#f9faf7] p-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-moss">Example blind-spot report</div>
                <div className="mt-1 text-xl font-black">Redesign Admin Dashboard</div>
              </div>
              <Badge tone="warn">Low confidence</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-4">
                <div className="text-sm font-bold text-slate-500">Coverage score</div>
                <div className="mt-1 text-3xl font-black text-amber-700">52</div>
              </div>
              <div className="rounded-lg bg-white p-4">
                <div className="text-sm font-bold text-slate-500">Blind spots</div>
                <div className="mt-1 text-3xl font-black text-rose-700">6</div>
              </div>
              <div className="rounded-lg bg-white p-4">
                <div className="text-sm font-bold text-slate-500">Next research</div>
                <div className="mt-1 text-3xl font-black text-moss">5</div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
              <ShieldAlert size={16} className="text-coral" aria-hidden />
              Representation gaps
            </div>
            {[
              ["Operators", "55% of users", "7% of evidence", "Critical"],
              ["Admins", "15% of users", "68% of evidence", "High"],
              ["Churned users", "9% of users", "0% of evidence", "High"]
            ].map(([segment, actual, evidence, severity]) => (
              <div key={segment} className="grid grid-cols-[1fr_auto] gap-4 rounded-lg border border-slate-200 p-4">
                <div>
                  <div className="font-bold">{segment}</div>
                  <div className="mt-1 text-sm text-slate-600">{actual} vs {evidence}</div>
                </div>
                <Badge tone={severity === "Critical" ? "bad" : "warn"}>{severity}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-moss/20 bg-moss/5 p-4 text-sm font-semibold leading-6 text-moss">
            Recommendation: interview operator users and recently churned admins before prioritization.
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/80">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-12 md:grid-cols-4">
          {[
            ["Compare", "Actual user population against linked evidence."],
            ["Score", "Coverage, diversity, recency, target fit, and inclusion."],
            ["Detect", "Underrepresented and overrepresented roadmap segments."],
            ["Recommend", "Research actions PMs can run before prioritization."]
          ].map(([title, body]) => (
            <Card key={title} className="transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(24,33,47,0.1)]">
              <SearchCheck className="text-moss" aria-hidden />
              <h2 className="mt-4 text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-black tracking-tight">Built for decision quality, not feedback volume.</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Normal feedback tools count requests. SignalBlindspot asks who requested it, who never got represented, and what research should happen before prioritization.
          </p>
        </div>
        <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
          {features.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid size-10 place-items-center rounded-lg bg-coral/10 text-coral">
                <Icon aria-hidden />
              </div>
              <h3 className="mt-4 font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
