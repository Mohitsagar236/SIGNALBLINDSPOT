import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { demoData } from "@/lib/demo-data";

export default function InterviewsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Research repository" title="Interviews" description="Inspect interview coverage by researcher, topic, user segment, roadmap item, and source quality." />
      <Card>
        <div className="grid gap-3 md:grid-cols-5"><input aria-label="Search interview notes" placeholder="Search notes" className="focus-ring rounded-md border border-slate-300 px-3 py-2 md:col-span-2" /><select className="focus-ring rounded-md border border-slate-300 px-3 py-2"><option>Researcher</option></select><select className="focus-ring rounded-md border border-slate-300 px-3 py-2"><option>Topic</option></select><select className="focus-ring rounded-md border border-slate-300 px-3 py-2"><option>Roadmap item</option></select></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {demoData.interviews.map((item) => {
            const user = demoData.users.find((record) => record.id === item.userId)!;
            return <Link href={`/interviews/${item.id}`} key={item.id} className="rounded-md border border-slate-200 p-4 hover:bg-mist"><div className="flex justify-between gap-2"><h2 className="font-bold">{item.topic}</h2><Badge>{item.researcher}</Badge></div><p className="mt-2 text-sm text-slate-600">{user.role} - {user.segment} - {user.language}</p><p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.notes}</p></Link>;
          })}
        </div>
      </Card>
    </AppShell>
  );
}
