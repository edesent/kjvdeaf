import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DraftsProvider } from "@/components/DraftsProvider";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

// Self-hosted: next/font/google downloads from Google at build time and
// intermittently fails Vercel builds.
const ui = localFont({
  variable: "--font-ui",
  display: "swap",
  src: [{ path: "./fonts/inter-latin.woff2", weight: "100 900", style: "normal" }],
});

const scripture = localFont({
  variable: "--font-scripture",
  display: "swap",
  src: [
    { path: "./fonts/newsreader-latin.woff2", weight: "400 600", style: "normal" },
    { path: "./fonts/newsreader-latin-italic.woff2", weight: "400 600", style: "italic" },
  ],
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KJV Deaf",
  },
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
        <ServiceWorkerRegister />
        <DraftsProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </DraftsProvider>
      </body>
    </html>
  );
}
