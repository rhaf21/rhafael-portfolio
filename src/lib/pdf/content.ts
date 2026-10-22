// What the resume says, kept short on purpose: one line per client, a number where the site has one.
// Prices, timelines, case-study links, and the milliner's name come from the site's data files, so the
// PDF follows the site on the next deploy. The wording is written for the page, not copied from it.

import { CRM_CASE, MILLINER_CASE, MILLINER_NAME, PROVEY_CASE, type Status } from "@/data/proof";
import { SERVICES } from "@/data/services";

/** Until LinkedIn is added to the CMS's social links, the resume links the profile directly. */
export const LINKEDIN_FALLBACK = "https://www.linkedin.com/in/rhafael-corpuz-3aa7a327a/";

export const LEDE = "GoHighLevel, Salesforce, and n8n. Clients in the US, UK, and Australia.";

/** The page one receipt. Each number is one the site already shows. */
export const RESULTS: Array<[string, string]> = [
  ["Clicks to pay", "4 → 2"],
  ["Students unblocked", "26"],
  ["Automations shipped", "12"],
  ["Products themed", "3,500+"],
  ["Provey test runs", "98/100"],
];

export interface Role {
  when: string;
  org: string;
  title: string;
  /** [client, what changed], one line each. */
  points?: Array<[string, string]>;
  line?: string;
}

export const EXPERIENCE: Role[] = [
  {
    when: "2020 to now",
    org: "Independent",
    title: "Shopify and CRM automation",
    points: [
      ["Displaysense, UK", "3,500+ product theme, quote flow"],
      [MILLINER_NAME, "CRO fixes, clicks to pay 4 → 2"],
      ["Opera Beds, UK", "product finder and finance tooling"],
      ["Training provider, AU", "CRM rebuilt, 12 automations"],
      ["Salesforce", "Flows, Apex classes, triggers"],
    ],
  },
  { when: "Present", org: "CreateCircus", title: "Senior Developer", line: "Interactive web experiences, frontend architecture" },
  { when: "2024 to 2025", org: "Carpe Diem Tours", title: "Full Stack Developer", line: "Booking and tour platform, React and Node.js" },
];

export const PRODUCTS: Array<{ name: string; status: string; tone: Status; line: string; href: string }> = [
  { name: "Provey", status: "Soon", tone: "in review", line: "AI agent for Shopify work, with proof of every change", href: PROVEY_CASE },
  { name: "BoardGameTally", status: "Live", tone: "done", line: "Board game scoring app. Next.js, MongoDB, Ably", href: "https://boardgametally.com" },
];

export const SKILLS: Array<[string, string]> = [
  ["Shopify", "Liquid, OS 2.0 sections, Admin and Storefront APIs, Draft Orders, Functions, metaobjects"],
  ["CRM automation", "GoHighLevel, Salesforce Flow and Apex, n8n, Zapier, Make, webhooks"],
  ["Web", "Next.js, React, TypeScript, WordPress, Payload, MongoDB, Vercel"],
  ["Languages", "TypeScript, JavaScript, Liquid, Apex, PHP, Python, Dart"],
];

export const HOW_I_WORK = ["Your accounts, your code", "Numbers over adjectives", "The live store is sacred", "One clear status per job"];

export interface ResumeReceipt {
  client: string;
  meta: string;
  stamp: string;
  items: Array<[string, string]>;
  total: [string, string];
  href: string;
}

/** The site's receipts, with line items shortened so three fit across the page. */
export const RECEIPTS: ResumeReceipt[] = [
  {
    client: MILLINER_NAME,
    meta: "SHOPIFY CRO",
    stamp: "SHIPPED",
    items: [
      ["Cart to checkout", "done"],
      ["Sizing & Fit", "done"],
      ["Cross-sells", "done"],
      ["Breadcrumbs", "done"],
    ],
    total: ["Clicks to pay", "4 → 2"],
    href: MILLINER_CASE,
  },
  {
    client: "Training provider",
    meta: "GOHIGHLEVEL + N8N",
    stamp: "SHIPPED",
    items: [
      ["CRM audit", "done"],
      ["Round-robin leads", "done"],
      ["Evidence chase", "done"],
      ["Dashboard", "done"],
    ],
    total: ["Students unblocked", "26"],
    href: CRM_CASE,
  },
  {
    client: "Displaysense",
    meta: "SHOPIFY · 3,500+ PRODUCTS",
    stamp: "LIVE",
    items: [
      ["Theme work", "ongoing"],
      ["Quote flow", "done"],
      ["Sector navigation", "done"],
    ],
    total: ["Trade quotes", "from the store"],
    href: "/projects/displaysense",
  },
];

/** Selected rows from the site's ledger, in short form. */
export const CHANGES: Array<{ client: string; change: string; before: string; after: string; status: Status }> = [
  { client: MILLINER_NAME, change: "Cart to checkout", before: "4 clicks to pay", after: "2 clicks to pay", status: "done" },
  { client: MILLINER_NAME, change: "Search that narrows", before: "most of the catalogue", after: "category shortcuts", status: "done" },
  { client: "Training provider", change: "Evidence chase", before: "26 students stranded", after: "stops when complete", status: "done" },
  { client: "Training provider", change: "Lead assignment", before: "no owner", after: "round robin", status: "done" },
  { client: "Training provider", change: "Custom fields", before: "27 duplicates", after: "merged", status: "done" },
  { client: "Displaysense", change: "Quote requests", before: "email for pricing", after: "quote from the store", status: "done" },
];

/** One short line per service; the price and timeline come from SERVICES. */
const SERVICE_LINES: Record<string, string> = {
  audit: "Ranked fix list, credited if you build",
  shopify: "Quote flows, product finders, sections, speed",
  automation: "GoHighLevel or Salesforce, with n8n",
  care: "Upkeep, changes, and fixes",
};

export const RATE_ROWS = SERVICES.map((svc) => ({
  name: svc.name,
  line: SERVICE_LINES[svc.id] ?? svc.tagline,
  timeline: svc.timeline,
  price: `from ${svc.from}`,
}));
