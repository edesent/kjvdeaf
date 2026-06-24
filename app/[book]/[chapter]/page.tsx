import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BOOKS } from "@/lib/books";
import {
  bookFromSlug,
  getChapterRecord,
  chapterStatus,
  adjacentChapters,
  buildNavIndex,
} from "@/lib/bible";
import { StatusBanner } from "@/components/StatusBanner";
import { ReaderNav } from "@/components/ReaderNav";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { book: string; chapter: string }[] = [];
  for (const b of BOOKS) {
    for (let c = 1; c <= b.chapters; c++) {
      params.push({ book: b.slug, chapter: String(c) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}): Promise<Metadata> {
  const { book: slug, chapter } = await params;
  const book = bookFromSlug(slug);
  if (!book) return {};
  const c = Number(chapter);
  const status = chapterStatus(book.name, c);
  const title = `${book.name} ${c}`;
  const rec = getChapterRecord(book.name, c);
  const desc =
    rec && rec.verses[0]
      ? `${book.name} ${c} — ${rec.verses[0].text.slice(0, 150)}`
      : `${book.name} chapter ${c} in clear, simple English.`;
  return {
    title,
    description: desc,
    robots: status === "published" ? undefined : { index: false, follow: true },
    alternates: { canonical: `/${slug}/${c}` },
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}) {
  const { book: slug, chapter } = await params;
  const book = bookFromSlug(slug);
  if (!book) notFound();
  const c = Number(chapter);
  if (!Number.isInteger(c) || c < 1 || c > book.chapters) notFound();

  const status = chapterStatus(book.name, c);
  const rec = getChapterRecord(book.name, c);
  const { prev, next } = adjacentChapters(book, c);
  const index = buildNavIndex();

  const navRef = (r: typeof prev) =>
    r ? { slug: r.book.slug, name: r.book.name, chapter: r.chapter } : null;

  return (
    <article className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
      {/* breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-muted">
        <Link href="/" className="hover:text-accent">
          Bible
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/${book.slug}`} className="hover:text-accent">
          {book.name}
        </Link>
      </nav>

      {/* chapter heading */}
      <header className="mb-7">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
          {book.testament === "OT" ? "Old Testament" : "New Testament"}
        </p>
        <h1 className="mt-1.5 font-serif text-4xl font-medium tracking-tight text-ink sm:text-[2.6rem]">
          {book.name}{" "}
          <span className="text-muted">{c}</span>
        </h1>
      </header>

      <StatusBanner status={status} />

      {/* scripture */}
      {rec && rec.verses.length > 0 ? (
        <div className="scripture">
          {rec.verses.map((v) => (
            <p key={v.n} id={`v${v.n}`}>
              <span className="v">{v.n}</span>
              {v.text}
            </p>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line px-5 py-10 text-center">
          <p className="text-sm text-muted">
            No text for {book.name} {c} yet.
          </p>
        </div>
      )}

      {/* source note for drafts */}
      {status === "needs-review" && (
        <p className="mt-8 text-xs leading-relaxed text-muted">
          Draft text generated from the public-domain King James Version, rewritten in
          the simple-English style of this Bible. Awaiting human review.
        </p>
      )}

      {/* bottom navigation */}
      <div className="mt-10 border-t border-line pt-6">
        <ReaderNav
          index={index}
          current={{ name: book.name, chapter: c }}
          prev={navRef(prev)}
          next={navRef(next)}
        />
      </div>
    </article>
  );
}
