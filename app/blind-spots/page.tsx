import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { getAllBlindSpots } from "@/lib/demo-data";

export default function BlindSpotsPage() {
  const spots = getAllBlindSpots();
  return (
    <AppShell>
      <PageHeader eyebrow="Bias detection" title="Blind spots" description="Automatically detected evidence gaps across roadmap decisions." />
      <Card>
        <div className="grid gap-3 md:grid-cols-4"><select className="focus-ring rounded-md border border-slate-300 px-3 py-2"><option>All roadmap items</option></select><select className="focus-ring rounded-md border border-slate-300 px-3 py-2"><option>All severities</option></select><select className="focus-ring rounded-md border border-slate-300 px-3 py-2"><option>Open</option></select><input aria-label="Search blind spots" placeholder="Search blind spots" className="focus-ring rounded-md border border-slate-300 px-3 py-2" /></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {spots.map((spot) => <Link key={spot.id} href={`/blind-spots/${spot.id}`} className="rounded-md border border-slate-200 p-4 hover:bg-mist"><div className="flex justify-between gap-2"><h2 className="font-bold">{spot.type}</h2><Badge tone={spot.severity === "Critical" ? "bad" : "warn"}>{spot.severity}</Badge></div><p className="mt-2 text-sm text-slate-600">{spot.explanation}</p><p className="mt-3 text-sm font-semibold text-moss">{spot.recommendedAction}</p></Link>)}
        </div>
      </Card>
    </AppShell>
  );
}
