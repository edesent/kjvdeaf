import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { OT_BOOKS, NT_BOOKS, type BookMeta } from "@/lib/books";
import { bookProgress, buildNavIndex, siteStats } from "@/lib/bible";
import { BookPicker } from "@/components/BookPicker";

const QUICK = [
  { label: "John 3", slug: "john", chapter: 3 },
  { label: "Psalm 23", slug: "psalms", chapter: 23 },
  { label: "Genesis 1", slug: "genesis", chapter: 1 },
  { label: "Romans 8", slug: "romans", chapter: 8 },
];

export default function Home() {
  const index = buildNavIndex();
  const stats = siteStats();

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <Image
            src={logo}
            alt="KJV for the Deaf"
            width={150}
            height={150}
            priority
            className="mx-auto h-28 w-28 object-contain sm:h-32 sm:w-32"
          />
          <h1 className="mx-auto mt-6 max-w-2xl font-serif text-[2.4rem] font-medium leading-[1.1] tracking-tight text-ink sm:text-6xl">
            The Word of God, in clear and simple words.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
            Scripture rewritten in easy-to-read English — made for the Deaf, and for
            anyone who wants the Bible in plain language they can understand.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <BookPicker index={index} variant="hero" />
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[13px] text-muted">Start with</span>
              {QUICK.map((q) => (
                <Link
                  key={q.label}
                  href={`/${q.slug}/${q.chapter}`}
                  className="tap rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {q.label}
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-9 text-[13px] text-muted">
            {stats.publishedChapters.toLocaleString()} chapters ready
            {stats.draftedChapters > 0 && (
              <> · {stats.draftedChapters.toLocaleString()} in draft</>
            )}{" "}
            · {stats.totalChapters.toLocaleString()} in the whole Bible
          </p>
        </div>
      </section>

      {/* Books */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <BookColumn title="Old Testament" books={OT_BOOKS} />
        <BookColumn title="New Testament" books={NT_BOOKS} className="mt-12" />
      </section>
    </div>
  );
}

function BookColumn({
  title,
  books,
  className = "",
}: {
  title: string;
  books: BookMeta[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {books.map((b) => {
          const prog = bookProgress(b);
          const has = prog.done > 0;
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
                {prog.drafted > 0 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-review" title="Has drafts" />
                )}
                {prog.done}/{prog.total}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
