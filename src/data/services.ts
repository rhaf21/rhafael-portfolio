// The four services, their scope, and the small print. Prices are drafts from
// the overhaul plan, mirrored in RATES (proof.ts). Confirm before deploying.

export type Lane = "shop" | "crm";

export interface Service {
  id: string;
  name: string;
  tagline: string;
  lanes: Lane[];
  includes: string[];
  timeline: string;
  from: string;
}

export const SERVICES: Service[] = [
  {
    id: "audit",
    name: "Systems Audit",
    tagline: "The entry point",
    lanes: ["shop", "crm"],
    includes: [
      "Every pipeline, field, and workflow, or every template, app, and integration, reviewed",
      "Duplicates, dead stages, and access risks counted",
      "A ranked fix list with a fixed quote, credited if you build",
    ],
    timeline: "3 business days",
    from: "$300",
  },
  {
    id: "shopify",
    name: "Shopify Build",
    tagline: "On the store you have",
    lanes: ["shop"],
    includes: [
      "Quote flows on the Draft Orders API",
      "Product finders and guided selling",
      "Sections, speed, and app clean-up",
    ],
    timeline: "3 days to 2 weeks",
    from: "$600",
  },
  {
    id: "automation",
    name: "Automation Build",
    tagline: "GoHighLevel or Salesforce",
    lanes: ["crm"],
    includes: [
      "Workflows, pipelines, and lead routing rebuilt cleanly",
      "Salesforce Flows, Apex classes, and triggers",
      "n8n for the logic your CRM can’t do, plus dashboards",
    ],
    timeline: "1 to 3 weeks",
    from: "$1,200",
  },
  {
    id: "care",
    name: "Care Plan",
    tagline: "Every month",
    lanes: ["shop", "crm"],
    includes: [
      "Theme and automation upkeep when tools change underneath you",
      "New sections, fixes, and small builds",
      "A short monthly note on what changed",
    ],
    timeline: "Month to month",
    from: "$1,200/mo",
  },
];

export const AUDIT_STEPS: Array<[string, string]> = [
  ["Access and kickoff call", "day 1"],
  ["Structure mapped, counted", "day 1"],
  ["Data flow traced", "day 2"],
  ["Fix list and fixed quote", "day 2"],
  ["Walkthrough call", "day 3"],
];

export const TOOLKIT: Array<{ name: string; detail: string }> = [
  {
    name: "CRM automation",
    detail:
      "GoHighLevel workflows, pipelines, calendars, and conversations. Salesforce Flows, Apex classes, and triggers. n8n, Zapier, Make, webhooks, REST and GraphQL APIs, and dashboards.",
  },
  {
    name: "Shopify",
    detail:
      "Liquid and Online Store 2.0 sections, the Storefront and Admin APIs, the Draft Orders API, Shopify Functions, metafields and metaobjects, Hydrogen when headless earns it.",
  },
  {
    name: "Websites",
    detail:
      "WordPress, WooCommerce, ACF, headless WordPress, Next.js, React, TypeScript, Tailwind, Payload CMS, MongoDB, and Vercel. On request.",
  },
];

export const SERVICE_QA: Array<{ q: string; a: string }> = [
  {
    q: "Are the prices fixed?",
    a: "The audit is. Builds get a fixed quote once the audit or a scoping call defines the work, so you know the number before anything starts.",
  },
  {
    q: "Who owns the work?",
    a: "You do. Everything is built in your Shopify, CRM, and n8n accounts, and you keep every login, workflow, and line of code.",
  },
  {
    q: "What if I only need one small fix?",
    a: "Book a call and describe it. Small, well-defined fixes can be quoted on the spot or folded into a care plan.",
  },
  {
    q: "Do you work in my time zone?",
    a: "I work async across US, UK, and Australian hours and reply within 24 hours. Calls are booked at a time that suits you.",
  },
];
