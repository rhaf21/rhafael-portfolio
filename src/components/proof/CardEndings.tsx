"use client";

import { useState } from "react";
import { STATUS_CLASS, type Status } from "@/data/proof";

// One example card: a 6-credit quote with three automated checks.
const QUOTE = 6;
const CHECKS = 3;

interface Ending {
  status: Status;
  label: string;
  happens: string;
  passed: number;
  charged: number;
  rule: string;
}

// Partial charges the share of checks that passed, rounded down (2 of 3 on 6 credits is 4).
const ENDINGS: Ending[] = [
  {
    status: "done",
    label: "done",
    happens: "Every check passed. The merchant sees close-ups of the change and publishes when they're happy.",
    passed: 3,
    charged: QUOTE,
    rule: "Done charges the quote.",
  },
  {
    status: "partial",
    label: "partial",
    happens: "Some of it landed. The card lists exactly what didn't, and why.",
    passed: 2,
    charged: Math.floor((QUOTE * 2) / CHECKS),
    rule: "Partial charges the share of checks that passed, rounded down.",
  },
  {
    status: "blocked",
    label: "blocked",
    happens: "It couldn't be finished. The card says why, and the live theme was never touched.",
    passed: 0,
    charged: 0,
    rule: "Blocked charges nothing.",
  },
  {
    status: "needs input",
    label: "needs you",
    happens: "Only the merchant can supply what's missing, like an image or a choice. The card asks one question.",
    passed: 0,
    charged: 0,
    rule: "Nothing is charged until the merchant answers and approves a new quote.",
  },
];

/** Pick how a card ends; the panel shows what the merchant gets and what Provey charges. */
export function CardEndings() {
  const [pick, setPick] = useState(0);
  const end = ENDINGS[pick];
  const ran = end.status === "done" || end.status === "partial";

  return (
    <div className="demo card-ends">
      <div className="dp">
        <div className="dp-h">
          <span className="label">An example card</span>
          <span className="st input">quote: {QUOTE} credits</span>
        </div>
        <b className="ce-title">Free shipping bar at the top of every page</b>
        <ol className="ce-plan">
          <li>Find the announcement area in the header</li>
          <li>Add the free shipping bar</li>
          <li>Check the home, product, and cart pages</li>
        </ol>
        <span className="label">How it ends</span>
        <div className="toggle ce-pick" role="group" aria-label="How the card ends">
          {ENDINGS.map((e, i) => (
            <button key={e.label} type="button" className={pick === i ? "sel" : undefined} aria-pressed={pick === i} onClick={() => setPick(i)}>
              {e.label}
            </button>
          ))}
        </div>
      </div>
      <div className="ce-out" aria-live="polite" key={end.label}>
        <span className={`st ${STATUS_CLASS[end.status]}`}>{end.label}</span>
        <p>{end.happens}</p>
        <div className="ce-ledger">
          <div>
            <span>Checks passed</span>
            <b>{ran ? `${end.passed} of ${CHECKS}` : "none ran"}</b>
          </div>
          <div>
            <span>Held when approved</span>
            <b>{QUOTE}</b>
          </div>
          <div>
            <span>Charged</span>
            <b>{end.charged}</b>
          </div>
          <div>
            <span>Back to the balance</span>
            <b>{QUOTE - end.charged}</b>
          </div>
        </div>
        <small>{end.rule}</small>
      </div>
    </div>
  );
}
