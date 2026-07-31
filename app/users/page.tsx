import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { demoData } from "@/lib/demo-data";

export default function UsersPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Actual population" title="End users" description="Synthetic imported user population used as the representativeness baseline." />
      <Card>
        <div className="table-scroll max-h-[720px] overflow-auto">
          <table className="w-full min-w-[900px] text-left text-sm"><thead className="sticky top-0 border-b border-slate-200 bg-white text-slate-500"><tr><th className="py-3">User</th><th>Role</th><th>Segment</th><th>Region</th><th>Language</th><th>Plan</th><th>Activity</th><th>Churn</th><th>Access</th></tr></thead><tbody>{demoData.users.slice(0, 180).map((user) => <tr key={user.id} className="border-b border-slate-100"><td className="py-3 font-semibold">{user.externalUserId}</td><td>{user.role}</td><td><Badge>{user.segment}</Badge></td><td>{user.region}</td><td>{user.language}</td><td>{user.plan}</td><td>{user.activityLevel}</td><td>{user.churnStatus}</td><td>{user.accessibilityNeed}</td></tr>)}</tbody></table>
        </div>
      </Card>
    </AppShell>
  );
}
