import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5 tap">
          <Image
            src={logo}
            alt="KJV for the Deaf"
            width={40}
            height={40}
            priority
            className="h-9 w-9 object-contain"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-bold uppercase tracking-[0.04em] text-ink">
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
