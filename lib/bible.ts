// Scripture text is NOT edited here. It lives one-file-per-book in data/books/
// (e.g. data/books/john.json). `data` below is auto-assembled from those files by
// data/bible-data.ts. To add/fix text or publish a draft, edit the book file —
// see data/books/README.md.
import data from "@/data/bible-data";
import { BOOKS, BOOKS_BY_SLUG, type BookMeta } from "./books";

export type ChapterStatus = "published" | "needs-review" | "empty" | "missing";

export interface Verse {
  n: number;
  text: string;
}
export interface ChapterRecord {
  verses: Verse[];
  sourceUrl?: string;
  // "published" = final, shows normally. "needs-review" = a DRAFT, shows an amber
  // banner. To publish a draft, flip this field to "published" in the book file.
  status: "published" | "needs-review" | "empty";
  videos?: string[];
}

type BibleData = Record<string, Record<string, ChapterRecord>>;
const BIBLE = data as unknown as BibleData;

/** Raw record for a book + chapter, or null if we have nothing for it. */
export function getChapterRecord(bookName: string, chapter: number): ChapterRecord | null {
  const book = BIBLE[bookName];
  if (!book) return null;
  const rec = book[String(chapter)];
  return rec ?? null;
}

/** Normalized status used by the UI. Empty stubs from the source count as "missing". */
export function chapterStatus(bookName: string, chapter: number): ChapterStatus {
  const rec = getChapterRecord(bookName, chapter);
  if (!rec) return "missing";
  if (rec.status === "empty" || !rec.verses?.length) return "missing";
  return rec.status; // "published" | "needs-review"
}

export interface BookProgress {
  done: number; // published + needs-review with text
  published: number;
  drafted: number;
  total: number;
}

export function bookProgress(book: BookMeta): BookProgress {
  let published = 0;
  let drafted = 0;
  for (let c = 1; c <= book.chapters; c++) {
    const s = chapterStatus(book.name, c);
    if (s === "published") published++;
    else if (s === "needs-review") drafted++;
  }
  return { done: published + drafted, published, drafted, total: book.chapters };
}

export interface SiteStats {
  publishedChapters: number;
  draftedChapters: number;
  totalChapters: number;
  booksStarted: number;
}

export function siteStats(): SiteStats {
  let published = 0;
  let drafted = 0;
  let booksStarted = 0;
  for (const b of BOOKS) {
    const p = bookProgress(b);
    published += p.published;
    drafted += p.drafted;
    if (p.done > 0) booksStarted++;
  }
  return {
    publishedChapters: published,
    draftedChapters: drafted,
    totalChapters: BOOKS.reduce((s, b) => s + b.chapters, 0),
    booksStarted,
  };
}

export interface ChapterRef {
  book: BookMeta;
  chapter: number;
}

/** Previous / next chapter, crossing book boundaries. */
export function adjacentChapters(book: BookMeta, chapter: number): {
  prev: ChapterRef | null;
  next: ChapterRef | null;
} {
  let prev: ChapterRef | null = null;
  let next: ChapterRef | null = null;

  if (chapter > 1) {
    prev = { book, chapter: chapter - 1 };
  } else {
    const i = BOOKS.findIndex((b) => b.name === book.name);
    if (i > 0) {
      const pb = BOOKS[i - 1];
      prev = { book: pb, chapter: pb.chapters };
    }
  }

  if (chapter < book.chapters) {
    next = { book, chapter: chapter + 1 };
  } else {
    const i = BOOKS.findIndex((b) => b.name === book.name);
    if (i < BOOKS.length - 1) {
      next = { book: BOOKS[i + 1], chapter: 1 };
    }
  }
  return { prev, next };
}

export function bookFromSlug(slug: string): BookMeta | null {
  return BOOKS_BY_SLUG[slug] ?? null;
}

export function chapterHref(bookSlugOrMeta: string | BookMeta, chapter: number): string {
  const slug = typeof bookSlugOrMeta === "string" ? bookSlugOrMeta : bookSlugOrMeta.slug;
  return `/${slug}/${chapter}`;
}

// Compact index for client-side navigation. status codes: 2=published, 1=draft, 0=missing
export interface NavBook {
  slug: string;
  name: string;
  testament: "OT" | "NT";
  total: number;
  done: number; // published + drafted
  published: number;
  drafted: number;
  status: number[]; // length = total, index 0 = chapter 1. 2=published, 1=draft, 0=missing
}

export function buildNavIndex(): NavBook[] {
  return BOOKS.map((b) => {
    const status: number[] = [];
    let published = 0;
    let drafted = 0;
    for (let c = 1; c <= b.chapters; c++) {
      const s = chapterStatus(b.name, c);
      const code = s === "published" ? 2 : s === "needs-review" ? 1 : 0;
      if (code === 2) published++;
      else if (code === 1) drafted++;
      status.push(code);
    }
    return {
      slug: b.slug,
      name: b.name,
      testament: b.testament,
      total: b.chapters,
      done: published + drafted,
      published,
      drafted,
      status,
    };
  });
}
