import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, businessSchema } from "@/lib/schema";
import { RevealEffects } from "@/components/ui/RevealEffects";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getSiteSettings } from "@/lib/payload";
import { ServiceFinder } from "@/components/proof/ServiceFinder";
import { Pricing } from "@/components/proof/Pricing";
import { Ends } from "@/components/proof/Ends";
import { AUDIT_STEPS, SERVICES, SERVICE_QA, TOOLKIT } from "@/data/services";
import "@/styles/services.css";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title: "Services and prices",
  description:
    "Shopify builds, GoHighLevel and Salesforce automation, and n8n, with starting prices up front: a Systems Audit from $750, Shopify Build from $1,500, Automation Build from $3,000.",
  path: "/services",
});

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

export default async function ServicesPage() {
  const settings = await getSiteSettings();
  const email = settings.email || "rhafaelcorpuz21@gmail.com";

  return (
    <div className="services">
      <JsonLd graph={[businessSchema(), breadcrumbSchema([["Home", "/"], ["Services", "/services"]])]} />
      <section className="wrap top svc-top">
        <div className="top-copy">
          <span className="label fade-up">Services</span>
          <h1 className="h1">
            <span className="ml">
              <span style={d(80)}>Four ways in.</span>
            </span>
            <span className="ml">
              <span style={d(200)}>
                <em>Prices up front.</em>
              </span>
            </span>
          </h1>
          <p className="lede fade-up" style={d(380)}>
            Everything runs in your own Shopify and CRM accounts, gets built on a copy, checked, and handed back with a
            receipt.
          </p>
        </div>
        <ServiceFinder services={SERVICES} />
      </section>

      <section className="wrap sec audit-sec">
        <div data-reveal>
          <span className="label">The audit</span>
          <h2 className="h2">
            Five days from access to a <em>ranked fix list.</em>
          </h2>
          <p className="lede">
            You keep the report either way. If you go ahead with the fixes, the fee comes off the build.
          </p>
        </div>
        <div className="audit-slip" data-reveal>
          <div className="slip print-in">
            <div className="s-head">AUDIT RECEIPT</div>
            <div className="s-client">Systems Audit</div>
            <div className="s-meta">FIVE BUSINESS DAYS · FIXED PRICE</div>
            <div className="s-cut" />
            {AUDIT_STEPS.map(([step, day]) => (
              <div className="s-row" key={step}>
                <span>{step}</span>
                <span className="lead" />
                <span>{day}</span>
              </div>
            ))}
            <div className="s-cut" />
            <div className="s-tot">
              <span>You keep</span>
              <b>the report</b>
            </div>
            <div className="s-tot">
              <span>If you build</span>
              <b>fee credited</b>
            </div>
            <span className="stamp">PROOF</span>
          </div>
        </div>
      </section>

      <section className="wrap sec" id="prices">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Prices</span>
            <h2 className="h2">
              What typical jobs <em>come to.</em>
            </h2>
          </div>
          <p>
            Worked examples, so you can place your project before we talk. A fixed quote always follows the audit or a
            scoping call.
          </p>
        </div>
        <Pricing />
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">How a job ends</span>
            <h2 className="h2">One of four states. Never &ldquo;almost done.&rdquo;</h2>
          </div>
          <p>Every task ends with exactly one status, so you always know where your work stands.</p>
        </div>
        <Ends />
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Toolkit</span>
            <h2 className="h2">The tools behind each service.</h2>
          </div>
        </div>
        <div className="tools" data-stagger>
          {TOOLKIT.map((t, n) => (
            <div key={t.name} style={{ "--i": n } as CSSProperties}>
              <h3>{t.name}</h3>
              <p>{t.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Questions</span>
            <h2 className="h2">The small print, up front.</h2>
          </div>
        </div>
        <div className="qa" data-stagger>
          {SERVICE_QA.map((item, n) => (
            <div key={item.q} style={{ "--i": n } as CSSProperties}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <div className="closer" data-reveal>
          <h2 className="h2">
            Not sure which? <em>Start with a call.</em>
          </h2>
          <div className="cta">
            <Link className="btn btn-ink" href="/contact">
              Book a 20-min call <span className="arr">→</span>
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
