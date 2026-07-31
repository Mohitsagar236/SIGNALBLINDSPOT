"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { signupAction } from "@/lib/actions/auth";

export default function SignupPage() {
  const [state, action] = useFormState(signupAction, null);
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8f5] px-4">
      <form action={action} className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-2xl font-black text-ink">Create workspace</div>
        <p className="mt-2 text-sm text-slate-600">Secure credentials-based auth with hashed passwords.</p>
        {state?.error ? <div className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700">{state.error}</div> : null}
        <label className="mt-6 block text-sm font-semibold">Name</label>
        <input name="name" className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
        <label className="mt-4 block text-sm font-semibold">Email</label>
        <input name="email" type="email" className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
        <label className="mt-4 block text-sm font-semibold">Password</label>
        <input name="password" type="password" className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
        <button className="focus-ring mt-6 w-full rounded-md bg-ink px-4 py-3 font-semibold text-white">Sign up</button>
        <div className="mt-5 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-semibold text-moss">Login</Link>
        </div>
      </form>
    </main>
  );
}
