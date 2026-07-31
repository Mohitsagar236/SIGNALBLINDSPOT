import {
  AlertTriangle,
  BarChart3,
  Bell,
  FileText,
  FlaskConical,
  Home,
  Import,
  Layers3,
  MessageSquareText,
  NotebookTabs,
  Radar,
  Search,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/lib/actions/auth";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/roadmap", label: "Roadmap", icon: Radar },
  { href: "/feedback", label: "Feedback", icon: MessageSquareText },
  { href: "/interviews", label: "Interviews", icon: NotebookTabs },
  { href: "/segments", label: "Segments", icon: Layers3 },
  { href: "/blind-spots", label: "Blind spots", icon: AlertTriangle },
  { href: "/recommendations", label: "Recommendations", icon: FlaskConical },
  { href: "/imports", label: "Imports", icon: Import },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/accounts", label: "Accounts", icon: Home },
  { href: "/users", label: "Users", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200/80 bg-white/95 p-4 shadow-[18px_0_45px_rgba(24,33,47,0.04)] backdrop-blur lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-[#f9faf7] p-3">
          <div className="grid size-10 place-items-center rounded-lg bg-ink text-white">
            <Radar size={20} aria-hidden />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-ink">SignalBlindspot</div>
            <div className="text-xs font-medium text-slate-500">Evidence quality OS</div>
          </div>
        </Link>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
            <ShieldCheck size={16} aria-hidden />
            Prioritization review
          </div>
          <p className="mt-1 text-xs leading-5 text-amber-800">3 decisions need representative evidence before roadmap lock.</p>
        </div>
        <nav className="mt-5 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-mist hover:text-ink"
              >
                <span className="grid size-8 place-items-center rounded-md border border-transparent text-slate-500 transition group-hover:border-slate-200 group-hover:bg-white group-hover:text-moss">
                  <Icon size={17} aria-hidden />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction} className="absolute bottom-5 left-5 right-5">
          <button className="focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
            Logout
          </button>
        </form>
      </aside>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2 font-black text-ink"><Radar size={18} /> SignalBlindspot</div>
        <nav className="mt-3 flex gap-2 overflow-x-auto text-sm">
          {nav.slice(0, 8).map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md border border-slate-200 px-3 py-1.5 font-semibold">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="px-4 py-5 lg:ml-72 lg:px-8">
        <div className="mb-5 hidden items-center justify-between gap-4 lg:flex">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden />
            <input
              aria-label="Global search"
              placeholder="Search roadmap evidence, segments, recommendations..."
              className="focus-ring w-full rounded-lg border border-slate-200 bg-white/90 py-2.5 pl-10 pr-3 text-sm shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="focus-ring grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm" aria-label="Notifications">
              <Bell size={18} aria-hidden />
            </button>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
              <div className="font-bold leading-none text-ink">Demo workspace</div>
              <div className="mt-1 text-xs text-slate-500">Product Ops</div>
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
