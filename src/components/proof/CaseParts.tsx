import Link from "next/link";
import type { ReactNode } from "react";
import type { Receipt } from "@/data/proof";
import { Odometer } from "./Odometer";

export function Crumbs({ current }: { current: string }) {
  return (
    <nav className="wrap crumbs mono" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span aria-hidden>/</span>
      <Link href="/projects">Work</Link>
      <span aria-hidden>/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

/** A single receipt that prints in as the page loads, totals rolling, stamp last. */
export function CaseSlip({ receipt }: { receipt: Receipt }) {
  return (
    <div className="case-slip">
      <div className="slip print-load">
        <div className="s-head">SHIPPING RECEIPT</div>
        <div className="s-client">{receipt.client}</div>
        <div className="s-meta">{receipt.meta}</div>
        <div className="s-cut" />
        {receipt.items.map(([item, state]) => (
          <div className="s-row" key={item}>
            <span>{item}</span>
            <span className="lead" />
            <span>{state}</span>
          </div>
        ))}
        <div className="s-cut" />
        {receipt.totals.map(([k, v]) => (
          <div className="s-tot" key={k}>
            <span>{k}</span>
            <b>
              <Odometer value={v} delay={1200} />
            </b>
          </div>
        ))}
        <span className="stamp">{receipt.stamp}</span>
      </div>
    </div>
  );
}

export function Facts({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <div className="facts">
      {rows.map(([k, v]) => (
        <div className="fact" key={k}>
          <span>{k}</span>
          <span>{v}</span>
        </div>
      ))}
    </div>
  );
}

export function NextCase({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <Link className="next" href={href} data-reveal>
      <span>
        <span className="label">{label}</span>
        <br />
        <b>{title}</b>
      </span>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

export function Closer({ title, cta, email }: { title: ReactNode; cta: string; email: string }) {
  return (
    <div className="closer" data-reveal>
      <h2 className="h2">{title}</h2>
      <div className="cta">
        <Link className="btn btn-ink" href="/contact">
          {cta} <span className="arr">→</span>
        </Link>
        <a className="btn btn-line" href={`mailto:${email}`}>
          {email}
        </a>
      </div>
    </div>
  );
}
