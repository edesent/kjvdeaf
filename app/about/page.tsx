import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About this Bible",
  description:
    "Why KJV for the Deaf exists, and how the simple-English text is prepared.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        About this Bible
      </h1>
      <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-ink-soft">
        <p>
          For many Deaf people, American Sign Language is their first language and
          English is their second. The older, formal English of the King James Version
          can be hard to read. This Bible takes that same Word of God and puts it into
          short, clear, everyday sentences.
        </p>
        <p>
          The goal is simple: that anyone can open any chapter and understand it the
          first time they read it.
        </p>
        <h2 className="pt-2 font-serif text-2xl font-medium text-ink">
          About the drafts
        </h2>
        <p>
          Some chapters are marked{" "}
          <span className="font-semibold text-review">Draft — needs review</span>. These
          were prepared from the public-domain King James Version and rewritten in this
          Bible&rsquo;s simple-English style to fill in chapters that aren&rsquo;t finished
          yet. They are clearly labeled, and a person reviews each one before it becomes
          final.
        </p>
        <p>
          Chapters without that label have been written and checked, and are ready to
          read.
        </p>
      </div>
    </div>
  );
}
