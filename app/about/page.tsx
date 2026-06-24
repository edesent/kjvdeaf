import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About this Bible",
  description: "How the simple-English text of KJV for the Deaf is prepared.",
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
          English is their second. The older, formal English of the King James
          Version can be hard to read. This Bible takes that same Word of God and
          puts it into short, clear sentences that are easy to understand the first
          time you read them.
        </p>

        <h2 className="pt-2 font-serif text-2xl font-medium text-ink">
          How each chapter is made
        </h2>
        <p>
          The <strong>King James Version is the base</strong>, because I believe it
          is the closest to the original. Then I compare it with other trusted
          resources to find the clearest way to say each verse:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>the Africa Deaf Bible</li>
          <li>the Easy-to-Read Version</li>
          <li>the Amplified Bible</li>
          <li>Blue Letter Bible</li>
        </ul>
        <p>
          Working between them, each verse is brought down to the easiest, clearest
          words. I also take out most of the pronouns — words like{" "}
          <em>he, she, it,</em> and <em>they</em> — that can be confusing, and put
          back the name of the person or thing instead. The goal is always the same:
          that anyone can open a chapter and understand it right away.
        </p>

        <h2 className="pt-2 font-serif text-2xl font-medium text-ink">
          About the drafts
        </h2>
        <p>
          Some chapters are marked{" "}
          <span className="font-semibold text-review">Draft — needs review</span>.
          These were prepared from the King James Version in this same simple style
          to fill in chapters that aren&rsquo;t finished yet. They are hidden by
          default and are waiting for a person to read and check them before they
          become final. You can show them with the switch at the bottom of any page.
        </p>
        <p>
          Chapters without that label have been written and checked, and are ready
          to read.
        </p>
      </div>
    </div>
  );
}
