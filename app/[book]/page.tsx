import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BOOKS } from "@/lib/books";
import { bookFromSlug, chapterStatus, bookProgress } from "@/lib/bible";

export const dynamicParams = false;

export function generateStaticParams() {
  return BOOKS.map((b) => ({ book: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ book: string }>;
}): Promise<Metadata> {
  const { book: slug } = await params;
  const book = bookFromSlug(slug);
  if (!book) return {};
  return {
    title: book.name,
    description: `Read the book of ${book.name} in clear, simple English. ${book.chapters} chapters.`,
    alternates: { canonical: `/${slug}` },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const { book: slug } = await params;
  const book = bookFromSlug(slug);
  if (!book) notFound();
  const prog = bookProgress(book);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
      <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-muted">
        <Link href="/" className="hover:text-accent">
          Bible
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-soft">{book.name}</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
          {book.testament === "OT" ? "Old Testament" : "New Testament"}
        </p>
        <h1 className="mt-1.5 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {book.name}
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          {book.chapters} chapters · {prog.done} available
          {prog.drafted > 0 && (
            <span className="text-review"> · {prog.drafted} in draft</span>
          )}
        </p>
      </header>

      <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-8">
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => {
          const s = chapterStatus(book.name, c);
          const cls =
            s === "published"
              ? "border-line bg-paper text-ink hover:border-accent hover:text-accent hover:shadow-card"
              : s === "needs-review"
                ? "border-review/30 bg-review-soft text-review hover:border-review"
                : "border-line-soft bg-paper-2 text-muted hover:border-line";
          return (
            <Link
              key={c}
              href={`/${book.slug}/${c}`}
              className={`tap grid aspect-square place-items-center rounded-xl border text-[15px] font-semibold tabular-nums transition-all ${cls}`}
              title={s === "needs-review" ? "Draft — needs review" : s === "missing" ? "Coming soon" : undefined}
            >
              {c}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-muted">
        <Legend swatch="border-line bg-paper" label="Ready to read" />
        <Legend swatch="border-review/30 bg-review-soft" label="Draft — needs review" />
        <Legend swatch="border-line-soft bg-paper-2" label="Coming soon" />
      </div>
    </div>
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
