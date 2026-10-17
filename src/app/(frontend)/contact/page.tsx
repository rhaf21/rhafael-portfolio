import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import type { CSSProperties } from "react";
import { getSiteSettings } from "@/lib/payload";
import { ContactBrief } from "@/components/features/contact/ContactBrief";
import { CAL_URL, UPWORK_URL } from "@/data/navigation";
import "@/styles/contact.css";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title: "Book a call",
  description:
    "Tell me what's broken in your Shopify store or CRM. A 20-minute call with a written next step within 24 hours, whether or not we work together.",
  path: "/contact",
});

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

const NEXT_STEPS: Array<[string, string]> = [
  ["You send a short brief", "Four quick questions, so the call starts in the right place."],
  ["I look before we talk", "I review your store or CRM setup ahead of the call, so we skip the basics."],
  ["You get a written next step", "Within 24 hours of the call: a quote, an audit, or an honest “you don’t need me.”"],
];

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = settings.email || "rhafaelcorpuz21@gmail.com";

  return (
    <div className="wrap contact">
      <div className="contact-left">
        <span className="label fade-up">Book a call</span>
        <h1 className="h1">
          <span className="ml">
            <span style={d(80)}>Tell me</span>
          </span>
          <span className="ml">
            <span style={d(200)}>
              <em>what&rsquo;s broken.</em>
            </span>
          </span>
        </h1>
        <p className="lede fade-up" style={d(380)}>
          A 20-minute call about your store or your CRM. You&rsquo;ll leave with a clear next step, whether or not we
          work together.
        </p>
        <ol className="steps fade-up" style={d(500)}>
          {NEXT_STEPS.map(([b, p]) => (
            <li key={b}>
              <b>{b}</b>
              <span>{p}</span>
            </li>
          ))}
        </ol>
        <div className="alt fade-up" style={d(600)}>
          <a className="book" href={CAL_URL} target="_blank" rel="noopener">
            <span>Rather skip the brief</span>
            <b>Book a 20-minute call directly →</b>
          </a>
          <a href={`mailto:${email}`}>
            <span>Prefer email</span>
            <b>{email}</b>
          </a>
          <a href={UPWORK_URL} rel="me noopener" target="_blank">
            <span>Prefer Upwork</span>
            <b>Hire me on Upwork</b>
          </a>
        </div>
        <p className="tz mono">Async across US, UK, and AU time zones. I reply within 24 hours.</p>
      </div>
      <div className="fade-up" style={d(300)}>
        <ContactBrief />
        <noscript>
          <p className="tz">This form needs JavaScript. Email me instead: {email}</p>
        </noscript>
      </div>
    </div>
  );
}
