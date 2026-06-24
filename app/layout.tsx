import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const ui = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

const scripture = Newsreader({
  variable: "--font-scripture",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kjvdeaf.com"),
  title: {
    default: "KJV for the Deaf — the Bible in clear, simple English",
    template: "%s · KJV for the Deaf",
  },
  description:
    "The Word of God in plain, easy-to-read English — written for the Deaf and for everyone who wants Scripture in simple, clear language.",
  openGraph: {
    title: "KJV for the Deaf",
    description: "The Bible in clear, simple English.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${ui.variable} ${scripture.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
