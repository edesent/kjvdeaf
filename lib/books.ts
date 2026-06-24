// Canonical 66-book KJV canon with chapter counts and testament.
export type Testament = "OT" | "NT";
export interface BookMeta {
  name: string;
  chapters: number;
  testament: Testament;
  order: number;
  slug: string;
}

const RAW: [string, number, Testament][] = [
  ["Genesis", 50, "OT"], ["Exodus", 40, "OT"], ["Leviticus", 27, "OT"], ["Numbers", 36, "OT"],
  ["Deuteronomy", 34, "OT"], ["Joshua", 24, "OT"], ["Judges", 21, "OT"], ["Ruth", 4, "OT"],
  ["1 Samuel", 31, "OT"], ["2 Samuel", 24, "OT"], ["1 Kings", 22, "OT"], ["2 Kings", 25, "OT"],
  ["1 Chronicles", 29, "OT"], ["2 Chronicles", 36, "OT"], ["Ezra", 10, "OT"], ["Nehemiah", 13, "OT"],
  ["Esther", 10, "OT"], ["Job", 42, "OT"], ["Psalms", 150, "OT"], ["Proverbs", 31, "OT"],
  ["Ecclesiastes", 12, "OT"], ["Song of Solomon", 8, "OT"], ["Isaiah", 66, "OT"], ["Jeremiah", 52, "OT"],
  ["Lamentations", 5, "OT"], ["Ezekiel", 48, "OT"], ["Daniel", 12, "OT"], ["Hosea", 14, "OT"],
  ["Joel", 3, "OT"], ["Amos", 9, "OT"], ["Obadiah", 1, "OT"], ["Jonah", 4, "OT"],
  ["Micah", 7, "OT"], ["Nahum", 3, "OT"], ["Habakkuk", 3, "OT"], ["Zephaniah", 3, "OT"],
  ["Haggai", 2, "OT"], ["Zechariah", 14, "OT"], ["Malachi", 4, "OT"],
  ["Matthew", 28, "NT"], ["Mark", 16, "NT"], ["Luke", 24, "NT"], ["John", 21, "NT"],
  ["Acts", 28, "NT"], ["Romans", 16, "NT"], ["1 Corinthians", 16, "NT"], ["2 Corinthians", 13, "NT"],
  ["Galatians", 6, "NT"], ["Ephesians", 6, "NT"], ["Philippians", 4, "NT"], ["Colossians", 4, "NT"],
  ["1 Thessalonians", 5, "NT"], ["2 Thessalonians", 3, "NT"], ["1 Timothy", 6, "NT"], ["2 Timothy", 4, "NT"],
  ["Titus", 3, "NT"], ["Philemon", 1, "NT"], ["Hebrews", 13, "NT"], ["James", 5, "NT"],
  ["1 Peter", 5, "NT"], ["2 Peter", 3, "NT"], ["1 John", 5, "NT"], ["2 John", 1, "NT"],
  ["3 John", 1, "NT"], ["Jude", 1, "NT"], ["Revelation", 22, "NT"],
];

export function bookSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export const BOOKS: BookMeta[] = RAW.map(([name, chapters, testament], i) => ({
  name,
  chapters,
  testament,
  order: i + 1,
  slug: bookSlug(name),
}));

export const BOOKS_BY_SLUG: Record<string, BookMeta> = Object.fromEntries(
  BOOKS.map((b) => [b.slug, b])
);

export const OT_BOOKS = BOOKS.filter((b) => b.testament === "OT");
export const NT_BOOKS = BOOKS.filter((b) => b.testament === "NT");

export const TOTAL_CHAPTERS = BOOKS.reduce((s, b) => s + b.chapters, 0); // 1189
