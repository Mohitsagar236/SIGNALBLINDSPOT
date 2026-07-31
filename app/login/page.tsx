"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, action] = useFormState(loginAction, null);
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8f5] px-4">
      <form action={action} className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-2xl font-black text-ink">Login to SignalBlindspot</div>
        <p className="mt-2 text-sm text-slate-600">Use seeded demo credentials or create your own workspace.</p>
        {state?.error ? <div className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700">{state.error}</div> : null}
        <label className="mt-6 block text-sm font-semibold">Email</label>
        <input name="email" type="email" defaultValue="pm@signalblindspot.dev" className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
        <label className="mt-4 block text-sm font-semibold">Password</label>
        <input name="password" type="password" defaultValue="SignalBlindspot123!" className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
        <button className="focus-ring mt-6 w-full rounded-md bg-ink px-4 py-3 font-semibold text-white">Login</button>
        <div className="mt-5 text-center text-sm text-slate-600">
          New workspace? <Link href="/signup" className="font-semibold text-moss">Sign up</Link>
        </div>
      </form>
    </main>
  );
}
