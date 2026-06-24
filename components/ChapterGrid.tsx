"use client";

import Link from "next/link";
import { useDrafts } from "./DraftsProvider";

// codes: 2 = published, 1 = draft, 0 = missing
export function ChapterGrid({
  bookSlug,
  codes,
}: {
  bookSlug: string;
  codes: number[];
}) {
  const { showDrafts } = useDrafts();
  const published = codes.filter((c) => c === 2).length;
  const drafted = codes.filter((c) => c === 1).length;
  const available = published + (showDrafts ? drafted : 0);

  return (
    <>
      <p className="mt-3 text-sm text-ink-soft">
        {codes.length} chapters · {available} available
        {showDrafts && drafted > 0 && (
          <span className="text-review"> · {drafted} in draft</span>
        )}
      </p>

      <div className="mt-8 grid grid-cols-5 gap-2.5 sm:grid-cols-8">
        {codes.map((code, i) => {
          const c = i + 1;
          const draftShown = code === 1 && showDrafts;
          const asReady = code === 2;
          const cls = asReady
            ? "border-line bg-paper text-ink hover:border-accent hover:text-accent hover:shadow-card"
            : draftShown
              ? "border-review/30 bg-review-soft text-review hover:border-review"
              : "border-line-soft bg-paper-2 text-muted hover:border-line";
          return (
            <Link
              key={c}
              href={`/${bookSlug}/${c}`}
              className={`tap flex aspect-square items-center justify-center rounded-xl border text-[15px] font-semibold leading-none tabular-nums transition-all ${cls}`}
              title={draftShown ? "Draft — needs review" : asReady ? undefined : "Coming soon"}
            >
              {c}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-muted">
        <Legend swatch="border-line bg-paper" label="Ready to read" />
        {showDrafts && (
          <Legend swatch="border-review/30 bg-review-soft" label="Draft — needs review" />
        )}
        <Legend swatch="border-line-soft bg-paper-2" label="Coming soon" />
      </div>
    </>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-block h-3.5 w-3.5 rounded border ${swatch}`} />
      {label}
    </span>
  );
}
