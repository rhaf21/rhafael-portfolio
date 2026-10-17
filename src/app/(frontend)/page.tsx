import type { Metadata } from "next";
import Link from "next/link";
import { RevealEffects } from "@/components/ui/RevealEffects";
import type { CSSProperties } from "react";
import { getSiteSettings } from "@/lib/payload";
import { JsonLd } from "@/components/JsonLd";
import { businessSchema, personSchema, websiteSchema } from "@/lib/schema";
import { ReceiptPrinter } from "@/components/proof/ReceiptPrinter";
import { Ledger } from "@/components/proof/Ledger";
import { CodePanel } from "@/components/proof/CodePanel";
import { SpeedMeter } from "@/components/proof/SpeedMeter";
import { StoryPoster } from "@/components/proof/StoryPoster";
import { Ends } from "@/components/proof/Ends";
import { Pricing } from "@/components/proof/Pricing";
import { EXCERPTS, LEDGER, RECEIPTS } from "@/data/proof";
import { UPWORK_URL } from "@/data/navigation";
import "@/styles/home.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

export default async function HomePage() {
  const settings = await getSiteSettings();
  const email = settings.email || "rhafaelcorpuz21@gmail.com";
  const github = settings.socialLinks.find((l) => l.platform === "github");
  const sameAs = settings.socialLinks.filter((l) => l.url).map((l) => l.url);

  return (
    <div className="home">
      <JsonLd graph={[websiteSchema(), personSchema(sameAs), businessSchema()]} />

      <section className="wrap hero">
        <div className="hero-copy">
          <h1 className="h1">
            <span className="ml">
              <span style={d(120)}>Work you can</span>
            </span>
            <span className="ml">
              <span style={d(240)}>
                <span className="chk">
                  check.
                  <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden>
                    <path pathLength={1} d="M4 15 C 70 6, 150 4, 220 9 S 286 16, 296 10" />
                  </svg>
                </span>
              </span>
            </span>
          </h1>
          <p className="lede fade-up" style={d(520)}>
            I build Shopify stores and the CRM automation behind them, in GoHighLevel, Salesforce, and n8n. Every
            change ships with a receipt: what changed and what it did.
          </p>
          <div className="cta fade-up" style={d(640)}>
            <Link className="btn btn-ink" href="/contact">
              Book a 20-min call <span className="arr">→</span>
            </Link>
            <a className="btn btn-text" href="#shipped">
              See what shipped
            </a>
          </div>
          <p className="avail mono fade-up" style={d(760)}>
            <span className={settings.availableForWork ? "pulse" : "pulse off"} aria-hidden />
            {settings.availableForWork
              ? "Taking new projects · replies within 24 hours"
              : "Fully booked right now · ask about the next opening"}
          </p>
        </div>
        <ReceiptPrinter receipts={RECEIPTS} />
      </section>

      <section className="wrap sec" id="shipped">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Shipped</span>
            <h2 className="h2">The ledger</h2>
          </div>
          <p>
            Changes that went live on clients&rsquo; stores and CRMs, with the before and after I could check. Rows
            with a client name link to the write-up.
          </p>
        </div>
        <Ledger rows={LEDGER.filter((row) => row.featured)} />
        <p className="sec-more" data-reveal>
          <Link className="btn btn-text" href="/projects">
            All work and case studies <span className="arr">→</span>
          </Link>
        </p>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Under the hood</span>
            <h2 className="h2">The code behind the result</h2>
          </div>
          <p>
            Most portfolios stop at a screenshot. Here&rsquo;s the part that does the work, with notes on why
            it&rsquo;s built that way.
          </p>
        </div>
        <div data-reveal>
          <CodePanel excerpts={EXCERPTS} />
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">This page, measured</span>
            <h2 className="h2">Fast is a claim. Here&rsquo;s the reading.</h2>
          </div>
          <p>
            These numbers come from your own browser as this page loaded. A developer&rsquo;s site is a sample of
            their work, so this one shows its receipt too.
          </p>
        </div>
        <SpeedMeter />
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">How a job ends</span>
            <h2 className="h2">One of four states. Never &ldquo;almost done.&rdquo;</h2>
          </div>
          <p>
            Every task is built on a copy, checked, and handed back with a clear status, so you always know where
            your work stands.
          </p>
        </div>
        <Ends />
      </section>

      <section className="wrap sec" id="prices">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Prices</span>
            <h2 className="h2">What it costs, up front</h2>
          </div>
          <p>
            Starting prices for each service, plus what typical jobs come to. A fixed quote always follows the audit
            or a scoping call.
          </p>
        </div>
        <Pricing />
      </section>

      <section className="wrap sec">
        <div className="person" data-reveal>
          <StoryPoster note="Thirty seconds on how I work. The transcript is on the About page." />
          <div>
            <span className="label">Who you&rsquo;d work with</span>
            <h2 className="h2">Just me. No hand-offs.</h2>
            <p className="lede">You talk to the person writing the code, from the first call to the last check.</p>
            <div className="facts">
              <div className="fact">
                <span>Hours</span>
                <span>Async across US, UK, and Australian time zones</span>
              </div>
              <div className="fact">
                <span>Reply time</span>
                <span>Within 24 hours</span>
              </div>
              <div className="fact">
                <span>Works in</span>
                <span>Shopify, Liquid, GoHighLevel, Salesforce, n8n, Next.js</span>
              </div>
              <div className="fact">
                <span>Also on</span>
                <span>
                  <a href={UPWORK_URL} rel="me noopener" target="_blank">
                    Upwork
                  </a>
                  {github && (
                    <>
                      {" · "}
                      <a href={github.url} rel="me noopener" target="_blank">
                        GitHub
                      </a>
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="cta">
              <Link className="btn btn-ink" href="/contact">
                Book a 20-min call <span className="arr">→</span>
              </Link>
              <a className="btn btn-line" href={`mailto:${email}`}>
                {email}
              </a>
            </div>
          </div>
        </div>
      </section>
      <RevealEffects />
    </div>
  );
}
