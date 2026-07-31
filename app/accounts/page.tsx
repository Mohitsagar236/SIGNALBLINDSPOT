import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { demoData } from "@/lib/demo-data";

export default function AccountsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Customer model" title="Accounts" description="Account distribution by segment, ARR, plan, region, and industry." />
      <Card>
        <div className="table-scroll overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-slate-200 text-slate-500"><tr><th className="py-3">Company</th><th>Segment</th><th>ARR</th><th>Plan</th><th>Region</th><th>Industry</th></tr></thead><tbody>{demoData.accounts.map((account) => <tr key={account.id} className="border-b border-slate-100"><td className="py-3 font-semibold">{account.companyName}</td><td><Badge>{account.segment}</Badge></td><td>${account.arr.toLocaleString()}</td><td>{account.plan}</td><td>{account.region}</td><td>{account.industry}</td></tr>)}</tbody></table>
        </div>
      </Card>
    </AppShell>
  );
}
