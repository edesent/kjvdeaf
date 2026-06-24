import type { ChapterStatus } from "@/lib/bible";

export function StatusBanner({ status }: { status: ChapterStatus }) {
  if (status === "needs-review") {
    return (
      <div className="mb-7 flex items-start gap-3 rounded-xl border border-review/25 bg-review-soft px-4 py-3.5">
        <svg viewBox="0 0 20 20" width="18" height="18" className="mt-0.5 shrink-0 text-review" fill="none" aria-hidden>
          <path d="M10 3.5v7M10 14h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-review">Draft — needs review</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">
            This chapter was prepared from the King James Version in our simple-English
            style. It is an early draft and is waiting for a person to review it before
            it becomes final.
          </p>
        </div>
      </div>
    );
  }
  if (status === "missing") {
    return (
      <div className="mb-7 rounded-xl border border-line bg-paper-2 px-4 py-3.5">
        <p className="text-sm font-semibold text-ink">This chapter isn&rsquo;t ready yet</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">
          We&rsquo;re still working on this part of the Bible. Please check back soon, or
          choose another chapter.
        </p>
      </div>
    );
  }
  return null;
}
