import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { profilePageSchema } from "@/lib/schema";
import { RevealEffects } from "@/components/ui/RevealEffects";
import type { CSSProperties } from "react";
import { getSiteSettings } from "@/lib/payload";
import { Closer, Facts } from "@/components/proof/CaseParts";
import { StoryPoster } from "@/components/proof/StoryPoster";
import { MILLINER_CLEARED } from "@/data/proof";
import { TOOLKIT } from "@/data/services";
import "@/styles/about.css";

export const revalidate = 86400;

export const metadata: Metadata = pageMeta({
  title: "About Rhafael Corpuz",
  description:
    "Rhafael Corpuz is an independent Shopify developer and CRM automation specialist working in GoHighLevel, Salesforce, and n8n for established businesses in the US, UK, and Australia.",
  path: "/about",
});

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;
const i = (n: number) => ({ "--i": n }) as CSSProperties;

const CHAPTERS: Array<[string, string, string]> = [
  ["Liquid themes", "Freelancing on Shopify, building themes for small direct-to-consumer brands", "How e-commerce actually converts"],
  ["WordPress", "Custom themes, WooCommerce, and ACF editorial sites", "Building for the people who edit the site"],
  ["React and Next.js", "Headless WordPress and SaaS dashboards in TypeScript", "Typed, testable, fast front ends"],
  ["BoardGameTally", "My own multi-tenant SaaS with real-time scoring", "Owning a product end to end"],
  ["CRM automation", "GoHighLevel, Salesforce, and n8n systems for service businesses", "Following the order past checkout"],
  ["Now", "Building Provey, an AI agent that does Shopify work with proof", "Every change deserves a receipt"],
];

// What's on screen in the 30-second story, beat by beat.
const TRANSCRIPT: Array<[string, string, string?]> = [
  ["0:00", "Good stores still lose sales.", "Usually somewhere no one checks."],
  ["0:04", "I started finding where, one Liquid theme at a time.", "{% for product in collection.products %}"],
  ["0:09", "Then I followed the order past checkout.", "Shopify, then GoHighLevel and Salesforce."],
  ["0:14", "Clicks to pay at a Sydney milliner: from 4 to 2.", "Stranded students, unblocked: 26."],
  ["0:20", "Every change ships with a receipt.", "Before, after, fixes, checks. Stamped: shipped."],
  ["0:25", "Rhafael Corpuz. Work you can check.", "Book a 20-min call. Shopify · GoHighLevel · Salesforce · n8n."],
];

const RULES: Array<[string, string]> = [
  ["Your accounts, your code.", "Everything gets built inside your Shopify, CRM, and n8n accounts. You keep every login and line of code."],
  ["Numbers over adjectives.", "Every audit counts what it finds, and every build says what changed. If I can’t measure it, I say so."],
  ["The live store is sacred.", "Work happens on a copy, gets checked, and you publish. Nothing lands untested."],
  ["One clear status.", "Every job ends done, partial, blocked, or needs input. Never “almost done.”"],
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const email = settings.email || "rhafaelcorpuz21@gmail.com";
  const sameAs = settings.socialLinks.filter((l) => l.url).map((l) => l.url);
  const milliner = MILLINER_CLEARED ? "Ford Millinery in Sydney" : "a designer milliner in Sydney";

  return (
    <div className="about">
      <JsonLd graph={[profilePageSchema(sameAs)]} />
      <section className="wrap top about-top">
        <div className="top-copy">
          <span className="label fade-up">About</span>
          <h1 className="h1">
            <span className="ml">
              <span style={d(80)}>I&rsquo;m</span>
            </span>
            <span className="ml">
              <span style={d(200)}>
                <em>Rhafael Corpuz.</em>
              </span>
            </span>
          </h1>
          <p className="lede fade-up" style={d(380)}>
            An independent Shopify developer and CRM automation specialist working in GoHighLevel, Salesforce, and n8n.
            I build online stores for established businesses, and the systems that run the work behind them.
          </p>
          <div className="fade-up" style={d(500)}>
            <Facts
              rows={[
                ["Hours", "Async across US, UK, and Australian time zones"],
                ["Reply time", "Within 24 hours"],
                ["Also building", "Provey, an AI agent for Shopify merchants, launching soon"],
              ]}
            />
          </div>
        </div>
        <div className="about-poster fade-up" style={d(300)} id="story">
          <StoryPoster
            headline={
              <>
                <span className="pn">
                  Good stores still <em>lose sales.</em>
                </span>
                <span className="wire" />
              </>
            }
          />
        </div>
      </section>

      <section className="wrap sec" aria-labelledby="transcript-h">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">The 30-second story</span>
            <h2 className="h2" id="transcript-h">
              In words, <em>beat by beat.</em>
            </h2>
          </div>
          <p>The story has no voiceover, so here is everything it shows, in order.</p>
        </div>
        <ol className="transcript" data-stagger>
          {TRANSCRIPT.map(([t, line, sub], n) => (
            <li key={t} style={i(n)}>
              <span className="mono t">{t}</span>
              <span className="line">{line}</span>
              {sub && <span className="sub">{sub}</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">The changelog</span>
            <h2 className="h2">
              How I got <em>here.</em>
            </h2>
          </div>
          <p>Each chapter added a skill clients now hire me for.</p>
        </div>
        <div className="ledger chapters" data-reveal>
          <table>
            <thead>
              <tr>
                <th scope="col">Chapter</th>
                <th scope="col">What changed</th>
                <th scope="col">What it taught me</th>
              </tr>
            </thead>
            <tbody>
              {CHAPTERS.map(([chapter, what, taught], n) => (
                <tr key={chapter} style={i(n)}>
                  <th scope="row" className="t">
                    {chapter}
                  </th>
                  <td>{what}</td>
                  <td className="now">{taught}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap sec long">
        <div data-reveal>
          <span className="label">In my own words</span>
          <h2 className="h2">The long version</h2>
        </div>
        <div className="prose" data-reveal>
          <p>
            I&rsquo;m Rhafael Corpuz, an independent Shopify developer and CRM automation specialist. I build and
            maintain online stores for established businesses, and I build the CRM and automation systems that run the
            operations behind them.
          </p>
          <p>
            <strong>Shopify.</strong> I run ongoing theme development for Displaysense, a UK display and signage
            retailer, across a catalog of more than 3,500 products, including a quotation flow built on the Draft Orders
            API. For {milliner} I built a CRO expert&rsquo;s audit on the live store. For Opera Beds I built
            product-finder and finance tooling into the storefront.
          </p>
          <p>
            <strong>CRM automation.</strong> For an Australian training provider I audited GoHighLevel end to end and
            built twelve n8n automations, a shared inbox, and an embedded dashboard. In Salesforce I build Flows, Apex
            classes, and triggers.
          </p>
          <p>
            <strong>Off the clock.</strong> I built and run BoardGameTally, a free scoring app for board game groups,
            and I&rsquo;m building Provey, an AI agent that does Shopify work and hands back proof of every change.
          </p>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Toolkit</span>
            <h2 className="h2">What I work in.</h2>
          </div>
        </div>
        <div className="tools" data-stagger>
          {TOOLKIT.map((t, n) => (
            <div key={t.name} style={i(n)}>
              <h3>{t.name}</h3>
              <p>{t.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">How I work</span>
            <h2 className="h2">
              Four rules <em>I don&rsquo;t bend.</em>
            </h2>
          </div>
        </div>
        <div className="rules" data-stagger>
          {RULES.map(([rule, why], n) => (
            <div key={rule} style={i(n)}>
              <h3>{rule}</h3>
              <p>{why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <Closer
          title={
            <>
              Tell me what <em>you are building.</em>
            </>
          }
          cta="Book a 20-min call"
          email={email}
        />
      </section>
      <RevealEffects />
    </div>
  );
}
