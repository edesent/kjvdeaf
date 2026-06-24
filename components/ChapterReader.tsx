"use client";

import { useEffect, useState } from "react";
import { useDrafts } from "./DraftsProvider";
import { StatusBanner } from "./StatusBanner";
import type { Verse, ChapterStatus } from "@/lib/bible";

type EditStatus = "published" | "needs-review";

export function ChapterReader({
  bookName,
  chapter,
  initialStatus,
  initialVerses,
}: {
  bookName: string;
  bookSlug: string;
  chapter: number;
  initialStatus: ChapterStatus;
  initialVerses: Verse[];
}) {
  const { showDrafts } = useDrafts();
  const [editor, setEditor] = useState(false);
  const [mode, setMode] = useState<"read" | "edit">("read");
  const [status, setStatus] = useState<ChapterStatus>(initialStatus);
  const [verses, setVerses] = useState<Verse[]>(initialVerses);

  // edit working copy
  const [draftVerses, setDraftVerses] = useState<Verse[]>([]);
  const [draftStatus, setDraftStatus] = useState<EditStatus>(
    initialStatus === "published" ? "published" : "needs-review",
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setEditor(!!d.editor))
      .catch(() => {});
  }, []);

  const showDraft = status === "needs-review" && showDrafts;
  const hide = status === "missing" || (status === "needs-review" && !showDrafts);

  function startEdit() {
    setDraftVerses(verses.length ? verses.map((v) => ({ ...v })) : [{ n: 1, text: "" }]);
    setDraftStatus(status === "published" ? "published" : "needs-review");
    setMsg("");
    setMode("edit");
  }

  function setVerseText(i: number, text: string) {
    setDraftVerses((vs) => vs.map((v, idx) => (idx === i ? { ...v, text } : v)));
  }
  function removeVerse(i: number) {
    setDraftVerses((vs) => vs.filter((_, idx) => idx !== i));
  }
  function addVerse() {
    setDraftVerses((vs) => [...vs, { n: (vs.at(-1)?.n ?? 0) + 1, text: "" }]);
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const clean = draftVerses
      .map((v) => ({ n: v.n, text: v.text.replace(/\s+/g, " ").trim() }))
      .filter((v) => v.text.length > 0);
    if (!clean.length) {
      setMsg("Add at least one verse.");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book: bookName, chapter, status: draftStatus, verses: clean }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.error || "Could not save.");
        setSaving(false);
        return;
      }
      // optimistic: show it now
      setVerses(clean);
      setStatus(draftStatus);
      setMode("read");
      setMsg("Saved. Your change is live for you now, and for everyone in about a minute.");
    } catch {
      setMsg("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  }

  // ---------------- EDIT MODE ----------------
  if (mode === "edit") {
    return (
      <div className="rounded-2xl border border-accent/25 bg-paper-2 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] font-semibold text-ink">
            Editing {bookName} {chapter}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("read")}
              className="tap rounded-lg border border-line bg-paper px-3.5 py-2 text-sm font-medium text-ink-soft hover:bg-paper-2"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="tap rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-paper disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        <label className="mb-4 flex items-center gap-2 text-[13px] font-medium text-ink-soft">
          Status:
          <select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as EditStatus)}
            className="rounded-md border border-line bg-paper px-2 py-1 text-[13px] text-ink"
          >
            <option value="published">Published (ready to read)</option>
            <option value="needs-review">Draft — needs review</option>
          </select>
        </label>

        <div className="space-y-3">
          {draftVerses.map((v, i) => (
            <div key={i} className="flex gap-2">
              <span className="mt-2.5 w-6 shrink-0 text-right text-[13px] font-semibold text-accent tabular-nums">
                {v.n}
              </span>
              <textarea
                value={v.text}
                onChange={(e) => setVerseText(i, e.target.value)}
                rows={Math.max(2, Math.ceil((v.text.length || 1) / 60))}
                placeholder={`Verse ${v.n}`}
                className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-3 py-2 font-serif text-[16px] leading-relaxed text-ink outline-none focus:border-accent"
              />
              <button
                onClick={() => removeVerse(i)}
                aria-label={`Remove verse ${v.n}`}
                className="tap mt-1 grid h-8 w-8 shrink-0 place-items-center self-start rounded-md text-muted hover:bg-paper hover:text-review"
              >
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addVerse}
          className="tap mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3.5 py-2 text-sm font-medium text-ink-soft hover:border-accent/40 hover:text-accent"
        >
          + Add verse
        </button>

        {msg && <p className="mt-3 text-sm text-review">{msg}</p>}
      </div>
    );
  }

  // ---------------- READ MODE ----------------
  return (
    <>
      {editor && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-line bg-paper-2 px-3.5 py-2.5">
          <span className="text-[13px] text-muted">You&rsquo;re signed in as an editor.</span>
          <button
            onClick={startEdit}
            className="tap inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-semibold text-paper"
          >
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none">
              <path d="M4 13.5V16h2.5l7.4-7.4-2.5-2.5L4 13.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M12.5 5.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {verses.length ? "Edit chapter" : "Add this chapter"}
          </button>
        </div>
      )}

      {msg && (
        <div className="mb-5 rounded-xl border border-accent/20 bg-accent-soft px-4 py-3 text-sm text-accent-ink">
          {msg}
        </div>
      )}

      <StatusBanner status={hide ? "missing" : status} />

      {!hide && verses.length > 0 ? (
        <div className="scripture">
          {verses.map((v) => (
            <p key={v.n} id={`v${v.n}`}>
              <span className="v">{v.n}</span>
              {v.text}
            </p>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line px-5 py-10 text-center">
          <p className="text-sm text-muted">
            No text for {bookName} {chapter} yet.
          </p>
        </div>
      )}

      {showDraft && (
        <p className="mt-8 text-xs leading-relaxed text-muted">
          Draft text prepared from the public-domain King James Version, rewritten in
          the simple-English style of this Bible. Awaiting human review.
        </p>
      )}
    </>
  );
}
