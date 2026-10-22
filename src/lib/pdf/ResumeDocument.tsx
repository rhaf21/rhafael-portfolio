import { Document } from "@react-pdf/renderer";
import type { SiteSettingsData } from "@/lib/payload";
import { PERSON } from "@/lib/site";
import { registerFonts } from "./fonts";
import { ResumePage, WorkPage } from "./components";

// Register fonts before rendering
registerFonts();

interface ResumeDocumentProps {
  settings: SiteSettingsData;
  /** Shown in the top bar, e.g. "October 2026". */
  updated: string;
}

/** The resume served at /resume.pdf: page one is the resume, page two the proof and prices. */
export function ResumeDocument({ settings, updated }: ResumeDocumentProps) {
  return (
    <Document
      title={`${PERSON.name} · Resume`}
      author={PERSON.name}
      subject={PERSON.jobTitle}
      keywords="Shopify developer, CRM automation, GoHighLevel, Salesforce, n8n, Liquid, Next.js"
      creator="rhafael.dev"
      producer="rhafael.dev"
      language="en"
    >
      <ResumePage settings={settings} updated={updated} />
      <WorkPage />
    </Document>
  );
}
