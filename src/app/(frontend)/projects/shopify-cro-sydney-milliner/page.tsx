import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { RevealEffects } from "@/components/ui/RevealEffects";
import type { CSSProperties } from "react";
import { getSiteSettings } from "@/lib/payload";
import { CaseSlip, Closer, Crumbs, Facts, NextCase } from "@/components/proof/CaseParts";
import { CodePanel } from "@/components/proof/CodePanel";
import { CartFlowDemo, SwatchDemo } from "@/components/proof/MillinerDemos";
import { CRM_CASE, EXCERPTS, MILLINER_CLEARED, RECEIPTS } from "@/data/proof";
import "@/styles/case.css";

export const revalidate = 3600;

const CLIENT = MILLINER_CLEARED ? "Ford Millinery" : "A Sydney milliner";

export const metadata: Metadata = pageMeta({
  title: "Case study: a Shopify CRO audit, built on a live store",
  description:
    "Building a ten-point CRO audit on a Sydney milliner's live Shopify store: checkout in two clicks instead of four, sizing for headwear, auto-filled cross-sells, breadcrumbs with structured data, and one card per style.",
  path: "/projects/shopify-cro-sydney-milliner",
  type: "article",
});

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

const RECOMMENDATIONS: Array<[string, string, string, "done" | "in review"]> = [
  ["01", "Cart pop-up straight to checkout", "Button reads CHECKOUT; the cart page detour is gone", "done"],
  ["02", "Reassurance at the buy button", "Free returns, plus the made-in-Australia claim the client confirmed", "done"],
  ["03", "Sizing for headwear", "S 54 to 55 cm through XL 60 to 61 cm, replacing a face-mask chart", "done"],
  ["04", "Product reviews", "Review requests that link to the product bought", "done"],
  ["05", "Homepage testimonials", "Matching the section shoppers see on product pages", "done"],
  ["07", "Cross-sells", "Fill in automatically when a product has none set", "done"],
  ["09", "Homepage categories", "Fascinators, Sun Hats, Race Day, Headbands, Earrings, Bags", "done"],
  ["10", "Breadcrumbs", "On collection and product pages, with structured data", "done"],
  ["+", "Collection swatches", "One card per style, colours as swatches", "in review"],
];

// Store-internal counts stay qualitative until the client clears publishing them.
const DUG_UP: Array<[string, string, string]> = MILLINER_CLEARED
  ? [
      ["Draft products invisible to every filter", "967", "A tagging plan for new arrivals: category, occasion, colour, hat style"],
      ["Search that didn’t narrow anything", "433 / 471", "Traced it to related-product matching and added category shortcuts"],
      ["Tracking tags blocked by one speed app", "3", "Flagged that GA4, Google Ads, and the Meta pixel weren’t loading"],
      ["Internal pages showing in Google", "2", "Hidden and marked no-index, plus article schema on 109 posts"],
    ]
  : [
      ["Draft products invisible to every filter", "hundreds", "A tagging plan for new arrivals: category, occasion, colour, hat style"],
      ["Search that didn’t narrow anything", "~92%", "Traced it to related-product matching and added category shortcuts"],
      ["Tracking tags blocked by one speed app", "3", "Flagged that GA4, Google Ads, and the Meta pixel weren’t loading"],
      ["Internal pages showing in Google", "2", "Hidden and marked no-index, plus article schema on every blog post"],
    ];

export default async function MillinerCasePage() {
  const settings = await getSiteSettings();
  const email = settings.email || "rhafaelcorpuz21@gmail.com";
  const receipt = RECEIPTS[0];
  const swatchCode = EXCERPTS.filter((e) => e.key === "liquid");

  return (
    <article className="case">
      <JsonLd
        graph={[
          articleSchema({
            headline: "A CRO audit, built on a live store before Spring Racing",
            description: String(metadata.description),
            path: "/projects/shopify-cro-sydney-milliner",
            image: "/work/sydney-milliner.webp",
            about: ["Shopify", "Conversion rate optimization", "Liquid"],
          }),
          breadcrumbSchema([["Home", "/"], ["Work", "/projects"], [CLIENT, "/projects/shopify-cro-sydney-milliner"]]),
        ]}
      />
      <Crumbs current={MILLINER_CLEARED ? "Ford Millinery" : "Sydney milliner"} />
      <section className="wrap top case-top">
        <div className="top-copy">
          <span className="label fade-up">Case study · Shopify CRO</span>
          <h1 className="h1">
            <span className="ml">
              <span style={d(80)}>A CRO audit, built on a live store</span>
            </span>
            <span className="ml">
              <span style={d(200)}>
                <em>before Spring Racing.</em>
              </span>
            </span>
          </h1>
          <p className="lede fade-up" style={d(380)}>
            {CLIENT} sells more than 500 styles of designer headwear online. An outside CRO expert wrote the audit. I
            was hired to build it, with the first five fixes due within a week.
          </p>
          <div className="fade-up" style={d(500)}>
            <Facts
              rows={[
                ["Client", MILLINER_CLEARED ? "Ford Millinery, Sydney" : "Designer milliner, Sydney"],
                ["Role", "CRO implementation, plus search, catalog, and SEO fixes"],
                ["Stack", "Shopify, Liquid, JavaScript, reviews app, structured data"],
              ]}
            />
          </div>
        </div>
        <CaseSlip receipt={receipt} />
      </section>

      {MILLINER_CLEARED && (
        <section className="wrap sec">
          <div className="sec-top" data-reveal>
            <div>
              <span className="label">The first read</span>
              <h2 className="h2">
                More of a smaller crowd <em>bought.</em>
              </h2>
            </div>
          </div>
          <div className="results" data-stagger>
            <div className="r" style={{ "--i": 0 } as CSSProperties}>
              <span className="label">Conversion rate</span>
              <div className="ft">
                <span className="from">0.86%</span>
                <b>0.92%</b>
              </div>
              <p>of sessions ended in an order</p>
            </div>
            <div className="r" style={{ "--i": 1 } as CSSProperties}>
              <span className="label">Reached checkout</span>
              <div className="ft">
                <span className="from">1.28%</span>
                <b>1.93%</b>
              </div>
              <p>of sessions made it to checkout</p>
            </div>
            <div className="r" style={{ "--i": 2 } as CSSProperties}>
              <span className="label">Traffic</span>
              <div className="ft">
                <b>&minus;38%</b>
              </div>
              <p>fewer sessions in the same window, mostly lost Google traffic</p>
            </div>
          </div>
          <p className="r-note" data-reveal>
            Two weeks of data against the same weeks a year earlier. At about 265 sessions a day the store can&rsquo;t
            run a clean A/B test, so these numbers are directional, not a promised lift.
          </p>
        </section>
      )}

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Shipped</span>
            <h2 className="h2">
              The audit, <em>built.</em>
            </h2>
          </div>
          <p>Each recommendation from the audit, with what changed and where it stands.</p>
        </div>
        <div className="ledger audit-recs" data-reveal>
          <table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Recommendation</th>
                <th scope="col">What changed</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {RECOMMENDATIONS.map(([n, rec, change, status], i) => (
                <tr key={rec} style={{ "--i": i } as CSSProperties}>
                  <td className="mono">{n}</td>
                  <td>{rec}</td>
                  <td>{change}</td>
                  <td>
                    <span className={`st ${status === "done" ? "done" : "rev"}`}>{status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Try the two biggest changes</span>
            <h2 className="h2">
              Fewer steps to pay. <em>Every colour in one card.</em>
            </h2>
          </div>
        </div>
        <div className="demo" data-reveal>
          <CartFlowDemo />
          <SwatchDemo styleName={MILLINER_CLEARED ? "MONICA" : "ONE STYLE"} />
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Under the hood</span>
            <h2 className="h2">
              The snippet behind <em>the swatches.</em>
            </h2>
          </div>
        </div>
        <div data-reveal>
          <CodePanel excerpts={swatchCode} />
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Beyond the audit</span>
            <h2 className="h2">
              Found by digging, <em>not guessing.</em>
            </h2>
          </div>
        </div>
        <div className="ledger dug" data-reveal>
          <table>
            <thead>
              <tr>
                <th scope="col">Found</th>
                <th scope="col">Number</th>
                <th scope="col">What I did</th>
              </tr>
            </thead>
            <tbody>
              {DUG_UP.map(([found, num, did], i) => (
                <tr key={found} style={{ "--i": i } as CSSProperties}>
                  <td>{found}</td>
                  <td className="num">{num}</td>
                  <td>{did}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap sec">
        <NextCase href={CRM_CASE} label="Next case study" title="Training provider" />
      </section>

      <section className="wrap sec">
        <Closer
          title={
            <>
              Have an audit <em>nobody built?</em>
            </>
          }
          cta="Get it built"
          email={email}
        />
      </section>
      <RevealEffects />
    </article>
  );
}
