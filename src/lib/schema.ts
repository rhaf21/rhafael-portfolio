// schema.org JSON-LD builders. Every node links back to the same Person and
// business by @id, so search engines and AI assistants see one entity.
import { RATES } from "@/data/proof";
import { SERVICES } from "@/data/services";
import { UPWORK_URL } from "@/data/navigation";
import { PERSON, SITE_URL, absoluteUrl } from "@/lib/site";

const PERSON_ID = `${SITE_URL}/#person`;
const BUSINESS_ID = `${SITE_URL}/#business`;
const WEBSITE_ID = `${SITE_URL}/#website`;

type Thing = Record<string, unknown>;

export function personSchema(sameAs: string[] = []): Thing {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON.name,
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    url: SITE_URL,
    knowsAbout: PERSON.knowsAbout,
    sameAs: [UPWORK_URL, ...sameAs.filter((u) => u && u !== UPWORK_URL)],
    worksFor: { "@id": BUSINESS_ID },
  };
}

export function websiteSchema(): Thing {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: PERSON.name,
    description: PERSON.description,
    publisher: { "@id": PERSON_ID },
    inLanguage: "en",
  };
}

const priceOf = (price: string) => Number(price.replace(/[^0-9.]/g, "")) || undefined;

export function businessSchema(): Thing {
  return {
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: `${PERSON.name}, Shopify and CRM automation`,
    url: SITE_URL,
    description: PERSON.description,
    founder: { "@id": PERSON_ID },
    areaServed: PERSON.areaServed.map((name) => ({ "@type": "Country", name })),
    knowsAbout: PERSON.knowsAbout,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: SERVICES.map((s) => {
        const rate = RATES.find((r) => r.name === s.name);
        return {
          "@type": "Offer",
          url: absoluteUrl(`/services#${s.id}`),
          itemOffered: {
            "@type": "Service",
            name: s.name,
            description: [s.tagline, ...s.includes].join(". "),
            provider: { "@id": PERSON_ID },
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "USD",
            minPrice: priceOf(rate?.price ?? s.from),
          },
        };
      }),
    },
  };
}

export function breadcrumbSchema(items: Array<[string, string]>): Thing {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

interface ArticleInput {
  type?: "Article" | "BlogPosting";
  headline: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  about?: string[];
  datePublished?: string | null;
  dateModified?: string | null;
}

export function articleSchema({
  type = "Article",
  headline,
  description,
  path,
  image,
  keywords,
  about,
  datePublished,
  dateModified,
}: ArticleInput): Thing {
  return {
    "@type": type,
    headline,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    ...(image ? { image: absoluteUrl(image) } : {}),
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    ...(about?.length ? { about: about.map((name) => ({ "@type": "Thing", name })) } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified || datePublished ? { dateModified: dateModified ?? datePublished } : {}),
    inLanguage: "en",
  };
}

export function faqSchema(faq: Array<{ q: string; a: string }>): Thing {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function profilePageSchema(sameAs: string[] = []): Thing {
  return {
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    mainEntity: personSchema(sameAs),
  };
}
