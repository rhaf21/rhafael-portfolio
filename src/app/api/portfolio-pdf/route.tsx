import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ResumeDocument } from "@/lib/pdf";
import { getSiteSettings } from "@/lib/payload";
import type { SiteSettingsData } from "@/lib/payload";

export const dynamic = "force-dynamic";

const FILENAME = "rhafael-corpuz-resume.pdf";

// Render PDF outside of try/catch to satisfy React compiler rules
async function generatePDF(settings: SiteSettingsData, updated: string) {
  const document = <ResumeDocument settings={settings} updated={updated} />;
  return renderToBuffer(document);
}

export async function GET() {
  // Only the contact details and availability come from the CMS; the rest is in the site's data files.
  let settings: SiteSettingsData;
  try {
    settings = await getSiteSettings();
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch resume data" }, { status: 500 });
  }

  const updated = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "Asia/Manila" });

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generatePDF(settings, updated);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }

  // Serve inline so a shared link (e.g. /resume.pdf) opens in the browser.
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${FILENAME}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
