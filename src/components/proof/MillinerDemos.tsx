"use client";

import { useState, type CSSProperties } from "react";

const FLOWS = {
  before: ["Add to cart", "Pop-up", "View cart", "Cart page", "Checkout"],
  after: ["Add to cart", "Pop-up", "CHECKOUT"],
};

/** Before/after of the cart pop-up: the cart-page detour that recommendation 01 removed. */
export function CartFlowDemo() {
  const [mode, setMode] = useState<"before" | "after">("after");
  const steps = FLOWS[mode];
  const before = mode === "before";

  return (
    <div className="dp">
      <div className="dp-h">
        <h3>The cart pop-up</h3>
        <div className="toggle" role="group" aria-label="Before or after">
          {(["before", "after"] as const).map((m) => (
            <button key={m} type="button" className={mode === m ? "sel" : undefined} aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m === "before" ? "Before" : "After"}
            </button>
          ))}
        </div>
      </div>
      <div className="steps-n">
        <b key={mode}>{steps.length - 1}</b>
        <span>{before ? "clicks, with a detour through the cart page" : "clicks from add-to-cart to paying"}</span>
      </div>
      <div className="cart-flow" aria-live="polite" key={mode}>
        {steps.map((step, i) => {
          const goal = i === steps.length - 1;
          const cut = before && (step === "View cart" || step === "Cart page");
          return (
            <span className="cf-step" key={step} style={{ "--i": i } as CSSProperties}>
              <span className={`chip${goal ? " goal" : ""}${cut ? " cut" : ""}`}>{step}</span>
              {!goal && <span className="arrow" aria-hidden>→</span>}
            </span>
          );
        })}
      </div>
      <span className={`hint${before ? " cutnote" : ""}`}>
        {before
          ? "The cart page was a detour. Recommendation 01 removed it."
          : "Under the button: free returns, and the made-in-Australia claim the client confirmed."}
      </span>
    </div>
  );
}

const COLOURS: Array<{ name: string; bg: string }> = [
  { name: "White", bg: "#f7f5f0" },
  { name: "Black", bg: "#15161a" },
  { name: "Navy", bg: "#1e2a4a" },
  { name: "Blush", bg: "#ebc2c0" },
  { name: "Red", bg: "#b3202e" },
  { name: "Emerald", bg: "#1f6b4f" },
  { name: "Cobalt", bg: "#2747b8" },
  { name: "Camel", bg: "#b58a5a" },
  { name: "Lilac", bg: "#b9a3d6" },
  { name: "Polka dot", bg: "radial-gradient(circle,#ffffff 22%,transparent 24%) 0 0/12px 12px,#15161a" },
  { name: "Cheetah", bg: "radial-gradient(circle,#3a2414 30%,transparent 32%) 0 0/14px 14px,#d9a65a" },
];
const VISIBLE = 7;

/** One card per style: colours sit in a single row with arrows, as the client asked. */
export function SwatchDemo({ styleName }: { styleName: string }) {
  const [c, setC] = useState(0);
  const n = COLOURS.length;
  const start = Math.max(0, Math.min(c - 2, n - VISIBLE));

  return (
    <div className="dp">
      <div className="dp-h">
        <h3>Collection swatches</h3>
        <span className="st rev">in review</span>
      </div>
      <div className="pc-img" aria-hidden>
        <div className="hat" style={{ background: COLOURS[c].bg }} />
      </div>
      <div className="pc-name">
        <b>{styleName}</b>
        <span>
          {COLOURS[c].name} · {c + 1} of {n}
        </span>
      </div>
      <div className="sw-row">
        <button type="button" className="sw-arrow" onClick={() => setC((c - 1 + n) % n)} aria-label="Previous colour">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="sws" role="group" aria-label="Colours">
          {COLOURS.slice(start, start + VISIBLE).map((col, i) => {
            const idx = start + i;
            return (
              <button
                key={col.name}
                type="button"
                className={`sw${idx === c ? " sel" : ""}`}
                style={{ background: col.bg }}
                aria-label={col.name}
                aria-pressed={idx === c}
                onClick={() => setC(idx)}
              />
            );
          })}
        </div>
        <button type="button" className="sw-arrow" onClick={() => setC((c + 1) % n)} aria-label="Next colour">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <p className="small">One card per style, colours in a single row with arrows, as the client asked. Colours shown are illustrative.</p>
    </div>
  );
}
