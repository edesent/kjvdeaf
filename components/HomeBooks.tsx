"use client";

import Link from "next/link";
import { useDrafts } from "./DraftsProvider";
import type { NavBook } from "@/lib/bible";

export function ReadyStats({ index }: { index: NavBook[] }) {
  const { showDrafts } = useDrafts();
  const ready = index.reduce((s, b) => s + b.published, 0);
  const drafted = index.reduce((s, b) => s + b.drafted, 0);
  const total = index.reduce((s, b) => s + b.total, 0);
  return (
    <p className="mt-9 text-[13px] text-muted">
      {ready.toLocaleString()} chapters ready
      {showDrafts && drafted > 0 && <> · {drafted.toLocaleString()} drafts shown</>}{" "}
      · {total.toLocaleString()} in the whole Bible
    </p>
  );
}

export function HomeBooks({ index }: { index: NavBook[] }) {
  return (
    <>
      <BookColumn title="Old Testament" books={index.filter((b) => b.testament === "OT")} />
      <BookColumn title="New Testament" books={index.filter((b) => b.testament === "NT")} className="mt-12" />
    </>
  );
}

function BookColumn({
  title,
  books,
  className = "",
}: {
  title: string;
  books: NavBook[];
  className?: string;
}) {
  const { showDrafts } = useDrafts();
  return (
    <div className={className}>
      <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {books.map((b) => {
          const done = showDrafts ? b.published + b.drafted : b.published;
          const has = done > 0;
          return (
            <Link
              key={b.slug}
              href={has ? `/${b.slug}` : `/${b.slug}/1`}
              className="tap group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-paper-2"
            >
              <span className={`text-[15px] ${has ? "font-medium text-ink" : "text-ink-soft"}`}>
                {b.name}
              </span>
              <span className="ml-3 flex items-center gap-2 text-[12px] tabular-nums text-muted">
                {showDrafts && b.drafted > 0 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-review" title="Has drafts" />
                )}
                {done}/{b.total}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
