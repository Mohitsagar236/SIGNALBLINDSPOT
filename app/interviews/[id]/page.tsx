import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { demoData } from "@/lib/demo-data";

export default function InterviewDetailPage({ params }: { params: { id: string } }) {
  const item = demoData.interviews.find((record) => record.id === params.id);
  if (!item) notFound();
  const user = demoData.users.find((record) => record.id === item.userId)!;
  return (
    <AppShell>
      <PageHeader eyebrow="Interview detail" title={item.topic} description={item.notes} />
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <Detail label="Researcher" value={item.researcher} /><Detail label="Date" value={item.interviewDate.toDateString()} /><Detail label="Linked roadmap" value={item.linkedRoadmapItem ?? "Unlinked"} />
          <div className="md:col-span-3"><Badge>{user.role}</Badge> <Badge>{user.segment}</Badge> <Badge>{user.region}</Badge> <Badge>{user.churnStatus}</Badge></div>
        </div>
      </Card>
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm font-semibold text-slate-500">{label}</dt><dd className="mt-1">{value}</dd></div>;
}
