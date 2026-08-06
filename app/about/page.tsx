import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About this Bible",
  description: "Why this Bible exists, and how the simple-English text of KJV for the Deaf is prepared.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        About this Bible
      </h1>

      <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-ink-soft">
        <h2 className="pt-2 font-serif text-2xl font-medium text-ink">
          Why KJV for the Deaf?
        </h2>
        <p>
          The King James Version has carried God&rsquo;s Word to English
          speakers for over 400 years. It is trusted, memorized, and preached
          from more than almost any other translation. I am a strong KJV man
          &mdash; for English-speaking people. But Deaf is not English.
        </p>
        <p>
          The KJV was written for hearing people who read English &mdash; a
          language built on long sentences, pronouns that depend on a
          listener&rsquo;s memory, and idioms that only make sense if
          you&rsquo;ve heard them spoken aloud your whole life. For a Deaf
          reader, American Sign Language is the first language, and English
          is the second. ASL is visual, spatial, and concrete. It doesn&rsquo;t
          lean on pronouns the way English does, and it doesn&rsquo;t carry
          idioms like &ldquo;the throne of wickedness&rdquo; or &ldquo;girding
          up your loins.&rdquo; Reading the KJV, for many Deaf people, is like
          reading a language they were never taught to hear.
        </p>
        <p>
          This Bible exists to close that gap &mdash; without changing what
          the KJV actually says.
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
          back the name of the person or thing instead. In a long passage, a
          hearing reader can hold three or four &ldquo;he&rdquo;s in their head and
          sort out who&rsquo;s who. A visual signer can&rsquo;t do that the same
          way — ASL sets up a person in space and refers back to that specific
          spot, so a text that keeps saying &ldquo;he&hellip;he&hellip;he&rdquo;
          across several sentences gives a signer nothing to anchor to. This can
          look repetitive on the page, but it isn&rsquo;t a matter of taste —
          it&rsquo;s a matter of clarity, so every verse gives the reader a
          specific person to picture, not a placeholder to guess at.
        </p>
        <p>
          Some KJV words were the right word in 1611 but mislead a reader today. A
          few examples, checked against the Hebrew:
        </p>
        <ul className="ml-5 list-disc space-y-2.5">
          <li>
            <strong>Genesis 3:4</strong> &mdash; &ldquo;took the dark away
            from the light&rdquo; softens the Hebrew <em>badal</em> (H914),
            which means <em>divided</em> or <em>separated</em> &mdash; not
            removed. God didn&rsquo;t erase the dark; God separated it from
            the light.
          </li>
          <li>
            <strong>Genesis 49:27</strong> &mdash; &ldquo;at night he shall
            divide the spoil&rdquo; uses <em>spoil</em> in a sense most
            readers now hear as &ldquo;ruined food.&rdquo; The Hebrew word is{" "}
            <em>shalal</em> (H7998) &mdash; plunder, war treasure, captured
            goods. So the easy-English text says exactly that: Benjamin
            divides the <em>war treasure</em>.
          </li>
          <li>
            <strong>Psalm 107:20</strong> &mdash; &ldquo;delivered them from
            their destructions&rdquo; is vague. The Hebrew <em>shechiyth</em>{" "}
            (H7825) specifically means a pit, a trap, a grave. The
            easy-English version says: <em>pulled the helpless people out of
            the deep pit of death</em>.
          </li>
        </ul>
        <p>
          These aren&rsquo;t reinterpretations. They&rsquo;re the same meaning
          the KJV translators intended in 1611 &mdash; restated in words that
          mean the same thing to a reader today, hearing or Deaf.
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

        <h2 className="pt-2 font-serif text-2xl font-medium text-ink">
          Why it matters
        </h2>
        <p>
          Scripture was never meant to be a lecture. It&rsquo;s a record of
          people <em>doing</em> something because they trusted God &mdash;
          Noah building the ark before it ever rained, Moses lifting his
          staff at a sea that hadn&rsquo;t parted yet, a poor widow giving her
          last two coins. In Hebrew, the word for faith, <em>emunah</em>{" "}
          (אֱמוּנָה), isn&rsquo;t a feeling &mdash; it&rsquo;s faithfulness
          expressed through action.
        </p>
        <p>
          My hope is that every reader of this Bible &mdash; Deaf or hearing
          &mdash; sees God&rsquo;s Word clearly enough to ask the question
          underneath all of Scripture: <em>What would I do for the Kingdom of
          God if I actually believed He would provide?</em>
        </p>

        <h2 className="pt-2 font-serif text-2xl font-medium text-ink">
          This is a work in progress
        </h2>
        <p>
          No single translator &mdash; hearing or Deaf &mdash; can catch every
          place where a sentence still reads awkwardly in ASL. If something in
          this Bible doesn&rsquo;t make sense, or reads confusingly, please
          reach out through the Contact page or by emailing{" "}
          <a
            href="mailto:kjvdeaf@kjvdeaf.com"
            className="text-accent underline underline-offset-2"
          >
            kjvdeaf@kjvdeaf.com
          </a>
          . This project only gets better with feedback from the people
          it&rsquo;s actually for.
        </p>
      </div>
    </div>
  );
}
