import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getSiteSettings } from "@/lib/payload";
import { MissingReceipt, ReportLink } from "@/components/proof/MissingReceipt";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

const ALTERNATIVES: Array<[string, string, string]> = [
  ["Looking for proof?", "See what shipped", "/projects"],
  ["Need a price?", "Services and prices", "/services"],
  ["Came from a post?", "Read the blog", "/blog"],
  ["Something broken?", "Book a 20-min call", "/contact"],
];

// A 404 is one of the four ways a job ends: blocked, with the closest workable alternative.
export default async function NotFound() {
  const settings = await getSiteSettings();
  const email = settings.email || "rhafaelcorpuz21@gmail.com";

  return (
    <section className="wrap nf">
      <div className="nf-copy">
        <div className="nf-tag fade-up">
          <span className="st blocked">blocked</span>
          <span className="label">Error 404</span>
        </div>
        <h1 className="h1">
          <span className="ml">
            <span>This page</span>
          </span>
          <span className="ml">
            <span style={{ "--d": 120 } as CSSProperties}>
              <em>didn&rsquo;t ship.</em>
            </span>
          </span>
        </h1>
        <p className="lede fade-up" style={{ "--d": 350 } as CSSProperties}>
          The link is old, mistyped, or the page moved. Every job here ends in one of four states, and this one is
          blocked. So here&rsquo;s the closest workable alternative.
        </p>
        <ol className="alts">
          {ALTERNATIVES.map(([q, label, href], i) => (
            <li key={href} className="fade-up" style={{ "--d": 500 + i * 80 } as CSSProperties}>
              <Link href={href}>
                <span className="q">{q}</span>
                <b>{label}</b>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ol>
        <ReportLink email={email} />
      </div>
      <MissingReceipt />
    </section>
  );
}
