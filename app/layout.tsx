import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/** Display serif — authoritative, precise, trustworthy. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

/** Humanist body + data face — highly legible, great tabular figures. */
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Cardia — Master your heart health",
    template: "%s · Cardia",
  },
  description:
    "Understand your cardiovascular biomarkers against current clinical guidelines. Every value categorized and traced to a named, dated source — educational information, not medical advice.",
  applicationName: "Cardia",
  authors: [{ name: "Cardia" }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#112430",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${ibmPlexSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="bg-canvas text-ink flex min-h-full flex-col">
        <a
          href="#main"
          className="focus:bg-ink focus:text-paper sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
