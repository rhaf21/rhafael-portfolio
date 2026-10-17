import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { SkipToContent } from "@/components/SkipToContent";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteSettings } from "@/lib/payload";
import { OG_IMAGE, PERSON, SITE_TITLE, SITE_URL } from "@/lib/site";
import "../globals.css";
import "@/styles/proof.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${PERSON.name}`,
  },
  description: PERSON.description,
  keywords: [
    "Shopify developer",
    "Shopify CRO",
    "GoHighLevel developer",
    "GoHighLevel automation",
    "Salesforce Flow",
    "Apex triggers",
    "n8n automation",
    "CRM automation specialist",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon.png", type: "image/png", sizes: "96x96" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
  manifest: "/manifest.webmanifest",
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: PERSON.name,
    title: SITE_TITLE,
    description: PERSON.description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Rhafael Corpuz. Work you can check." }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: PERSON.description,
    images: [OG_IMAGE],
  },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    // Font variables sit on <html> so the :root tokens in globals.css can read them.
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <div className="thread" aria-hidden />
        <SkipToContent />

        <Header />
        <main id="main-content">{children}</main>
        <Footer email={settings.email || "rhafaelcorpuz21@gmail.com"} socialLinks={settings.socialLinks} />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
