import { getPayload } from "payload";
import dns from "node:dns";
import config from "../payload.config";

// Some resolvers refuse SRV lookups, which breaks the MongoDB Atlas
// connection string. Force public DNS so `seed:projects` can resolve it
// (matches seed-content.ts).
dns.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1", "8.8.4.4"]);

// ─────────────────────────────────────────────────────────────
// Minimal Lexical rich-text builder for longDescription fields.
// The frontend extracts plain text from this (see extractTextFromLexical
// in lib/payload.ts), so a flat list of paragraphs is all we need.
// ─────────────────────────────────────────────────────────────
const BASE = { format: "", indent: 0, version: 1, direction: "ltr" } as const;

function paragraph(text: string) {
  return {
    type: "paragraph",
    children: [
      {
        type: "text",
        text,
        format: 0,
        detail: 0,
        mode: "normal",
        style: "",
        version: 1,
      },
    ],
    textFormat: 0,
    textStyle: "",
    ...BASE,
  };
}

function richText(paragraphs: string[]) {
  return {
    root: {
      type: "root",
      children: paragraphs.map(paragraph),
      ...BASE,
    },
  };
}

const projects = [
  {
    title: "Cherries Official",
    slug: "cherries-official",
    description:
      "Premium lifestyle brand e-commerce store specializing in scent-infused phone cases and mobile accessories with a bold, playful aesthetic.",
    category: "shopify" as const,
    techStack: [
      { tech: "shopify" },
      { tech: "liquid" },
      { tech: "javascript" },
      { tech: "css" },
    ],
    liveUrl: "https://cherriesofficial.com/",
    featured: true,
    completedAt: "2024-06-01",
  },
  {
    title: "Side Routes",
    slug: "side-routes",
    description:
      "Travel tour company website offering curated walking tours, food experiences, and cultural activities across European cities with a focus on slow, soulful travel.",
    category: "wordpress" as const,
    techStack: [
      { tech: "wordpress" },
      { tech: "php" },
      { tech: "css" },
      { tech: "javascript" },
    ],
    liveUrl: "https://sideroutes.com/",
    featured: true,
    completedAt: "2024-08-15",
  },
  {
    title: "Carpe Diem Tours",
    slug: "carpe-diem-tours",
    description:
      "Experiential travel company platform featuring guided tours and immersive activities throughout Italy and Europe, built with modern web technologies.",
    category: "react" as const,
    techStack: [
      { tech: "nextjs" },
      { tech: "typescript" },
      { tech: "tailwind" },
      { tech: "react" },
    ],
    liveUrl: "https://carpediemtours.com/",
    featured: true,
    completedAt: "2024-11-01",
  },
  {
    title: "GoHighLevel + n8n CRM Build",
    slug: "gohighlevel-n8n-crm-build",
    description:
      "A GoHighLevel and n8n build that turned a busy CRM into the operating system for a Recognition of Prior Learning enrolment business, with the audit, the automation, and the reporting finally in one place.",
    category: "automation" as const,
    techStack: [
      { tech: "GoHighLevel" },
      { tech: "n8n" },
      { tech: "Vercel" },
      { tech: "nodejs" },
      { tech: "Webhooks" },
      { tech: "rest-api" },
    ],
    longDescription: richText([
      "An Australian registered training organisation (RTO) already ran GoHighLevel, but it was working against them: new leads landed with no owner, forecasts were inflated by broken win-probabilities on dead pipeline stages, and a missing-documents follow-up had quietly stranded students mid-application. The brief was to turn a busy, leaking CRM into a system the whole business could actually run on.",
      "The build began with a full audit of every pipeline, custom field, and workflow, then drew a clean line through the architecture. GoHighLevel stays the front door for contacts, pipelines, calendars, and messaging, while n8n runs the logic GHL cannot do natively: averaging days-in-stage, rendering a live checklist inside an email, rolling up profit across several money fields, and keeping integration tokens fresh.",
      "The result is twelve single-purpose automations, a two-way shared inbox inside GHL, a self-refreshing token broker, a personalised evidence-chase engine that cannot strand a student the way the old one did, and a bespoke, token-gated marketing dashboard embedded back into GoHighLevel that surfaces the cross-system numbers GHL is blind to (traffic, revenue, and true days-in-stage, with paid-ad-spend still being wired in).",
    ]),
    highlights: [
      {
        highlight:
          "Full CRM audit surfacing inflated forecasts, 27 mirror-duplicated fields, sensitive fields that needed tighter access control, and around 244 contacts stranded in unpublished workflows",
      },
      {
        highlight:
          "Closed a lead-assignment gap so every new inquiry is auto-assigned round-robin and never sits unowned",
      },
      {
        highlight:
          "Rebuilt the missing-documents chase with a live, personalised evidence checklist that stops the moment a file is complete, fixing the bug that had stranded 26 students",
      },
      {
        highlight:
          "Two-way shared inbox inside GHL using a billing-safe custom-channel technique routed through n8n",
      },
      {
        highlight:
          "Self-refreshing token broker that keeps the shared inbox authenticated with no manual re-paste",
      },
      {
        highlight:
          "Auto-provisioned, access-controlled Google Drive folders so identity documents never sit in open storage",
      },
      {
        highlight:
          "Accounting calculator that rolls up net profit and amount due, writing back only when a value actually changed",
      },
      {
        highlight:
          "Bespoke marketing dashboard embedded in GHL, surfacing traffic, revenue, and true days-in-stage",
      },
    ],
    featured: true,
    completedAt: "2026-06-29",
  },
];

async function seed() {
  console.log("Starting project seed...");

  const payload = await getPayload({ config });

  for (const project of projects) {
    // Check if project already exists
    const existing = await payload.find({
      collection: "projects",
      where: {
        slug: { equals: project.slug },
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      // Update in place so re-running the seed refreshes copy/case-study fields.
      await payload.update({
        collection: "projects",
        id: existing.docs[0].id,
        data: project,
      });
      console.log(`Updated project: ${project.title}`);
      continue;
    }

    // Create the project
    await payload.create({
      collection: "projects",
      data: project,
    });

    console.log(`Created project: ${project.title}`);
  }

  console.log("Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
