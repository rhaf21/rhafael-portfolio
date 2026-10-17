import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Matches not-found.tsx: without it, the browser swaps in this route's own
// (default) metadata after load, and the tab shows the home title on a 404.
export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

// With two root layouts (site and CMS) there is no app-wide not-found, so an
// unknown URL would get Next's bare default 404. Anything the site doesn't
// match lands here and renders (frontend)/not-found.tsx inside the site layout.
// More specific routes, like /admin and /api, still win.
export default function Missing() {
  notFound();
}
