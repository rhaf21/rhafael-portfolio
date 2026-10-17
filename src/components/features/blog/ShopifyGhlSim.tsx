"use client";

import { useState } from "react";

interface Contact {
  orders: number;
  spent: number;
  tags: string[];
  stage: string;
}

interface SimEvent {
  id: string;
  label: string;
  topic: string;
  apply: (c: Contact, seen: Set<string>) => { contact: Contact; log: string[] };
}

const START: Contact = { orders: 0, spent: 0, tags: [], stage: "No contact yet" };
const withTag = (tags: string[], tag: string) => (tags.includes(tag) ? tags : [...tags, tag]);

// Each order has a fixed id, so sending the same one twice shows the idempotency guard.
const EVENTS: SimEvent[] = [
  {
    id: "order-1001",
    label: "First order, £120",
    topic: "orders/paid",
    apply: (c) => ({
      contact: { orders: c.orders + 1, spent: c.spent + 120, tags: withTag(withTag(c.tags, "customer"), "bought-display-stand"), stage: "Customer" },
      log: ["Verified the webhook signature", "Upserted the contact by email", "Order count and total spent updated", "Tagged: customer, bought-display-stand"],
    }),
  },
  {
    id: "order-1001-again",
    label: "Same order, delivered twice",
    topic: "orders/paid",
    apply: (c, seen) =>
      seen.has("order-1001")
        ? { contact: c, log: ["Order 1001 was already processed", "Skipped: nothing written, no double count"] }
        : { contact: c, log: ["Order 1001 hasn't arrived yet", "Send the first order before its duplicate"] },
  },
  {
    id: "order-1002",
    label: "Repeat order, £340",
    topic: "orders/paid",
    apply: (c) => ({
      contact: { orders: c.orders + 1, spent: c.spent + 340, tags: withTag(c.tags, "repeat-customer"), stage: c.orders + 1 >= 2 ? "Repeat customer" : "Customer" },
      log: ["Verified the webhook signature", "Upserted the contact by email", "Second order: moved to Repeat customer", "Started the GoHighLevel loyalty workflow"],
    }),
  },
  {
    id: "refund-1002",
    label: "Refund on order 1002",
    topic: "refunds/create",
    apply: (c) => ({
      contact: { ...c, spent: Math.max(0, c.spent - 340), tags: withTag(c.tags, "refund-review"), stage: "Refund review" },
      log: ["Verified the webhook signature", "Total spent reduced by £340", "Tagged refund-review and paused the loyalty workflow", "Task created for the account owner"],
    }),
  },
];

/** Send Shopify events through an n8n sync and watch the GoHighLevel contact change. */
export function ShopifyGhlSim() {
  const [contact, setContact] = useState<Contact>(START);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [log, setLog] = useState<string[]>(["Send an event to see what n8n does with it."]);

  const send = (e: SimEvent) => {
    const result = e.apply(contact, seen);
    setContact(result.contact);
    setLog([`${e.topic} received`, ...result.log]);
    if (e.id !== "order-1001-again") setSeen((s) => new Set(s).add(e.id.replace("-again", "")));
  };
  const reset = () => {
    setContact(START);
    setSeen(new Set());
    setLog(["Send an event to see what n8n does with it."]);
  };

  return (
    <div className="sim">
      <div className="sim-events">
        <span className="picker-label">Shopify sends</span>
        {EVENTS.map((e) => (
          <button key={e.id} type="button" onClick={() => send(e)}>
            <span>{e.label}</span>
            <small>{e.topic}</small>
          </button>
        ))}
        <button type="button" className="sim-reset" onClick={reset}>
          Reset
        </button>
      </div>
      <div className="sim-log" aria-live="polite">
        <span className="picker-label">n8n does</span>
        <ol key={log.join("|")}>
          {log.map((line, i) => (
            <li key={line} style={{ "--i": i } as React.CSSProperties}>
              {line}
            </li>
          ))}
        </ol>
      </div>
      <div className="sim-contact">
        <span className="picker-label">GoHighLevel contact</span>
        <b>{contact.stage}</b>
        <dl>
          <dt>Orders</dt>
          <dd>{contact.orders}</dd>
          <dt>Total spent</dt>
          <dd>£{contact.spent}</dd>
          <dt>Tags</dt>
          <dd>{contact.tags.length ? contact.tags.join(", ") : "none"}</dd>
        </dl>
      </div>
    </div>
  );
}
