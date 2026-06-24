"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { NavBook } from "@/lib/bible";
import { useDrafts } from "./DraftsProvider";

type Testament = "OT" | "NT";

interface Result {
  slug: string;
  name: string;
  chapter: number;
  n: number;
  text: string;
  draft: boolean;
}
interface Ref {
  slug: string;
  name: string;
  chapter: number;
  verse: number | null;
}

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
  const { showDrafts } = useDrafts();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Testament>("OT");
  const [active, setActive] = useState<NavBook | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [ref, setRef] = useState<Ref | null>(null);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
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

  // debounced search across all verses
  const q = query.trim();
  useEffect(() => {
    if (!open || q.length < 2) {
      setResults([]);
      setRef(null);
      setSearched(false);
      return;
    }
    setSearching(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&drafts=${showDrafts ? 1 : 0}`,
          { signal: ctrl.signal },
        );
        const data = await res.json();
        setResults(data.results || []);
        setRef(data.ref || null);
        setSearched(true);
      } catch {
        /* aborted */
      } finally {
        setSearching(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, open, showDrafts]);

  const close = () => {
    setOpen(false);
    setActive(null);
    setQuery("");
  };

  const books = useMemo(() => index.filter((b) => b.testament === tab), [index, tab]);

  const go = (slug: string, chapter: number, verse?: number | null) => {
    close();
    router.push(`/${slug}/${chapter}${verse ? `#v${verse}` : ""}`);
  };

  const isSearching = q.length >= 2;

  return (
    <>
      {trigger ? (
        trigger(() => setOpen(true))
      ) : variant === "hero" ? (
        <button
          onClick={() => setOpen(true)}
          className="tap inline-flex items-center gap-2.5 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-semibold text-paper shadow-card transition-transform hover:-translate-y-0.5"
        >
          <SearchIcon />
          Find a verse
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="tap inline-flex items-center gap-2 rounded-lg border border-line bg-paper px-3.5 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:border-accent/40 hover:text-accent"
        >
          <SearchIcon />
          Find a verse
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={close} />
          <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-line bg-paper shadow-pop sm:rounded-2xl">
            {/* search box */}
            <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
              <span className="text-muted">
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(null);
                }}
                placeholder="Search the Bible or type a verse, e.g. John 3:16"
                className="min-w-0 flex-1 bg-transparent py-1 text-[15px] text-ink outline-none placeholder:text-muted"
              />
              {query ? (
                <button
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="tap grid h-7 w-7 place-items-center rounded-md text-ink-soft hover:bg-paper-2"
                  aria-label="Clear"
                >
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={close}
                  className="tap grid h-7 w-7 place-items-center rounded-md text-ink-soft hover:bg-paper-2"
                  aria-label="Close"
                >
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            {isSearching ? (
              /* ---- search results ---- */
              <div className="overflow-y-auto">
                {ref && (
                  <button
                    onClick={() => go(ref.slug, ref.chapter, ref.verse)}
                    className="tap flex w-full items-center justify-between border-b border-line bg-accent-soft px-4 py-3 text-left"
                  >
                    <span className="text-[15px] font-semibold text-accent-ink">
                      Go to {ref.name} {ref.chapter}
                      {ref.verse ? `:${ref.verse}` : ""}
                    </span>
                    <span className="text-accent">→</span>
                  </button>
                )}
                {results.length === 0 && searched && !searching ? (
                  <p className="px-4 py-10 text-center text-sm text-muted">
                    No verses found for &ldquo;{q}&rdquo;.
                  </p>
                ) : (
                  <ul className="divide-y divide-line-soft">
                    {results.map((r, i) => (
                      <li key={`${r.slug}-${r.chapter}-${r.n}-${i}`}>
                        <button
                          onClick={() => go(r.slug, r.chapter, r.n)}
                          className="tap block w-full px-4 py-3 text-left transition-colors hover:bg-paper-2"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-accent">
                              {r.name} {r.chapter}:{r.n}
                            </span>
                            {r.draft && (
                              <span className="rounded bg-review-soft px-1.5 py-0.5 text-[10px] font-semibold text-review">
                                draft
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-[14px] leading-snug text-ink-soft">
                            {highlight(r.text, q)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : active ? (
              /* ---- chapter grid ---- */
              <div className="overflow-y-auto p-4">
                <button
                  onClick={() => setActive(null)}
                  className="tap mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft hover:text-accent"
                >
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                    <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  All books
                </button>
                <p className="mb-3 text-[15px] font-semibold text-ink">{active.name}</p>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                  {active.status.map((code, i) => {
                    const ch = i + 1;
                    const draftShown = code === 1 && showDrafts;
                    const ready = code === 2;
                    const cls = ready
                      ? "border-line bg-paper text-ink hover:border-accent hover:text-accent"
                      : draftShown
                        ? "border-review/30 bg-review-soft text-review hover:border-review"
                        : "border-line-soft bg-paper-2 text-muted hover:border-line";
                    return (
                      <button
                        key={ch}
                        onClick={() => go(active.slug, ch)}
                        className={`tap flex aspect-square items-center justify-center rounded-lg border text-[14px] font-semibold leading-none tabular-nums transition-colors ${cls}`}
                        title={draftShown ? "Draft — needs review" : ready ? undefined : "Not yet available"}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted">
                  <Legend swatch="border-line bg-paper" label="Ready" />
                  {showDrafts && <Legend swatch="border-review/30 bg-review-soft" label="Draft" />}
                  <Legend swatch="border-line-soft bg-paper-2" label="Coming soon" />
                </div>
              </div>
            ) : (
              /* ---- book browse ---- */
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
                        {showDrafts ? b.done : b.published}/{b.total}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function highlight(text: string, q: string) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text.length > 160 ? text.slice(0, 160) + "…" : text;
  // keep a window around the match
  const start = Math.max(0, i - 40);
  const pre = (start > 0 ? "…" : "") + text.slice(start, i);
  const match = text.slice(i, i + q.length);
  const post = text.slice(i + q.length, i + q.length + 110) + (i + q.length + 110 < text.length ? "…" : "");
  return (
    <>
      {pre}
      <mark className="rounded bg-accent-soft px-0.5 text-accent-ink">{match}</mark>
      {post}
    </>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
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
