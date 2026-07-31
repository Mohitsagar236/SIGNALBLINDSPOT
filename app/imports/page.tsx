import { AppShell } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { getRequiredColumns, type ImportType } from "@/lib/csv";
import { reloadDemoDataAction } from "@/lib/actions/product";

const types: ImportType[] = ["users", "accounts", "feedback", "interviews", "roadmap_items"];

export default function ImportsPage() {
  async function reloadDemo(formData: FormData) {
    "use server";
    void formData;
    await reloadDemoDataAction();
  }

  return (
    <AppShell>
      <PageHeader eyebrow="CSV imports" title="Imports" description="Upload, preview, validate, and reset imported evidence datasets." />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-lg font-bold">Upload CSV</h2>
          <form className="mt-4 space-y-4">
            <label className="block text-sm font-semibold">Dataset</label>
            <select name="type" className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2">{types.map((type) => <option key={type}>{type}</option>)}</select>
            <label className="block text-sm font-semibold">File</label>
            <input name="file" type="file" accept=".csv" className="focus-ring w-full rounded-md border border-slate-300 px-3 py-2" />
            <button className="focus-ring rounded-md bg-ink px-4 py-2 font-semibold text-white">Preview validation</button>
          </form>
          <form action={reloadDemo} className="mt-5">
            <button className="focus-ring rounded-md border border-slate-300 px-4 py-2 font-semibold">Reload demo data</button>
          </form>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">Column validation rules</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {types.map((type) => <div key={type} className="rounded border border-slate-200 p-3"><div className="font-semibold">{type}.csv</div><div className="mt-2 flex flex-wrap gap-1">{getRequiredColumns(type).map((column) => <Badge key={column}>{column}</Badge>)}</div></div>)}
          </div>
        </Card>
      </div>
      <Card className="mt-6">
        <h2 className="text-lg font-bold">Import history</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["users.csv", "accounts.csv", "feedback.csv"].map((file, index) => <div key={file} className="rounded border border-slate-200 p-3"><div className="font-semibold">{file}</div><p className="text-sm text-slate-600">Completed - {index === 0 ? 500 : index === 1 ? 50 : 1000} successful rows</p></div>)}
        </div>
      </Card>
    </AppShell>
  );
}
