import { cookies } from "next/headers";
import { SESSION_COOKIE, sessionEmail } from "@/lib/auth";
import { BOOKS } from "@/lib/books";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REPO = process.env.GITHUB_REPO || "edesent/kjvdeaf";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const GH = "https://api.github.com";

// Each book lives in its own file, e.g. data/books/john.json.
function bookFile(slug: string) {
  return `data/books/${slug}.json`;
}

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "kjvdeaf-editor",
  };
}

async function getFile(file: string) {
  const res = await fetch(`${GH}/repos/${REPO}/contents/${file}?ref=${BRANCH}`, {
    headers: ghHeaders(),
    cache: "no-store",
  });
  // A brand-new book may not have a file yet — start from an empty object.
  if (res.status === 404) return { sha: undefined as string | undefined, data: {} as Record<string, unknown> };
  if (!res.ok) throw new Error(`github get ${res.status}`);
  const j = await res.json();
  const json = JSON.parse(Buffer.from(j.content, "base64").toString("utf8"));
  return { sha: j.sha as string | undefined, data: json as Record<string, unknown> };
}

async function putFile(file: string, content: string, sha: string | undefined, message: string) {
  return fetch(`${GH}/repos/${REPO}/contents/${file}`, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      ...(sha ? { sha } : {}),
      branch: BRANCH,
    }),
  });
}

export async function POST(req: Request) {
  const jar = await cookies();
  const email = await sessionEmail(jar.get(SESSION_COOKIE)?.value);
  if (!email) return Response.json({ error: "Not signed in." }, { status: 401 });
  if (!process.env.GITHUB_TOKEN) {
    return Response.json({ error: "Editing is not configured yet (no GitHub token)." }, { status: 503 });
  }

  let body: { book?: string; chapter?: number; status?: string; verses?: { n: number; text: string }[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const book = BOOKS.find((b) => b.name === body.book);
  const chapter = Number(body.chapter);
  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) {
    return Response.json({ error: "Unknown book or chapter." }, { status: 400 });
  }
  const status = body.status === "published" ? "published" : "needs-review";
  const verses = (body.verses || [])
    .map((v) => ({ n: Number(v.n), text: String(v.text || "").replace(/\s+/g, " ").trim() }))
    .filter((v) => Number.isInteger(v.n) && v.n >= 1 && v.text.length > 0)
    .sort((a, b) => a.n - b.n);
  if (!verses.length) return Response.json({ error: "Add at least one verse." }, { status: 400 });

  const file = bookFile(book.slug);
  const message = `Edit ${book.name} ${chapter} (${status}) via inline editor — ${email}`;

  // write with one retry on sha conflict
  for (let attempt = 0; attempt < 2; attempt++) {
    const { sha, data } = await getFile(file);
    const prev = (data[String(chapter)] as Record<string, unknown>) || {};
    data[String(chapter)] = {
      ...prev,
      status,
      verses,
      editedBy: email,
    };
    const res = await putFile(file, JSON.stringify(data, null, 2) + "\n", sha, message);
    if (res.ok) return Response.json({ ok: true });
    if (res.status === 409 && attempt === 0) continue; // sha moved, retry
    const txt = await res.text();
    console.error("github put error", res.status, txt);
    return Response.json({ error: "Could not save to GitHub." }, { status: 502 });
  }
  return Response.json({ error: "Save failed (conflict)." }, { status: 409 });
}
