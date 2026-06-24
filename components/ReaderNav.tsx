"use client";

import Link from "next/link";
import { BookPicker } from "./BookPicker";
import type { NavBook } from "@/lib/bible";

interface Ref {
  slug: string;
  name: string;
  chapter: number;
}

export function ReaderNav({
  index,
  current,
  prev,
  next,
}: {
  index: NavBook[];
  current: { name: string; chapter: number };
  prev: Ref | null;
  next: Ref | null;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <NavArrow target={prev} dir="prev" />
      <BookPicker
        index={index}
        trigger={(open) => (
          <button
            onClick={open}
            className="tap inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] font-semibold text-ink transition-colors hover:bg-paper-2"
          >
            {current.name} {current.chapter}
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" className="text-muted" aria-hidden>
              <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      />
      <NavArrow target={next} dir="next" />
    </div>
  );
}

function NavArrow({ target, dir }: { target: Ref | null; dir: "prev" | "next" }) {
  const base =
    "tap grid h-10 w-10 place-items-center rounded-lg border border-line text-ink-soft transition-colors";
  if (!target) {
    return <span className={`${base} opacity-30`} aria-hidden />;
  }
  return (
    <Link
      href={`/${target.slug}/${target.chapter}`}
      className={`${base} hover:border-accent/50 hover:text-accent`}
      aria-label={`${dir === "prev" ? "Previous" : "Next"}: ${target.name} ${target.chapter}`}
      rel={dir === "prev" ? "prev" : "next"}
    >
      <svg viewBox="0 0 20 20" width="19" height="19" fill="none">
        {dir === "prev" ? (
          <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </Link>
  );
}
