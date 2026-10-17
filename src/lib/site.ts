import type { Metadata } from "next";

// One source for the canonical host and who the site is about. The apex
// domain currently redirects to www, so www is the canonical default; set
// NEXT_PUBLIC_SITE_URL if the primary domain changes in Vercel.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.rhafael.dev").replace(/\/$/, "");

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const PERSON = {
  name: "Rhafael Corpuz",
  jobTitle: "Shopify developer and CRM automation specialist",
  description:
    "Rhafael Corpuz builds Shopify stores and the CRM automation behind them, in GoHighLevel, Salesforce, and n8n, for established businesses in the US, UK, and Australia. Every change ships with a receipt: what changed and what it did.",
  areaServed: ["United States", "United Kingdom", "Australia"],
  knowsAbout: [
    "Shopify",
    "Shopify theme development",
    "Liquid",
    "Shopify Draft Orders API",
    "Shopify Storefront API",
    "Shopify Admin API",
    "Conversion rate optimization",
    "GoHighLevel",
    "GoHighLevel workflows",
    "Salesforce",
    "Salesforce Flow",
    "Apex",
    "Apex triggers",
    "n8n",
    "Zapier",
    "Make",
    "CRM automation",
    "Marketing automation",
    "Webhooks",
    "REST APIs",
    "GraphQL",
    "Next.js",
    "React",
    "TypeScript",
    "WordPress",
    "WooCommerce",
    "Payload CMS",
  ],
};

export const SITE_TITLE = `${PERSON.name} · Shopify developer and CRM automation`;
export const OG_IMAGE = "/og/rhafael-dev.png";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}

/**
 * Per-page metadata. A page's openGraph replaces the layout's wholesale in
 * Next.js, so every page sets its own title, description, URL, and image here.
 */
export function pageMeta({ title, description, path, type = "website" }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: PERSON.name,
      title,
      description,
      url: path,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Rhafael Corpuz. Work you can check." }],
      ...(type === "article" ? { authors: [PERSON.name] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}
