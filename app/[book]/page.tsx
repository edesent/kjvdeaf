import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BOOKS } from "@/lib/books";
import { bookFromSlug, chapterStatus } from "@/lib/bible";
import { ChapterGrid } from "@/components/ChapterGrid";

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
    description: `Read the book of ${book.name}. ${book.chapters} chapters.`,
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

  const codes = Array.from({ length: book.chapters }, (_, i) => {
    const s = chapterStatus(book.name, i + 1);
    return s === "published" ? 2 : s === "needs-review" ? 1 : 0;
  });

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
      <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-muted">
        <Link href="/" className="hover:text-accent">
          Bible
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-soft">{book.name}</span>
      </nav>

      <header className="mb-2">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
          {book.testament === "OT" ? "Old Testament" : "New Testament"}
        </p>
        <h1 className="mt-1.5 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {book.name}
        </h1>
      </header>

      <ChapterGrid bookSlug={book.slug} codes={codes} />
    </div>
  );
}
