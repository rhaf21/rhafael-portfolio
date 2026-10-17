// Curated proof for the D · Proof pages: receipts, the ledger, code excerpts,
// prices. Kept in code (not Payload) so a stale DB field can't mask an edit.

/**
 * Ford Millinery hasn't cleared their name or analytics for publishing yet.
 * Flip to true once they say yes: the receipt, ledger, and case study all
 * switch from "Sydney milliner" to the name and the conversion numbers.
 */
export const MILLINER_CLEARED = false;

const milliner = MILLINER_CLEARED ? "Ford Millinery" : "Sydney milliner";

export type Status = "done" | "partial" | "blocked" | "needs input" | "in review" | "ongoing";

export const STATUS_CLASS: Record<Status, string> = {
  done: "done",
  partial: "rev",
  "in review": "rev",
  ongoing: "rev",
  blocked: "blocked",
  "needs input": "input",
};

export interface Receipt {
  tab: string;
  client: string;
  meta: string;
  stamp: string;
  items: Array<[string, string]>;
  totals: Array<[string, string]>;
}

export const RECEIPTS: Receipt[] = [
  {
    tab: milliner,
    client: milliner,
    meta: "SYDNEY · SHOPIFY CRO",
    stamp: "SHIPPED",
    items: [
      ["Cart pop-up to checkout", "done"],
      ["Sizing & Fit for headwear", "done"],
      ["Cross-sells auto-filled", "done"],
      ["Breadcrumbs with schema", "done"],
    ],
    totals: MILLINER_CLEARED
      ? [
          ["Conversion", "0.86% → 0.92%"],
          ["Reached checkout", "1.28% → 1.93%"],
        ]
      : [
          ["Clicks to pay", "4 → 2"],
          ["Fixes shipped", "4 of 4"],
        ],
  },
  {
    tab: "Training provider",
    client: "Training provider",
    meta: "AUSTRALIA · GOHIGHLEVEL + N8N",
    stamp: "SHIPPED",
    items: [
      ["CRM audit", "done"],
      ["Round-robin lead owners", "done"],
      ["Evidence chase rebuilt", "done"],
      ["Dashboard in GoHighLevel", "done"],
    ],
    totals: [
      ["Automations shipped", "12"],
      ["Students unblocked", "26"],
    ],
  },
  {
    tab: "Displaysense",
    client: "Displaysense",
    meta: "UNITED KINGDOM · SHOPIFY",
    stamp: "LIVE",
    items: [
      ["Theme work, 3,500+ products", "ongoing"],
      ["Draft-order quote flow", "done"],
      ["Sector navigation", "done"],
    ],
    totals: [["Trade quotes", "from the store"]],
  },
];

export type Lane = "shop" | "crm" | "web";

export interface LedgerRow {
  client: string;
  href?: string;
  lane: Lane;
  change: string;
  before: string;
  after: string;
  status: Status;
  /** Shown in the shorter ledger on the home page. */
  featured?: boolean;
}

export const MILLINER_CASE = "/projects/shopify-cro-sydney-milliner";
export const CRM_CASE = "/projects/gohighlevel-n8n-crm-build";
export const PROVEY_CASE = "/projects/provey";

/** Provey's own receipt, kept out of RECEIPTS so it doesn't print in the home hero. Numbers from its 100-card test run. */
export const PROVEY_RECEIPT: Receipt = {
  tab: "Provey",
  client: "Provey",
  meta: "MY PRODUCT · SHOPIFY APP",
  stamp: "TESTED",
  items: [
    ["Board in the Shopify admin", "done"],
    ["Proof on every card", "done"],
    ["Revert on every change", "done"],
    ["Merchant launch", "soon"],
  ],
  totals: [
    ["Test cards finished", "98 of 100"],
    ["Median run", "8 min"],
  ],
};

export const LEDGER: LedgerRow[] = [
  { client: milliner, href: MILLINER_CASE, lane: "shop", change: "Cart pop-up to checkout", before: "4 clicks to pay", after: "2 clicks to pay", status: "done", featured: true },
  { client: milliner, href: MILLINER_CASE, lane: "shop", change: "Sizing & Fit for headwear", before: "an old face-mask size chart", after: "S to XL in centimetres", status: "done" },
  {
    client: milliner,
    href: MILLINER_CASE,
    lane: "shop",
    change: "Search that narrows",
    before: MILLINER_CLEARED ? "“fascinator” returned 433 of 471" : "a broad search returned almost the whole catalogue",
    after: "category shortcuts above results",
    status: "done",
    featured: true,
  },
  { client: milliner, href: MILLINER_CASE, lane: "shop", change: "Collection swatches", before: "one card per colour", after: "one card per style", status: "in review", featured: true },
  { client: "Training provider", href: CRM_CASE, lane: "crm", change: "Evidence chase rebuilt", before: "26 students stranded", after: "stops when the file is complete", status: "done", featured: true },
  { client: "Training provider", href: CRM_CASE, lane: "crm", change: "Lead assignment", before: "new leads with no owner", after: "round robin on arrival", status: "done", featured: true },
  { client: "Training provider", href: CRM_CASE, lane: "crm", change: "Custom field clean-up", before: "27 mirror duplicates", after: "merged", status: "done" },
  { client: "Training provider", href: CRM_CASE, lane: "crm", change: "Shared inbox", before: "replies scattered across tools", after: "two-way inbox inside GoHighLevel", status: "done" },
  { client: "Displaysense", href: "/projects/displaysense", lane: "shop", change: "Quote requests", before: "“email us for pricing”", after: "draft-order quote from the store", status: "done", featured: true },
];

export interface WorkItem {
  client: string;
  /** 4:3 thumbnail in /public/work: a live-site capture, or the case study's cover. */
  thumb: string;
  lane: Lane;
  laneLabel: string;
  what: string;
  before?: string;
  after: string;
  href?: string;
}

export const WORK: WorkItem[] = [
  { client: milliner, thumb: "/work/sydney-milliner.webp", lane: "shop", laneLabel: "Shopify CRO", what: "A ten-point CRO audit, built on a live store", before: "4", after: "2 clicks to pay", href: MILLINER_CASE },
  { client: "Training provider", thumb: "/work/training-provider.webp", lane: "crm", laneLabel: "GoHighLevel + n8n", what: "A leaking CRM rebuilt as an operating system", after: "26 students unblocked", href: CRM_CASE },
  { client: "Provey", thumb: "/work/provey.webp", lane: "shop", laneLabel: "My product", what: "An AI agent for Shopify merchants: every task comes back with proof", after: "launching soon", href: PROVEY_CASE },
  { client: "Displaysense", thumb: "/work/displaysense.webp", lane: "shop", laneLabel: "Shopify", what: "Theme work on 3,500+ products, quote flow for trade buyers", before: "email for pricing", after: "quote from the store", href: "/projects/displaysense" },
  { client: "Opera Beds", thumb: "/work/opera-beds.webp", lane: "shop", laneLabel: "Shopify", what: "Product finder and finance tooling in the storefront", after: "guided choice", href: "/projects/opera-beds" },
  { client: "Cherries Official", thumb: "/work/cherries-official.webp", lane: "shop", laneLabel: "Shopify", what: "Storefront for a scent-infused phone case brand", after: "full storefront", href: "/projects/cherries-official" },
  { client: "Side Routes", thumb: "/work/side-routes.webp", lane: "web", laneLabel: "WordPress", what: "Tour company site for slow travel across European cities", after: "live site" },
  { client: "Carpe Diem Tours", thumb: "/work/carpe-diem-tours.webp", lane: "web", laneLabel: "Next.js", what: "Experiential tours across Italy and Europe, built in Next.js", after: "live site" },
];

export const LANES: Array<{ id: Lane | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "shop", label: "Shopify" },
  { id: "crm", label: "CRM automation" },
  { id: "web", label: "Websites" },
];

export interface CodeExcerpt {
  key: string;
  label: string;
  file: string;
  /** [kind, text, marker]: kind "c" renders as a comment line. */
  lines: Array<[string, string, number?]>;
  notes: Array<[string, string]>;
  flow?: string[];
}

export const EXCERPTS: CodeExcerpt[] = [
  {
    key: "liquid",
    label: "Shopify · Liquid",
    file: "snippets/style-card.liquid",
    lines: [
      ["c", "{%- comment -%} One card per style, colours as swatches {%- endcomment -%}"],
      ["", "{%- assign style = product.metafields.custom.style.value -%}", 1],
      ["", '<div class="style-card" data-style="{{ style.handle }}">'],
      ["", "  {%- for colour in style.colours.value -%}"],
      ["", '    <a class="swatch" href="{{ colour.product.value.url }}"', 2],
      ["", '       style="--swatch: {{ colour.hex }}"'],
      ["", '       aria-label="{{ colour.name }}"></a>', 3],
      ["", "  {%- endfor -%}"],
      ["", "</div>"],
    ],
    notes: [
      ["1", "Styles live in a metaobject, so a hat sold in dozens of colours becomes one card instead of dozens."],
      ["2", "Every swatch is a real link, so Google still reaches and ranks each colour page."],
      ["3", "Screen readers hear the colour name, not “link”."],
    ],
  },
  {
    key: "n8n",
    label: "n8n · Code node",
    file: "n8n: evidence chase · code node",
    lines: [
      ["c", "// What is still missing from this student’s file?"],
      ["", "const required = $json.course.requiredDocuments;"],
      ["", "const received = $json.contact.documents;"],
      ["", "const missing = required.filter((d) => !received.includes(d));", 1],
      ["", ""],
      ["", "return [{", 2],
      ["", "  json: { missing, complete: missing.length === 0 },"],
      ["", "}];"],
    ],
    notes: [
      ["1", "The checklist is worked out per student, so every email lists only what is still missing."],
      ["2", "When complete is true, the chase stops on its own. The old one never stopped, which is how 26 students got stranded."],
    ],
    flow: ["upload received", "get contact", "what’s missing?", "complete: stop chase", "else: email checklist"],
  },
  {
    key: "apex",
    label: "Salesforce · Apex",
    file: "triggers/RenewalTrigger.trigger",
    lines: [
      ["", "trigger RenewalTrigger on Contract (after update) {", 1],
      ["", "  RenewalHandler.queueReminders(Trigger.new, Trigger.oldMap);"],
      ["", "}"],
      ["", ""],
      ["", "public with sharing class RenewalHandler {"],
      ["", "  public static void queueReminders(List<Contract> rows, Map<Id, Contract> old) {"],
      ["", "    List<Task> tasks = new List<Task>();"],
      ["", "    for (Contract c : rows) {"],
      ["", "      if (c.EndDate != old.get(c.Id).EndDate) {"],
      ["", "        tasks.add(new Task(WhatId = c.Id, Subject = 'Renewal reminder'));"],
      ["", "      }"],
      ["", "    }"],
      ["", "    insert tasks;", 2],
      ["", "  }"],
      ["", "}"],
    ],
    notes: [
      ["1", "The trigger stays one line. Logic lives in a handler class that can be tested on its own."],
      ["2", "One insert for the whole batch, so a data import of thousands of contracts can’t hit Salesforce limits."],
    ],
  },
];

export const ENDS: Array<{ status: Status; label: string; q: string; p: string }> = [
  { status: "done", label: "done", q: "Shipped and checked.", p: "Before and after, the diff, and a preview link." },
  { status: "partial", label: "partial", q: "Some of it, listed.", p: "What shipped, what didn’t, and what’s needed to finish." },
  { status: "blocked", label: "blocked", q: "Can’t be done as asked.", p: "The reason, plus the closest workable alternative." },
  { status: "needs input", label: "needs input", q: "Waiting on you.", p: "One clear question, so nothing stalls silently." },
];

// Draft prices from the overhaul plan. Confirm before deploying.
export const RATES: Array<{ name: string; price: string; note: string; href: string }> = [
  { name: "Systems Audit", price: "from $750", note: "Five business days, a ranked fix list. Credited if you build.", href: "/services#audit" },
  { name: "Shopify Build", price: "from $1,500", note: "Quote flows, product finders, sections, speed.", href: "/services#shopify" },
  { name: "Automation Build", price: "from $3,000", note: "GoHighLevel or Salesforce, with n8n.", href: "/services#automation" },
  { name: "Care Plan", price: "from $1,200 / mo", note: "Upkeep, changes, and fixes every month.", href: "/services#care" },
];

export const EXAMPLES: Array<{ t: string; r: string; p: string }> = [
  { t: "A quote request flow on an existing Shopify store", r: "$1,500 to $3,000", p: "Draft Orders API, a trade-buyer form, and admin notifications. One to two weeks." },
  { t: "Cleaning up a GoHighLevel account", r: "$750 + $3,000 to $5,000", p: "The audit, then duplicate fields merged, lead routing fixed, and follow-ups rebuilt." },
  { t: "A Salesforce Flow with an Apex trigger", r: "$2,000 to $4,000", p: "Declarative where it can be, Apex where volume or logic needs it, with tests." },
];
