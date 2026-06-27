# KJV for the Deaf

The Bible in clear, simple English — a fast, mobile-first reading site.
Built by [Elijah Desent](https://www.elijahdesent.com). Next.js 16 + Tailwind v4,
deployed on Vercel (auto-deploys on push to `main`).

## How the content works (read this before editing)

There is **no database**. All Scripture text lives in **one small file per book**,
in [`data/books/`](data/books/) — for example [`data/books/john.json`](data/books/john.json),
[`data/books/genesis.json`](data/books/genesis.json), [`data/books/1-corinthians.json`](data/books/1-corinthians.json).
The file name is the book's slug (lowercase, spaces become hyphens). All 66 books
of the canon have a file, even before they have any text (an empty book is just `{}`).

Each book file maps **chapter number → chapter**:

```jsonc
// data/books/john.json
{
  "3": {
    "status": "published",          // see statuses below
    "sourceUrl": "https://…",       // where this text came from (optional)
    "verses": [
      { "n": 1, "text": "There was a Pharisee. His name was Nicodemus…" },
      { "n": 2, "text": "Nicodemus came to Jesus in the night…" }
    ]
  }
}
```

The book names and chapter counts (the full 66-book canon) are fixed in
[`lib/books.ts`](lib/books.ts) — you don't edit that to add text, only the book
files. (The site reads all the book files through [`data/bible-data.ts`](data/bible-data.ts),
which is auto-assembled — you never edit that either.)

### How to find a chapter

To work on, say, **John 3**: open [`data/books/john.json`](data/books/john.json)
and look at the key `"3"`. That one small file holds *every* chapter of John, so
you can read the whole book at once — no need to load anything else.

- The file is **`data/books/<book-slug>.json`** — `1 Corinthians` → `1-corinthians`,
  `Song of Solomon` → `song-of-solomon`, `Psalms` → `psalms`.
- The chapter is the **top-level key** matching the chapter number (`"3"`).
- To find a chapter by a phrase you remember, search the book file (or all of
  `data/books/`) for that text.

### Chapter statuses

Every chapter entry has a `status`. **There are two live kinds of chapter, and
you can read and edit both:**

| status         | What it means                                       | How it looks on the site            |
| -------------- | --------------------------------------------------- | ----------------------------------- |
| `published`    | **Published** — final, reviewed text.               | Reads normally.                     |
| `needs-review` | **Draft** — prepared from the KJV, *not yet checked*. | Amber "Draft — needs review" banner |
| `empty`        | Exists in the source but had no text.               | "Coming soon" message               |

A chapter with **no entry at all** simply shows "This chapter isn't ready yet."
There are 1,189 chapters in the whole Bible; any not in the book files are marked
coming soon automatically.

> **For the AI editor:** the site is a work in progress, so the book files hold a
> mix of **published chapters** and **draft (`needs-review`)** chapters side by
> side. Both are yours to edit. Don't assume everything is published, and don't
> ignore the drafts — they are real chapters waiting to be polished and published.

### Seeing what's a draft vs. published

Open the book you care about and read the `status` on each chapter, or **search**
across [`data/books/`](data/books/):

- **All drafts** → search for `"status": "needs-review"`
- **All published** → search for `"status": "published"`

Each match's file name tells you the book, and the nearest `"N":` key above it
tells you the chapter.

### To add, fix, or publish a chapter

All of these are the same one move: edit that chapter's entry in its book file
(e.g. [`data/books/john.json`](data/books/john.json)).

- **Add or fix text** — create or update the chapter's entry with its `verses`.
- **Publish a draft** — find the chapter, review the wording, then change
  `"status": "needs-review"` to `"status": "published"`.
- **Send something back to draft** — change `"status"` the other way.

That's the whole job — the page, navigation, banners, and sitemap all update by
themselves. You can simply ask Claude or ChatGPT: *"Publish the draft of
Genesis 7"* or *"Add Genesis 7 with this text…"* and it will edit the file for you.

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
Editing a draft is encouraged — fixing its wording and flipping its status to
`published` is exactly how the Bible gets finished, chapter by chapter.
