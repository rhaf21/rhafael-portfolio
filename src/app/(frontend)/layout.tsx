import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header, Footer } from "@/components/layout";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SkipToContent } from "@/components/SkipToContent";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteSettings } from "@/lib/payload";
import "../globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rhafael | Portfolio",
    template: "%s | Rhafael",
  },
  description:
    "Full-stack developer specializing in web and software development. Building modern, performant applications with React, Next.js, and TypeScript.",
  keywords: [
    "developer",
    "portfolio",
    "web development",
    "software development",
    "React",
    "Next.js",
    "TypeScript",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  authors: [{ name: "Rhafael" }],
  creator: "Rhafael",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Rhafael Portfolio",
    title: "Rhafael | Full-Stack Developer",
    description:
      "Full-stack developer specializing in web and software development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rhafael | Full-Stack Developer",
    description:
      "Full-stack developer specializing in web and software development.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ubuntu.variable} ${ubuntuMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <SkipToContent />
          <CustomCursor />
          <Header />
          <main id="main-content" className="flex-1 pt-16">{children}</main>
          <Footer socialLinks={settings.socialLinks} />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
