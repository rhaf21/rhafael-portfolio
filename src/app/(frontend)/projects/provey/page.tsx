import type { Metadata } from "next";
import Image from "next/image";
import { pageMeta } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { RevealEffects } from "@/components/ui/RevealEffects";
import type { CSSProperties } from "react";
import { getSiteSettings } from "@/lib/payload";
import { CaseSlip, Closer, Crumbs, Facts, NextCase } from "@/components/proof/CaseParts";
import { CardEndings } from "@/components/proof/CardEndings";
import { MILLINER_CASE, MILLINER_CLEARED, PROVEY_CASE, PROVEY_RECEIPT, STATUS_CLASS, type Status } from "@/data/proof";
import "@/styles/case.css";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title: "Case study: Provey, an AI agent for Shopify merchants",
  description:
    "Provey, my own product: an AI agent that does Shopify work on a copy of the theme and returns proof. 98 of 100 test cards finished. Launching soon.",
  path: PROVEY_CASE,
  type: "article",
  image: "/og/provey.jpg",
});

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

const STEPS: Array<[string, string]> = [
  ["Describe it", "In plain words, the way you'd brief a developer. Attach a mockup or a photo if it helps."],
  ["Approve the quote", "Provey reads the store, writes a plan, and prices it in credits. Nothing runs until you approve."],
  ["Provey does the work", "On a hidden copy of the theme, or through the Admin API with a dry run and a snapshot first."],
  ["Check the proof, then publish", "Close-ups at phone and desktop widths, the diff, and the checks that ran. Revert any time."],
];

// From the 100-card test run log: each failure, its cause, and the fix that went into Provey before the retry.
const RUNS: Array<[string, string, string, Status, string]> = [
  [
    "Second image on hover",
    "Blocked twice. Screenshots are taken with animations stopped, so a fade could never be proven.",
    "Provey now photographs a change while it moves, and judges a frame mid-motion.",
    "done",
    "done, try 3",
  ],
  [
    "Free shipping bar in the cart drawer",
    "Marked done, but the desktop clip opened an empty cart. Shopify had rate-limited the add to cart, and the step still reported success.",
    "The add to cart runs inside the page, retries once, and fails plainly when the cart stays empty.",
    "done",
    "done, try 2",
  ],
  [
    "Sticky add to cart on phones",
    "Blocked on the work cap. The plan blamed the wrong cause: a rule that hides the bar near the footer.",
    "Work caps follow the size of the plan, and a “doesn't work” request is checked by scrolling like a shopper.",
    "done",
    "done, try 3",
  ],
  [
    "Free US shipping over $75",
    "Shopify doesn't let an app change the free shipping rule on that kind of rate.",
    "An honest no: Provey said where to change it in Settings, and charged nothing.",
    "blocked",
    "declined",
  ],
];

const RULES: Array<[string, string]> = [
  ["The live theme is never edited", "Work happens on a hidden copy. Only the files a card changed go live, and only when the merchant clicks Publish."],
  ["Every store change can be undone", "Each Admin API write runs as a dry run, snapshots the old values, then applies. Revert puts them back."],
  ["The price comes first", "Credits are quoted after the plan and before the work."],
  ["Every card ends one way", "Done, partial, blocked, or needs you. A partial card lists what wasn't done."],
  ["One app, nothing else", "Merchants install Provey and nothing more: no second app, no command line, no pasted tokens."],
  ["Any card can be stopped", "While it's planning or working, for nothing."],
];

export default async function ProveyCasePage() {
  const settings = await getSiteSettings();
  const email = settings.email || "rhafaelcorpuz21@gmail.com";

  return (
    <article className="case">
      <JsonLd
        graph={[
          articleSchema({
            headline: "Provey: every Shopify task comes back with proof",
            description: String(metadata.description),
            path: PROVEY_CASE,
            image: "/work/provey.webp",
            about: ["Provey", "Shopify", "AI agent"],
          }),
          breadcrumbSchema([["Home", "/"], ["Work", "/projects"], ["Provey", PROVEY_CASE]]),
        ]}
      />
      <Crumbs current="Provey" />
      <section className="wrap top case-top">
        <div className="top-copy">
          <span className="label fade-up">Case study · My product</span>
          <h1 className="h1">
            <span className="ml">
              <span style={d(80)}>Every task comes back</span>
            </span>
            <span className="ml">
              <span style={d(200)}>
                <em>with proof.</em>
              </span>
            </span>
          </h1>
          <p className="lede fade-up" style={d(380)}>
            Provey is the product I&rsquo;m building. A merchant drops a card on a board inside the Shopify admin, and an
            AI agent plans it, quotes it, does the work on a copy of the theme, and comes back with screenshots, the
            diff, and a preview. Nothing goes live until the merchant publishes.
          </p>
          <div className="fade-up" style={d(500)}>
            <Facts
              rows={[
                ["Product", "Provey, a public Shopify app"],
                ["Role", "Founder: product, design, and the full build"],
                ["Stack", "TypeScript, Shopify Admin GraphQL, Playwright, Hono, SQLite, React Router, Astro"],
                ["Status", "In final testing, launching soon"],
              ]}
            />
          </div>
        </div>
        <CaseSlip receipt={PROVEY_RECEIPT} />
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">The board</span>
            <h2 className="h2">
              Every card shows <em>where it stands.</em>
            </h2>
          </div>
          <p>A quote waiting for approval, a step in progress, a question for the merchant, or the proof.</p>
        </div>
        <figure className="board-shot" data-reveal>
          <Image
            src="/work/provey-board.webp"
            alt="The Provey board: cards in Planning, Awaiting approval, Working, Needs you, and Finished columns, each with its quote, progress, or checks"
            width={1152}
            height={751}
            sizes="(max-width: 1240px) 100vw, 1200px"
          />
          <figcaption>The board, inside the Shopify admin. Credits sit top right; a card waiting on an answer says so at the top.</figcaption>
        </figure>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">How a card runs</span>
            <h2 className="h2">
              Drop a card. <em>Come back to proof.</em>
            </h2>
          </div>
        </div>
        <div className="ends" data-reveal>
          {STEPS.map(([title, body], i) => (
            <div className="end" key={title} style={{ "--i": i } as CSSProperties}>
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              <span className="q">{title}</span>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Honest endings</span>
            <h2 className="h2">
              Not verified, <em>not charged.</em>
            </h2>
          </div>
          <p>Every card ends one of four ways, and each has its own charge. Pick one.</p>
        </div>
        <div data-reveal>
          <CardEndings />
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">The test run</span>
            <h2 className="h2">
              100 cards, <em>run as a merchant.</em>
            </h2>
          </div>
          <p>
            Before launch, I ran 100 real requests on a development store, one at a time. Every failure was written up
            with its cause and fixed in Provey before the card ran again.
          </p>
        </div>
        <div className="results" data-stagger>
          <div className="r" style={{ "--i": 0 } as CSSProperties}>
            <span className="label">Cards finished</span>
            <div className="ft">
              <b>98</b>
              <span className="of">of 100</span>
            </div>
            <p>The other two wait on a store setting only the owner can change.</p>
          </div>
          <div className="r" style={{ "--i": 1 } as CSSProperties}>
            <span className="label">Done on the first try</span>
            <div className="ft">
              <b>58</b>
            </div>
            <p>The rest became fixes, each written up with its cause before the retry.</p>
          </div>
          <div className="r" style={{ "--i": 2 } as CSSProperties}>
            <span className="label">Median card</span>
            <div className="ft">
              <b>8 min</b>
            </div>
            <p>from start to proof, on a card&rsquo;s final run.</p>
          </div>
        </div>
        <div className="ledger findings runs" data-reveal style={{ marginTop: 32 }}>
          <table>
            <thead>
              <tr>
                <th scope="col">Card</th>
                <th scope="col">What happened</th>
                <th scope="col">What changed in Provey</th>
                <th scope="col">Ended</th>
              </tr>
            </thead>
            <tbody>
              {RUNS.map(([card, happened, fix, status, label], i) => (
                <tr key={card} style={{ "--i": i } as CSSProperties}>
                  <td className="c">{card}</td>
                  <td>{happened}</td>
                  <td>{fix}</td>
                  <td>
                    <span className={`st ${STATUS_CLASS[status]}`}>{label}</span>
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
            <span className="label">What Provey never does</span>
            <h2 className="h2">
              The store <em>stays yours.</em>
            </h2>
          </div>
          <p>The same rules run my client work. It&rsquo;s where this site&rsquo;s receipts come from.</p>
        </div>
        <ul className="rules" data-reveal>
          {RULES.map(([rule, why]) => (
            <li key={rule}>
              <b>{rule}</b>
              <span>{why}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap sec">
        <NextCase
          href={MILLINER_CASE}
          label="Next case study"
          title={MILLINER_CLEARED ? "Ford Millinery" : "A Sydney milliner"}
        />
      </section>

      <section className="wrap sec">
        <Closer
          title={
            <>
              Want that kind of care <em>on your store?</em>
            </>
          }
          cta="Start a Shopify project"
          email={email}
        />
      </section>
      <RevealEffects />
    </article>
  );
}
