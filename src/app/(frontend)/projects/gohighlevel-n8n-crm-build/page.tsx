import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { RevealEffects } from "@/components/ui/RevealEffects";
import type { CSSProperties } from "react";
import { getSiteSettings } from "@/lib/payload";
import { CaseSlip, Closer, Crumbs, Facts, NextCase } from "@/components/proof/CaseParts";
import { CodePanel } from "@/components/proof/CodePanel";
import { EvidenceChase } from "@/components/proof/EvidenceChase";
import { EXCERPTS, MILLINER_CASE, MILLINER_CLEARED, RECEIPTS } from "@/data/proof";
import "@/styles/case.css";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title: "Case study: a GoHighLevel and n8n CRM rebuild",
  description:
    "How an Australian training provider's leaking GoHighLevel CRM was audited and rebuilt with n8n: round-robin lead owners, 27 duplicate fields merged, and a document chase that unblocked 26 students.",
  path: "/projects/gohighlevel-n8n-crm-build",
  type: "article",
  image: "/og/crm-build.jpg",
});

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

const FINDINGS: Array<[string, string, string, "done" | "partial"]> = [
  ["Custom fields duplicated as mirror copies", "27", "Merged, with tighter access on sensitive fields", "done"],
  ["Contacts stuck in unpublished workflows", "~244", "Surfaced and routed back into live workflows", "done"],
  ["Students stranded by a document chase with a bug", "26", "Chase rebuilt around a live checklist", "done"],
  ["New inquiries with no owner", "all", "Round-robin assignment on arrival", "done"],
  ["Ad spend in the marketing dashboard", "·", "Being wired in", "partial"],
];

const GHL_JOBS: Array<[string, string]> = [
  ["Contacts and custom fields", "crm"],
  ["Pipelines and stages", "crm"],
  ["Calendars and bookings", "crm"],
  ["Two-way shared inbox", "custom channel"],
  ["Embedded marketing dashboard", "token-gated"],
];

const N8N_JOBS: Array<[string, string]> = [
  ["True days-in-stage averages", "calc"],
  ["Live evidence checklist in each email", "render"],
  ["Net profit and amount-due roll-up", "calc"],
  ["Self-refreshing integration tokens", "auth"],
  ["Access-controlled Drive folders", "storage"],
];

export default async function CrmCasePage() {
  const settings = await getSiteSettings();
  const email = settings.email || "rhafaelcorpuz21@gmail.com";
  const receipt = RECEIPTS.find((r) => r.client === "Training provider")!;
  const chaseCode = EXCERPTS.filter((e) => e.key === "n8n");

  return (
    <article className="case">
      <JsonLd
        graph={[
          articleSchema({
            headline: "A leaking CRM, turned into the system it runs on",
            description: String(metadata.description),
            path: "/projects/gohighlevel-n8n-crm-build",
            image: "/work/training-provider.webp",
            about: ["GoHighLevel", "n8n", "CRM automation"],
          }),
          breadcrumbSchema([["Home", "/"], ["Work", "/projects"], ["Training provider", "/projects/gohighlevel-n8n-crm-build"]]),
        ]}
      />
      <Crumbs current="Training provider" />
      <section className="wrap top case-top">
        <div className="top-copy">
          <span className="label fade-up">Case study · CRM automation</span>
          <h1 className="h1">
            <span className="ml">
              <span style={d(80)}>A leaking CRM, turned into</span>
            </span>
            <span className="ml">
              <span style={d(200)}>
                <em>the system it runs on.</em>
              </span>
            </span>
          </h1>
          <p className="lede fade-up" style={d(380)}>
            An Australian registered training organisation had GoHighLevel, but leads landed with no owner, forecasts
            were inflated, and a broken follow-up had stranded students mid-application.
          </p>
          <div className="fade-up" style={d(500)}>
            <Facts
              rows={[
                ["Client", "Registered training organisation, Australia"],
                ["Role", "Audit, architecture, and build"],
                ["Stack", "GoHighLevel, n8n, webhooks, REST API, Node.js"],
              ]}
            />
          </div>
        </div>
        <CaseSlip receipt={receipt} />
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">What the audit found</span>
            <h2 className="h2">
              Counted, <em>then fixed.</em>
            </h2>
          </div>
          <p>Every finding came with a number, so the fix list could be ranked by cost and risk.</p>
        </div>
        <div className="ledger findings" data-reveal>
          <table>
            <thead>
              <tr>
                <th scope="col">Finding</th>
                <th scope="col">Count</th>
                <th scope="col">Fix</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {FINDINGS.map(([finding, count, fix, status], i) => (
                <tr key={finding} style={{ "--i": i } as CSSProperties}>
                  <td>{finding}</td>
                  <td className="num">{count}</td>
                  <td>{fix}</td>
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
            <span className="label">The architecture</span>
            <h2 className="h2">
              GoHighLevel is the front door. <em>n8n runs the logic.</em>
            </h2>
          </div>
        </div>
        <div className="split" data-reveal>
          <div className="side-col" data-stagger>
            <h3>GoHighLevel</h3>
            <span>What the team sees and uses every day</span>
            {GHL_JOBS.map(([job, tag], i) => (
              <div className="job" key={job} style={{ "--i": i } as CSSProperties}>
                {job}
                <i>{tag}</i>
              </div>
            ))}
          </div>
          <div className="side-col" data-stagger>
            <h3>n8n</h3>
            <span>The logic GoHighLevel can&rsquo;t do natively</span>
            {N8N_JOBS.map(([job, tag], i) => (
              <div className="job" key={job} style={{ "--i": i } as CSSProperties}>
                {job}
                <i>{tag}</i>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">The evidence chase</span>
            <h2 className="h2">
              A follow-up that <em>stops on its own.</em>
            </h2>
          </div>
          <p>Each email lists only what&rsquo;s still missing. Press play to watch one example file fill up.</p>
        </div>
        <div data-reveal>
          <EvidenceChase />
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Under the hood</span>
            <h2 className="h2">
              The check that <em>ends the chase.</em>
            </h2>
          </div>
        </div>
        <div data-reveal>
          <CodePanel excerpts={chaseCode} />
        </div>
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
              Want your CRM to <em>run itself?</em>
            </>
          }
          cta="Book a CRM audit"
          email={email}
        />
      </section>
      <RevealEffects />
    </article>
  );
}
