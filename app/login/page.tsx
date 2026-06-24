"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    await fetch("/api/auth/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});
    setState("sent");
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-20 pt-16 sm:px-6">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Editor sign-in</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
        Enter your email and we&rsquo;ll send you a sign-in link. Only approved
        editors can sign in.
      </p>

      {state === "sent" ? (
        <div className="mt-6 rounded-xl border border-accent/20 bg-accent-soft px-5 py-6">
          <p className="font-semibold text-ink">Check your email</p>
          <p className="mt-1 text-[14px] text-ink-soft">
            If <span className="font-medium">{email}</span> is an approved editor, a
            sign-in link is on its way. The link expires in 20 minutes.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="tap w-full rounded-xl bg-accent px-6 py-3 text-[15px] font-semibold text-paper disabled:opacity-60"
          >
            {state === "sending" ? "Sending…" : "Send me a sign-in link"}
          </button>
        </form>
      )}
    </div>
  );
}
