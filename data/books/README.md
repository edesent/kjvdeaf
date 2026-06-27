# Scripture text — one file per book

This folder holds the actual Bible text. **Each file is one book**, named by its
slug: `john.json`, `genesis.json`, `1-corinthians.json`, `song-of-solomon.json`.
All 66 books have a file; a book with no text yet is just `{}`.

## Shape of a book file

A book file maps **chapter number → chapter**:

```jsonc
{
  "3": {                              // chapter 3
    "status": "published",            // "published" | "needs-review" | "empty"
    "verses": [
      { "n": 1, "text": "There was a Pharisee. His name was Nicodemus…" },
      { "n": 2, "text": "Nicodemus came to Jesus in the night…" }
    ]
  }
}
```

## How to edit a chapter (published **or** draft)

1. **Find it.** Open the book file (e.g. `john.json`) and look at the chapter-number
   key (`"3"`). The whole book is in that one file.
2. **Edit the verses.** Change the `text` of any verse, or add/remove verses in the
   `verses` array (keep `n` in order). This works the same whether the chapter is
   `published` or a `needs-review` draft.
3. **Set the status:**
   - `"published"` — final, reviewed text. Shows normally on the site.
   - `"needs-review"` — a **draft** (prepared from the KJV, not yet checked). Shows
     an amber "Draft — needs review" banner.
   - **To publish a draft:** change `"status": "needs-review"` to `"status": "published"`.
   - **To send something back to draft:** change it the other way.

That's all. The site rebuilds the page, navigation, banners, and sitemap on its
own. Do **not** edit `../bible-data.ts` (it is auto-assembled) or `../../lib/books.ts`
(the fixed list of books) — only the per-book files here.
