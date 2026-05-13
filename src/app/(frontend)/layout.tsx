import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import dynamic from "next/dynamic";
const CustomCursor = dynamic(() =>
  import("@/components/ui/CustomCursor").then((m) => m.CustomCursor)
);
import { Ambient, Grain, RevealEffects } from "@/components/ui";
import { SkipToContent } from "@/components/SkipToContent";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteSettings } from "@/lib/payload";
import "../globals.css";

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
  title: {
    default: "Rhafael · Full-Stack Developer",
    template: "%s | Rhafael",
  },
  description:
    "Full-stack developer specializing in Shopify, WordPress, and modern React applications.",
  keywords: [
    "developer",
    "portfolio",
    "Shopify",
    "WordPress",
    "React",
    "Next.js",
    "TypeScript",
  ],
  icons: { icon: "/favicon.png", apple: "/apple-icon.png" },
  authors: [{ name: "Rhafael" }],
  creator: "Rhafael",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Rhafael Portfolio",
    title: "Rhafael · Full-Stack Developer",
    description: "Shopify, WordPress, and modern React applications.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rhafael · Full-Stack Developer",
    description: "Shopify, WordPress, and modern React applications.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <div className="ambient" aria-hidden>
          <Ambient />
        </div>
        <Grain />
        <CustomCursor />
        <SkipToContent />
        <RevealEffects />

        <div className="shell">
          <Header availableForWork={settings.availableForWork} />
          <main id="main-content">{children}</main>
          <Footer socialLinks={settings.socialLinks} />
        </div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
