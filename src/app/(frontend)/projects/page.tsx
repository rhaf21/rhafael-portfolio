import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { RevealEffects } from "@/components/ui/RevealEffects";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getSiteSettings } from "@/lib/payload";
import { Ledger } from "@/components/proof/Ledger";
import { LANES, LEDGER, WORK } from "@/data/proof";
import "@/styles/work.css";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title: "Work and case studies",
  description:
    "Shopify and CRM automation projects for businesses in the US, UK, and Australia, each with what changed and a link to the write-up.",
  path: "/projects",
});

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function countLabel(n: number) {
  return `${n} ${n === 1 ? "project" : "projects"}`;
}

export default async function WorkPage() {
  const settings = await getSiteSettings();
  const email = settings.email || "rhafaelcorpuz21@gmail.com";

  return (
    <div className="work">
      <section className="wrap top">
        <div className="top-copy">
          <span className="label fade-up">Work</span>
          <h1 className="h1">
            <span className="ml">
              <span style={d(80)}>Every project,</span>
            </span>
            <span className="ml">
              <span style={d(200)}>
                <em>with the receipt.</em>
              </span>
            </span>
          </h1>
          <p className="lede fade-up" style={d(380)}>
            Shopify stores and CRM systems for established businesses in the US, UK, and Australia. Each row says what
            changed and links to the write-up.
          </p>
        </div>
        <div className="facts fade-up" style={d(500)}>
          <div className="fact">
            <span>Lanes</span>
            <span>Shopify · CRM automation</span>
          </div>
          <div className="fact">
            <span>Clients in</span>
            <span>US, UK, Australia</span>
          </div>
          <div className="fact">
            <span>Also</span>
            <span>Websites on request</span>
          </div>
        </div>
      </section>

      <section className="wrap">
        {/* Native radios + :has() filter both tables with no JavaScript. */}
        <fieldset className="filters fade-up" style={d(600)}>
          <legend className="sr-only">Filter projects</legend>
          {LANES.map((lane) => (
            <label key={lane.id}>
              <input
                className="sr-only"
                type="radio"
                name="lane"
                id={`lane-${lane.id}`}
                value={lane.id}
                defaultChecked={lane.id === "all"}
              />
              <span>{lane.label}</span>
            </label>
          ))}
          <span className="count mono">
            {LANES.map((lane) => (
              <span key={lane.id} className={`c-${lane.id}`}>
                {countLabel(lane.id === "all" ? WORK.length : WORK.filter((w) => w.lane === lane.id).length)}
              </span>
            ))}
          </span>
        </fieldset>
        <div className="ledger work-ledger" data-reveal>
          <table>
            <thead>
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Lane</th>
                <th scope="col">What changed</th>
                <th scope="col">Headline</th>
                <th scope="col">
                  <span className="sr-only">Write-up</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {WORK.map((w, i) => (
                <tr key={w.client} data-lane={w.lane} style={{ "--i": i } as CSSProperties}>
                  <td className="c">
                    <span className="wk">
                      <span className="wk-thumb">
                        <Image src={w.thumb} alt={`${w.client}, ${w.laneLabel} project`} width={800} height={600} sizes="200px" />
                      </span>
                      {w.href ? <Link href={w.href}>{w.client}</Link> : w.client}
                    </span>
                  </td>
                  <td className="mono lane">{w.laneLabel}</td>
                  <td>{w.what}</td>
                  <td>
                    {w.before && (
                      <>
                        <span className="strike">{w.before}</span>{" "}
                      </>
                    )}
                    <span className="now">{w.after}</span>
                  </td>
                  <td>
                    {w.href ? (
                      <Link className="read" href={w.href} aria-label={`Read the ${w.client} write-up`}>
                        Read <Arrow />
                      </Link>
                    ) : (
                      <span className="soon">write-up soon</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap sec full-ledger">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Shipped</span>
            <h2 className="h2">The full ledger.</h2>
          </div>
          <p>Individual changes across every client, with the before and after I could check.</p>
        </div>
        <Ledger rows={LEDGER} />
      </section>

      <section className="wrap sec">
        <Link className="next" href="/side-projects" data-reveal>
          <span>
            <span className="label">Off the clock</span>
            <br />
            <b>BoardGameTally</b>
          </span>
          <span className="next-note">A free app for my game group, and yours.</span>
          <Arrow />
        </Link>
      </section>

      <section className="wrap sec">
        <div className="closer" data-reveal>
          <h2 className="h2">
            Want your store or CRM <em>in this ledger?</em>
          </h2>
          <div className="cta">
            <Link className="btn btn-ink" href="/contact">
              Book a call <span className="arr">→</span>
            </Link>
            <a className="btn btn-line" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
      </section>
      <RevealEffects />
    </div>
  );
}
