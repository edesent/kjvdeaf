"use client";

import { useDrafts } from "./DraftsProvider";
import { StatusBanner } from "./StatusBanner";
import type { Verse, ChapterStatus } from "@/lib/bible";

export function ChapterBody({
  status,
  verses,
  bookName,
  chapter,
}: {
  status: ChapterStatus;
  verses: Verse[];
  bookName: string;
  chapter: number;
}) {
  const { showDrafts } = useDrafts();

  // A draft is treated as "not ready yet" until the reader turns drafts on.
  const showDraft = status === "needs-review" && showDrafts;
  const hide = status === "missing" || (status === "needs-review" && !showDrafts);

  return (
    <>
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
