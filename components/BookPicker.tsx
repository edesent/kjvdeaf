"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { NavBook } from "@/lib/bible";

type Testament = "OT" | "NT";

export function BookPicker({
  index,
  trigger,
  variant = "default",
}: {
  index: NavBook[];
  /** Only usable from Client Components. Server callers should use `variant`. */
  trigger?: (open: () => void) => React.ReactNode;
  variant?: "default" | "hero";
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Testament>("OT");
  const [active, setActive] = useState<NavBook | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    setActive(null);
  };

  const books = useMemo(() => index.filter((b) => b.testament === tab), [index, tab]);

  const go = (slug: string, chapter: number) => {
    close();
    router.push(`/${slug}/${chapter}`);
  };

  return (
    <>
      {trigger ? (
        trigger(() => setOpen(true))
      ) : variant === "hero" ? (
        <button
          onClick={() => setOpen(true)}
          className="tap inline-flex items-center gap-2.5 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-semibold text-paper shadow-card transition-transform hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.7" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          Find a chapter
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="tap inline-flex items-center gap-2 rounded-lg border border-line bg-paper px-3.5 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:border-accent/40 hover:text-accent"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden>
            <path d="M3 5h14M3 10h14M3 15h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Find a chapter
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={close} />
          <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-line bg-paper shadow-pop sm:rounded-2xl">
            {/* header */}
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-2">
                {active && (
                  <button
                    onClick={() => setActive(null)}
                    className="tap -ml-1 grid h-8 w-8 place-items-center rounded-md text-ink-soft hover:bg-paper-2"
                    aria-label="Back to books"
                  >
                    <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                      <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
                <h2 className="text-[15px] font-semibold text-ink">
                  {active ? active.name : "Choose a book"}
                </h2>
              </div>
              <button
                onClick={close}
                className="tap grid h-8 w-8 place-items-center rounded-md text-ink-soft hover:bg-paper-2"
                aria-label="Close"
              >
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {!active ? (
              <>
                <div className="flex gap-1 border-b border-line px-3 py-2.5">
                  {(["OT", "NT"] as Testament[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`tap flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        tab === t ? "bg-accent text-paper" : "text-ink-soft hover:bg-paper-2"
                      }`}
                    >
                      {t === "OT" ? "Old Testament" : "New Testament"}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 overflow-y-auto p-3">
                  {books.map((b) => (
                    <button
                      key={b.slug}
                      onClick={() => setActive(b)}
                      className="tap flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-paper-2"
                    >
                      <span className="text-[14px] font-medium text-ink">{b.name}</span>
                      <span className="ml-2 shrink-0 text-[11px] tabular-nums text-muted">
                        {b.done}/{b.total}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="overflow-y-auto p-4">
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                  {active.status.map((code, i) => {
                    const ch = i + 1;
                    const cls =
                      code === 2
                        ? "border-line bg-paper text-ink hover:border-accent hover:text-accent"
                        : code === 1
                          ? "border-review/30 bg-review-soft text-review hover:border-review"
                          : "border-line-soft bg-paper-2 text-muted hover:border-line";
                    return (
                      <button
                        key={ch}
                        onClick={() => go(active.slug, ch)}
                        className={`tap aspect-square rounded-lg border text-[14px] font-semibold tabular-nums transition-colors ${cls}`}
                        title={code === 1 ? "Draft — needs review" : code === 0 ? "Not yet available" : undefined}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted">
                  <Legend swatch="border-line bg-paper" label="Ready" />
                  <Legend swatch="border-review/30 bg-review-soft" label="Draft" />
                  <Legend swatch="border-line-soft bg-paper-2" label="Coming soon" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded border ${swatch}`} />
      {label}
    </span>
  );
}
