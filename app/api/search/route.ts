import data from "@/data/bible.json";
import { BOOKS, BOOKS_BY_SLUG } from "@/lib/books";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Rec = { status: string; verses: { n: number; text: string }[] };
type Bible = Record<string, Record<string, Rec>>;
const BIBLE = data as unknown as Bible;

interface FlatVerse {
  slug: string;
  name: string;
  chapter: number;
  n: number;
  text: string;
  lower: string;
  draft: boolean;
}

// Build a flat verse index once per server instance.
const FLAT: FlatVerse[] = [];
for (const b of BOOKS) {
  const chs = BIBLE[b.name];
  if (!chs) continue;
  for (const [c, rec] of Object.entries(chs)) {
    if (!rec.verses?.length || rec.status === "empty") continue;
    const draft = rec.status === "needs-review";
    for (const v of rec.verses) {
      FLAT.push({ slug: b.slug, name: b.name, chapter: +c, n: v.n, text: v.text, lower: v.text.toLowerCase(), draft });
    }
  }
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const BY_NAME: { key: string; slug: string; name: string; chapters: number }[] = BOOKS.map((b) => ({
  key: norm(b.name),
  slug: b.slug,
  name: b.name,
  chapters: b.chapters,
}));

// Try to read a reference like "john 3", "john 3:16", "1 cor 13"
function parseRef(q: string) {
  const m = q.trim().match(/^([1-3]?\s*[a-z][a-z ]*?)\s*(\d+)(?::\s*(\d+))?$/i);
  if (!m) return null;
  const bk = norm(m[1]);
  if (!bk) return null;
  const hit = BY_NAME.find((b) => b.key === bk) || BY_NAME.find((b) => b.key.startsWith(bk));
  if (!hit) return null;
  const chapter = Number(m[2]);
  if (chapter < 1 || chapter > hit.chapters) return null;
  const verse = m[3] ? Number(m[3]) : null;
  return { slug: hit.slug, name: hit.name, chapter, verse };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const includeDrafts = url.searchParams.get("drafts") === "1";
  if (q.length < 2) return Response.json({ results: [], ref: null });

  const ref = parseRef(q);
  const lower = q.toLowerCase();

  const matches: (FlatVerse & { score: number })[] = [];
  for (const v of FLAT) {
    if (v.draft && !includeDrafts) continue;
    const idx = v.lower.indexOf(lower);
    if (idx === -1) continue;
    // earlier match + word-boundary scores higher
    const boundary = idx === 0 || /\s/.test(v.lower[idx - 1]) ? 100 : 0;
    matches.push({ ...v, score: boundary - idx });
    if (matches.length > 800) break; // safety cap on raw matches
  }
  matches.sort((a, b) => b.score - a.score);

  const results = matches.slice(0, 50).map((m) => ({
    slug: m.slug,
    name: m.name,
    chapter: m.chapter,
    n: m.n,
    text: m.text,
    draft: m.draft,
  }));

  // validate ref target is available (and a draft only if drafts shown)
  let refOut = null;
  if (ref) {
    const rec = BOOKS_BY_SLUG[ref.slug] && BIBLE[ref.name]?.[String(ref.chapter)];
    const ok = rec && rec.verses?.length && (rec.status !== "needs-review" || includeDrafts);
    if (ok) refOut = ref;
  }

  return Response.json({ results, ref: refOut, total: matches.length });
}
