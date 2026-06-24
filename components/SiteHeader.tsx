import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5 tap">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-paper">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden>
              <path
                d="M12 6.5C10.4 5.2 8.2 4.6 5.5 4.8 4.7 4.85 4 5.5 4 6.3v11.2c0 .9.8 1.5 1.7 1.4 2.4-.2 4.5.3 6.3 1.6 1.8-1.3 3.9-1.8 6.3-1.6.9.1 1.7-.5 1.7-1.4V6.3c0-.8-.7-1.45-1.5-1.5-2.7-.2-4.9.4-6.5 1.7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M12 6.5V19" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              KJV for the Deaf
            </span>
            <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted">
              The Bible in clear English
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className="tap rounded-md px-3 py-2 text-ink-soft transition-colors hover:bg-paper-2 hover:text-accent"
          >
            Books
          </Link>
          <Link
            href="/about"
            className="tap hidden rounded-md px-3 py-2 text-ink-soft transition-colors hover:bg-paper-2 hover:text-accent sm:block"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
