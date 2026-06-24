import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DraftsProvider } from "@/components/DraftsProvider";

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
    default: "KJV for the Deaf",
    template: "%s · KJV for the Deaf",
  },
  description:
    "The Word of God, written in short, clear sentences, made for the Deaf.",
  openGraph: {
    title: "KJV for the Deaf",
    description: "The Word of God, written in short, clear sentences, made for the Deaf.",
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
        <DraftsProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </DraftsProvider>
      </body>
    </html>
  );
}
