# KJV for the Deaf

The Bible in clear, simple English — a fast, mobile-first reading site.
Built by [Elijah Desent](https://www.elijahdesent.com). Next.js 16 + Tailwind v4,
deployed on Vercel (auto-deploys on push to `main`).

## How the content works (read this before editing)

All Scripture text lives in **one file**: [`data/bible.json`](data/bible.json).
There is **no database**. Each chapter is one entry:

```jsonc
{
  "John": {
    "3": {
      "status": "published",          // see statuses below
      "sourceUrl": "https://…",       // where this text came from (optional)
      "verses": [
        { "n": 1, "text": "There was a Pharisee. His name was Nicodemus…" },
        { "n": 2, "text": "Nicodemus came to Jesus in the night…" }
      ]
    }
  }
}
```

The book names and chapter counts (the full 66-book canon) are fixed in
[`lib/books.ts`](lib/books.ts) — you don't edit that to add text, only the JSON.

### Chapter statuses

| status         | What it means                                       | How it looks on the site            |
| -------------- | --------------------------------------------------- | ----------------------------------- |
| `published`    | Final, reviewed text.                               | Reads normally.                     |
| `needs-review` | A draft prepared from the KJV, **not yet checked**. | Amber "Draft — needs review" banner |
| `empty`        | Exists in the source but had no text.               | "Coming soon" message               |

A chapter with **no entry at all** simply shows "This chapter isn't ready yet."
There are 1,189 chapters in the whole Bible; any not in the JSON are marked
coming soon automatically.

### To add or fix a chapter

Add (or edit) its entry in `data/bible.json` with `status: "published"` and the
verses. That's the whole job — the page, navigation, and sitemap update by
themselves. You can simply ask Claude or ChatGPT: *"Add Genesis 7 with this
text…"* and it will edit the JSON for you.

## Routes

- `/` — home, with a book/chapter finder and the full book list
- `/<book>` — a book's chapter grid (e.g. `/john`)
- `/<book>/<chapter>` — the reader (e.g. `/john/3`, `/psalms/23`)

Book slugs are the lowercase name with spaces as hyphens: `1 Corinthians` →
`1-corinthians`, `Song of Solomon` → `song-of-solomon`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # prerenders all chapters as static pages
```

## About the drafts

Chapters marked `needs-review` were generated from the public-domain King James
Version and rewritten in this Bible's simple-English style to fill gaps. They are
clearly labeled and must be reviewed by a person before being marked `published`.
