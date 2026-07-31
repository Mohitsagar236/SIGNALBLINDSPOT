import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";

const sections = [
  ["Problem statement", "Product teams can collect large volumes of feedback and still make biased roadmap decisions when evidence comes from loud, reachable, high-revenue, or internal segments."],
  ["Target users", "Product Managers, Product Ops, Researchers, Growth PMs, Heads of Product, and B2B SaaS founders."],
  ["Jobs to be Done", "When preparing a roadmap decision, help me know whether the evidence represents the population affected by the decision so I can prioritize with confidence."],
  ["Current workflow pain", "Feedback dashboards optimize for tagging and volume, while PMs still manually reason about who is missing from the evidence."],
  ["Product hypothesis", "If PMs see representation gaps before prioritization, they will run sharper research and reduce post-launch surprises from ignored segments."],
  ["MVP scope", "CSV import, population modeling, evidence linking, scoring, blind-spot detection, recommendations, decision reports, and a dashboard."],
  ["Non-goals", "Generic feedback triage, sentiment-only analysis, CRM replacement, and AI-only summaries without explainable population math."],
  ["North-star metric", "Percentage of roadmap decisions supported by representative user evidence."],
  ["Prioritization framework", "Coverage score, severity of missing segments, target-segment fit, recency, source diversity, and ethical risk."],
  ["Scoring model", "Weighted score across evidence quantity, segment representation, source diversity, recency, target segment coverage, churn inclusion, and accessibility/language inclusion."],
  ["Blind-spot logic", "Rules identify underrepresented operators, missing churned users, non-English gaps, accessibility gaps, internal-stakeholder bias, old evidence, and overrepresented enterprise accounts."],
  ["Example decision", "Redesign Admin Dashboard looks popular by request count, but admins and enterprise accounts dominate evidence while operators are the majority of active users."],
  ["Ethical considerations", "Revenue weighting is visible but cannot fully override representation quality; the product encourages inclusive research before high-impact decisions."],
  ["Trade-offs", "The MVP favors explainable heuristics over opaque ML so PMs can defend the recommendation in prioritization review."],
  ["Go-to-market", "Start with Product Ops and B2B SaaS product teams that already centralize feedback but struggle with evidence quality."],
  ["Pricing idea", "Team tier based on roadmap decisions scored per month, with enterprise governance and audit exports."],
  ["Roadmap", "Deeper integrations, cohort-aware weighting, collaboration workflows, outcome tracking, and post-launch blind-spot retrospectives."],
  ["Resume positioning", "Designed and built SignalBlindspot, a product discovery platform that detects biased roadmap evidence by comparing feedback and interview coverage against the actual user population."]
];

export default function CaseStudyPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="PM portfolio case study" title="SignalBlindspot case study" description="A product discovery MVP focused on evidence quality, segmentation, responsible roadmap decisions, and execution." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map(([title, body]) => <Card key={title}><Badge tone="info">{title}</Badge><p className="mt-4 text-sm leading-6 text-slate-650">{body}</p></Card>)}
      </div>
    </AppShell>
  );
}
