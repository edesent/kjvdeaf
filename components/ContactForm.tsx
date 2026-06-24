"use client";

import { useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      email: fd.get("email"),
      message: fd.get("message"),
      company: fd.get("company"), // honeypot
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setError("Could not reach the server. Please try again.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-xl border border-accent/20 bg-accent-soft px-5 py-8 text-center">
        <p className="font-serif text-2xl text-ink">Thank you!</p>
        <p className="mt-2 text-[15px] text-ink-soft">
          Your message has been sent. We will get back to you soon.
        </p>
      </div>
    );
  }

  const label = "block text-[13px] font-semibold text-ink-soft";
  const field =
    "mt-1.5 w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={label}>
            First name
          </label>
          <input id="firstName" name="firstName" required autoComplete="given-name" className={field} />
        </div>
        <div>
          <label htmlFor="lastName" className={label}>
            Last name
          </label>
          <input id="lastName" name="lastName" autoComplete="family-name" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="message" className={label}>
          Comment or message
        </label>
        <textarea id="message" name="message" required rows={6} className={field} />
      </div>

      {/* honeypot — hidden from people, catches bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {state === "error" && (
        <p className="text-sm text-review">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="tap inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-[15px] font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {state === "sending" ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
