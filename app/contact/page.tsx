import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Send a message to KJV for the Deaf.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-10 sm:px-6">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        Contact Us
      </h1>
      <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-ink-soft">
        Have a question, a correction, or an encouragement? Send us a message and
        we will get back to you.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
