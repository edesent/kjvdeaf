import Link from "next/link";
import { DraftsToggle } from "./DraftsProvider";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-paper-2">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="text-[15px] font-semibold text-ink">KJV for the Deaf</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              The Word of God, written in short, clear sentences, made for the Deaf.
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/" className="text-ink-soft hover:text-accent">
              All Books
            </Link>
            <Link href="/about" className="text-ink-soft hover:text-accent">
              About this Bible
            </Link>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-xs leading-relaxed text-muted">
            Chapters marked <span className="font-semibold text-review">Draft — needs review</span>{" "}
            are early drafts prepared from the King James Version, awaiting a
            person&rsquo;s review. They are hidden by default.
          </p>
          <DraftsToggle />
        </div>
      </div>
    </footer>
  );
}
