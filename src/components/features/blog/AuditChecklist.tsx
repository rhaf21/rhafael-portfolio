"use client";

import { useState } from "react";

interface Check {
  area: string;
  item: string;
  weight: number;
}

// Weight is how much damage the gap does when it's missing: 3 loses leads or money, 1 is housekeeping.
const CHECKS: Check[] = [
  { area: "Leads", item: "Every new lead gets an owner the moment it arrives", weight: 3 },
  { area: "Leads", item: "Someone responds to new inquiries within an hour", weight: 3 },
  { area: "Workflows", item: "No contacts are sitting in draft or unpublished workflows", weight: 3 },
  { area: "Workflows", item: "Every follow-up sequence has a goal or exit that stops it", weight: 3 },
  { area: "Workflows", item: "Re-entry is set on purpose, not left at the default", weight: 2 },
  { area: "Data", item: "No duplicate or mirror custom fields", weight: 2 },
  { area: "Data", item: "Money fields are number fields, not text", weight: 2 },
  { area: "Data", item: "Duplicate contacts are prevented or merged", weight: 2 },
  { area: "Pipelines", item: "Stale opportunities are closed, so forecasts are real", weight: 2 },
  { area: "Pipelines", item: "Every stage is used and has a clear exit rule", weight: 1 },
  { area: "Sending", item: "Email sends from your own authenticated domain", weight: 2 },
  { area: "Sending", item: "SMS registration is done for the countries you text", weight: 2 },
  { area: "Access", item: "Former staff and unused API keys are removed", weight: 2 },
  { area: "Access", item: "Sensitive documents aren't stored in open notes or links", weight: 2 },
  { area: "Reporting", item: "Dashboards match what the team actually tracks", weight: 1 },
];

const TOTAL = CHECKS.reduce((sum, c) => sum + c.weight, 0);

/** The GoHighLevel audit as a self-check: tick what's in place, see the score and the biggest gaps left. */
export function AuditChecklist() {
  const [done, setDone] = useState<boolean[]>(CHECKS.map(() => false));
  const toggle = (i: number) => setDone((d) => d.map((v, n) => (n === i ? !v : v)));

  const score = Math.round((CHECKS.reduce((sum, c, i) => sum + (done[i] ? c.weight : 0), 0) / TOTAL) * 100);
  const gaps = CHECKS.map((c, i) => ({ ...c, i }))
    .filter((c) => !done[c.i])
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);
  const areas = [...new Set(CHECKS.map((c) => c.area))];

  return (
    <div className="audit-check">
      <div className="ac-list">
        {areas.map((area) => (
          <fieldset key={area}>
            <legend className="picker-label">{area}</legend>
            {CHECKS.map((c, i) =>
              c.area === area ? (
                <label key={c.item} className={done[i] ? "on" : undefined}>
                  <input type="checkbox" checked={done[i]} onChange={() => toggle(i)} />
                  <span>{c.item}</span>
                </label>
              ) : null
            )}
          </fieldset>
        ))}
      </div>
      <div className="ac-score" aria-live="polite">
        <span className="picker-label">Account health</span>
        <b>{score}%</b>
        <div className="ac-bar" aria-hidden>
          <span style={{ width: `${score}%` }} />
        </div>
        <span className="picker-label">Biggest gaps left</span>
        {gaps.length > 0 ? (
          <ol>
            {gaps.map((g) => (
              <li key={g.item}>{g.item}</li>
            ))}
          </ol>
        ) : (
          <p>Nothing left on this list. Book a second opinion anyway.</p>
        )}
      </div>
    </div>
  );
}
