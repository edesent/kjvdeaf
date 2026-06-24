import type { MetadataRoute } from "next";
import { BOOKS } from "@/lib/books";
import { chapterStatus } from "@/lib/bible";

const BASE = "https://kjvdeaf.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1 },
    { url: `${BASE}/about`, priority: 0.4 },
  ];
  for (const b of BOOKS) {
    entries.push({ url: `${BASE}/${b.slug}`, priority: 0.6 });
    for (let c = 1; c <= b.chapters; c++) {
      // only list finished (published) chapters — drafts are hidden by default
      if (chapterStatus(b.name, c) !== "published") continue;
      entries.push({ url: `${BASE}/${b.slug}/${c}`, priority: 0.8 });
    }
  }
  return entries;
}
