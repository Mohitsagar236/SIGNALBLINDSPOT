import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { demoData } from "@/lib/demo-data";

export default function FeedbackPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Feedback explorer" title="Feedback" description="Search feedback text and filter by topic, source, segment, sentiment, severity, roadmap item, and date." />
      <Card>
        <div className="grid gap-3 md:grid-cols-6">
          <input aria-label="Search feedback text" placeholder="Search feedback" className="focus-ring rounded-md border border-slate-300 px-3 py-2 md:col-span-2" />
          {["Topic", "Source", "Role", "Segment"].map((label) => <select key={label} aria-label={`Filter by ${label}`} className="focus-ring rounded-md border border-slate-300 px-3 py-2"><option>{label}</option></select>)}
        </div>
        <div className="table-scroll mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500"><tr><th className="py-3">Feedback</th><th>Source</th><th>Topic</th><th>User</th><th>Sentiment</th><th>Severity</th><th>Roadmap</th></tr></thead>
            <tbody>
              {demoData.feedback.slice(0, 80).map((item) => {
                const user = demoData.users.find((record) => record.id === item.userId)!;
                return (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-3"><Link href={`/feedback/${item.id}`} className="font-semibold hover:text-moss">{item.externalFeedbackId}</Link><div className="max-w-xl truncate text-xs text-slate-500">{item.feedbackText}</div></td>
                    <td>{item.source}</td><td>{item.topic}</td><td>{user.role} / {user.segment}</td><td>{item.sentiment}</td><td><Badge>{item.severity}</Badge></td><td>{item.linkedRoadmapItem ?? "Unlinked"}</td>
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
