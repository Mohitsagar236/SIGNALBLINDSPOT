import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { demoData } from "@/lib/demo-data";

export default function FeedbackDetailPage({ params }: { params: { id: string } }) {
  const item = demoData.feedback.find((record) => record.id === params.id);
  if (!item) notFound();
  const user = demoData.users.find((record) => record.id === item.userId)!;
  const account = demoData.accounts.find((record) => record.id === item.accountId)!;
  return (
    <AppShell>
      <PageHeader eyebrow="Feedback detail" title={item.externalFeedbackId} description={item.feedbackText} />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="text-lg font-bold">Feedback</h2>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">
            <Detail label="Source" value={item.source} /><Detail label="Topic" value={item.topic} /><Detail label="Sentiment" value={item.sentiment} /><Detail label="Severity" value={item.severity} /><Detail label="Created" value={item.createdAtSource.toDateString()} /><Detail label="Revenue weight" value={String(item.revenueWeight)} />
          </dl>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">User and account</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div><Badge>{user.role}</Badge> <Badge>{user.segment}</Badge></div>
            <p>{user.region} - {user.language} - {user.activityLevel}</p>
            <p>{user.churnStatus} - accessibility: {user.accessibilityNeed}</p>
            <p className="font-semibold">{account.companyName}</p>
            <p>{account.industry} - ARR ${account.arr.toLocaleString()}</p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm font-semibold text-slate-500">{label}</dt><dd className="mt-1">{value}</dd></div>;
}
