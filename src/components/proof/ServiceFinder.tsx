"use client";

import { useState } from "react";
import type { Lane, Service } from "@/data/services";

type Fit = Lane | "both";

const NOTES: Record<Fit, string> = {
  shop: "Highlighted: the audit, Shopify Build, and the Care Plan.",
  crm: "Highlighted: the audit, Automation Build, and the Care Plan.",
  both: "Most clients have both. Every service applies.",
};

const CHOICES: Array<[Fit, string]> = [
  ["shop", "A Shopify store"],
  ["crm", "A CRM"],
  ["both", "Both"],
];

/** The services table with a "what are you working with?" filter that dims rows that don't apply. */
export function ServiceFinder({ services }: { services: Service[] }) {
  const [fit, setFit] = useState<Fit>("both");
  const rowClass = (s: Service) => (fit === "both" ? undefined : s.lanes.includes(fit) ? "match" : "dim");

  return (
    <>
      <div className="fit fade-up" style={{ "--d": 400 } as React.CSSProperties}>
        <span className="label">What are you working with?</span>
        <div className="seg" role="group" aria-label="Highlight services">
          {CHOICES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={fit === value ? "sel" : undefined}
              aria-pressed={fit === value}
              onClick={() => setFit(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="fit-note" aria-live="polite">
          {NOTES[fit]}
        </span>
      </div>
      <div className="svc-table">
        <div className="ledger svc-ledger">
          <table>
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">What you get</th>
                <th scope="col">Timeline</th>
                <th scope="col">From</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={s.id} id={s.id} className={rowClass(s)} style={{ "--i": i } as React.CSSProperties}>
                  <th scope="row" className="svc">
                    <b>{s.name}</b>
                    <span>{s.tagline}</span>
                  </th>
                  <td>
                    <ul>
                      {s.includes.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="mono">{s.timeline}</td>
                  <td className="num">{s.from}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="svc-foot mono">Prices in USD. WordPress and Next.js builds on request.</p>
      </div>
    </>
  );
}
