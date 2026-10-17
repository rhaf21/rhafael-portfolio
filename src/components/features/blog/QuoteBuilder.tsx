"use client";

import { useState } from "react";

// Example products and IDs; a real store's variant IDs come from its catalog.
const PRODUCTS = [
  { title: "Poster display stand", price: 89, variantId: "gid://shopify/ProductVariant/1001" },
  { title: "Lockable display cabinet", price: 249, variantId: "gid://shopify/ProductVariant/1002" },
  { title: "Pavement sign", price: 64, variantId: "gid://shopify/ProductVariant/1003" },
];
const DISCOUNTS = [0, 10, 15];
const STAGES = ["Requested", "Draft order", "Invoice sent", "Paid"];

const money = (n: number) => `£${n.toFixed(2)}`;

/** Build a quote and see the draftOrderCreate input your app would send, and the stages it moves through. */
export function QuoteBuilder() {
  const [qty, setQty] = useState([10, 2, 0]);
  const [discount, setDiscount] = useState(10);
  const [stage, setStage] = useState(1);

  const subtotal = PRODUCTS.reduce((sum, p, i) => sum + p.price * qty[i], 0);
  const total = subtotal * (1 - discount / 100);
  const input = {
    input: {
      email: "buyer@school.example",
      tags: ["quote-request"],
      note: "Trade quote requested from the storefront",
      lineItems: PRODUCTS.flatMap((p, i) => (qty[i] > 0 ? [{ variantId: p.variantId, quantity: qty[i] }] : [])),
      ...(discount > 0 ? { appliedDiscount: { title: "Trade pricing", valueType: "PERCENTAGE", value: discount } } : {}),
    },
  };
  const step = (i: number, d: number) => setQty((q) => q.map((v, n) => (n === i ? Math.max(0, Math.min(99, v + d)) : v)));

  return (
    <div className="quote">
      <div className="quote-build">
        <span className="picker-label">Build a quote</span>
        {PRODUCTS.map((p, i) => (
          <div className="quote-row" key={p.title}>
            <span>
              {p.title}
              <small>{money(p.price)} each</small>
            </span>
            <span className="stepper">
              <button type="button" onClick={() => step(i, -1)} aria-label={`Fewer ${p.title}`}>
                −
              </button>
              <b aria-live="polite">{qty[i]}</b>
              <button type="button" onClick={() => step(i, 1)} aria-label={`More ${p.title}`}>
                +
              </button>
            </span>
          </div>
        ))}
        <div className="quote-row">
          <span>Trade discount</span>
          <span className="quiz-yn" role="group" aria-label="Trade discount">
            {DISCOUNTS.map((d) => (
              <button key={d} type="button" className={discount === d ? "on" : undefined} aria-pressed={discount === d} onClick={() => setDiscount(d)}>
                {d}%
              </button>
            ))}
          </span>
        </div>
        <div className="quote-total">
          <span>Quote total</span>
          <b>{money(total)}</b>
        </div>
        <div className="quote-stages" role="group" aria-label="Quote stage">
          {STAGES.map((s, i) => (
            <button key={s} type="button" className={i <= stage ? "on" : undefined} aria-pressed={i === stage} onClick={() => setStage(i)}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="quote-json">
        <span className="picker-label">draftOrderCreate variables</span>
        <pre>
          <code>{JSON.stringify(input, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
