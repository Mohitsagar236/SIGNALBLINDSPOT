import clsx from "clsx";
import type { ReactNode } from "react";

type Tone = "neutral" | "good" | "warn" | "bad" | "info";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold leading-none",
        tone === "good" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "warn" && "border-amber-200 bg-amber-50 text-amber-800",
        tone === "bad" && "border-rose-200 bg-rose-50 text-rose-800",
        tone === "info" && "border-sky-200 bg-sky-50 text-sky-800",
        tone === "neutral" && "border-slate-200 bg-slate-50 text-slate-700"
      )}
    >
      {children}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={clsx(
        "rounded-lg border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_45px_rgba(24,33,47,0.06)]",
        className
      )}
    >
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "neutral",
  icon
}: {
  label: string;
  value: string | number;
  detail?: string;
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div
        className={clsx(
          "absolute inset-x-0 top-0 h-1",
          tone === "good" && "bg-emerald-500",
          tone === "warn" && "bg-amber-500",
          tone === "bad" && "bg-rose-500",
          tone === "info" && "bg-sky-500",
          tone === "neutral" && "bg-moss"
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-semibold text-slate-500">{label}</div>
        {icon ? <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-600">{icon}</div> : null}
      </div>
      <div className="mt-3 text-3xl font-black tracking-tight text-ink">{value}</div>
      {detail ? <div className="mt-2 text-sm leading-5 text-slate-500">{detail}</div> : null}
    </Card>
  );
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <div className="text-xs font-black uppercase tracking-[0.18em] text-moss">{eyebrow}</div> : null}
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 className="text-lg font-black tracking-tight text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({ value, tone = "neutral" }: { value: number; tone?: Tone }) {
  return (
    <div className="h-2 rounded-full bg-slate-100">
      <div
        className={clsx(
          "h-2 rounded-full",
          tone === "good" && "bg-emerald-500",
          tone === "warn" && "bg-amber-500",
          tone === "bad" && "bg-rose-500",
          tone === "info" && "bg-sky-500",
          tone === "neutral" && "bg-moss"
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/90 p-8 text-center">
      <div className="text-lg font-semibold text-ink">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </div>
  );
}

export function confidenceTone(label?: string) {
  if (label === "High") return "good";
  if (label === "Medium") return "info";
  if (label === "Low") return "warn";
  return "bad";
}
