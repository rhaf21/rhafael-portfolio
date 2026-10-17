"use client";

import { useState } from "react";

// Thresholds from Salesforce's Record-Triggered Automation Decision Guide:
// https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered
const VOLUMES = [
  { label: "UI edits or small loads (up to 200)", level: 0 },
  { label: "Batches that need careful bulkification", level: 1 },
  { label: "Bulk API loads (2,000 to 10,000+)", level: 2 },
];

const RESULTS = [
  { density: "Low", answer: "Record-Triggered Flow", why: "Declarative, bulkified for you, and easy for admins to maintain. Use before-save for same-record field updates." },
  { density: "Medium", answer: "Flow with invocable Apex", why: "Flow orchestrates; Apex handles the complex logic. Invocable actions only run after-save." },
  { density: "High", answer: "Apex trigger framework", why: "One trigger per object, a handler class, explicit bulkification, savepoints, and a guaranteed order." },
];

const level = (n: number, low: number, high: number) => (n > high ? 2 : n >= low ? 1 : 0);

/** Score an object's automation density the way Salesforce's decision guide does. */
export function DensityCalculator() {
  const [count, setCount] = useState(8);
  const [volume, setVolume] = useState(0);
  const [sprawl, setSprawl] = useState(1);

  const levels = [level(count, 15, 30), VOLUMES[volume].level, sprawl >= 5 ? 2 : sprawl >= 2 ? 1 : 0];
  const result = RESULTS[Math.max(...levels)];
  const labels = ["low", "medium", "high"];

  return (
    <div className="quiz density">
      <div className="quiz-q">
        <span className="picker-label">One object, three questions</span>
        <label className="dens-row">
          <span>
            Automations that run on one save: <b>{count}</b>
            <small>{labels[levels[0]]}</small>
          </span>
          <input type="range" min={1} max={45} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </label>
        <div className="dens-row">
          <span>
            Records per transaction
            <small>{labels[levels[1]]}</small>
          </span>
          <div className="dens-opts" role="group" aria-label="Records per transaction">
            {VOLUMES.map((v, i) => (
              <button key={v.label} type="button" className={volume === i ? "on" : undefined} aria-pressed={volume === i} onClick={() => setVolume(i)}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
        <label className="dens-row">
          <span>
            Downstream DML operations one change causes: <b>{sprawl}</b>
            <small>{labels[levels[2]]}</small>
          </span>
          <input type="range" min={0} max={8} value={sprawl} onChange={(e) => setSprawl(Number(e.target.value))} />
        </label>
      </div>
      <div className="quiz-a" aria-live="polite" key={result.answer}>
        <span className="picker-label">{result.density} density</span>
        <b>{result.answer}</b>
        <p>{result.why}</p>
        <ul>
          <li>The highest of the three scores decides.</li>
          <li>Whatever you pick, keep one entry point per object.</li>
        </ul>
      </div>
    </div>
  );
}
