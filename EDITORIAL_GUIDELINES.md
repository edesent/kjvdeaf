# Editorial Guidelines — KJV Deaf Bible

Standing rules applied throughout this project. Keep this file updated as new standards are established.

## Core approach
- **KJV base text**, checked verse-by-verse against Hebrew/Greek (Strong's Concordance / Blue Letter Bible)
- Plain, direct, everyday English — avoid elevated/Latinate vocabulary (e.g. "transfigured," "customs duties," "exempt," "luminous") even when it would be more "literary." Sharpen concrete/visual details when they carry real meaning (e.g. "torn open" vs "open," "dug through" vs "made a hole"), but don't add exposition the original text doesn't have.

## Pronoun clarity — PREFER EXPLICIT NOUNS OVER PRONOUNS
This is a strong standing preference, not just a fallback for genuine ambiguity. Default to naming the person/subject explicitly (e.g. "Jesus said" rather than "He said") even in cases where the pronoun's referent is technically clear from context. Apply this more liberally than a strict "fix only real ambiguity" rule — err on the side of naming.

Exceptions where pronouns are fine as-is:
- Single, unambiguous fictional character within one parable/story (e.g. "a man" who plants seed — his own "he/his" throughout that story)
- First-person "I" (never ambiguous)
- Very short-range continuation within the same sentence/clause where renaming would feel unnatural or overly repetitive (judgment call — when in doubt, use the noun)

Also watch for **over-repetition** in the other direction: if a name is repeated many times in quick succession with no ambiguity risk, smooth some instances back to a pronoun (e.g. "Mary Magdalene and the other Mary" repeated 6x in Matthew 28 was trimmed to "they/them" after first establishing both women).

## Gender-neutral language
Convert generic "he/his/him" (referring to "anyone," "whoever," "a person," "a prophet," etc.) to gender-neutral phrasing ("that person," "they/their," or restructuring). Exception: gendered passages that are textually specific (e.g. husband/wife qualifications, "husband of one wife," household codes) stay gendered.

## Capitalization
Every verse must start with a capital letter, including continuation verses that begin mid-sentence in the KJV (e.g. "and," "who," "for").

## Hell vs. the grave
- Hebrew *sheol* / Greek *Hades* → "the grave"
- Greek *Gehenna* (NT judgment/fire imagery) → "hell" (kept as-is)
- 2 Peter 2:4's *Tartarus* → "hell" (kept as-is)

## Word-level consistency across the whole book
When a specific term matters (e.g. the Greek uses two different words for "baskets" — *kophinoi*, small hand-baskets, at the feeding of the 5,000, vs. *spyrides*, large provision hampers, at the feeding of the 4,000), preserve that same distinction consistently everywhere it appears, including in parallel passages across different books (Matthew/Mark) and in places where Jesus himself references both events (Matthew 16:9-10, Mark 8:19-20).

## No contractions
Formal, direct phrasing — no contractions in the text itself.

## Never use "deaf" as a negative metaphor
E.g. "turns a deaf ear" → "refuses to listen."

## Book-specific naming notes
- Proverbs: nav/URL slug stays `/proverbs/`; in-text title is "Wise Lessons for Life"
- Holy Spirit: always named explicitly ("the Spirit," "the Helper"), never left as bare "he/him"

## Progress tracking
See each book's `data/books/<slug>.json` — chapters are marked `needs-review` until checked against these guidelines and published.
