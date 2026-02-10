import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PortfolioDocument } from "@/lib/pdf";
import { getProjects, getSiteSettings } from "@/lib/payload";
import type { Project } from "@/types/project";
import type { SiteSettingsData } from "@/lib/payload";

export const dynamic = "force-dynamic";

// Render PDF outside of try/catch to satisfy React compiler rules
async function generatePDF(projects: Project[], settings: SiteSettingsData) {
  const document = <PortfolioDocument projects={projects} settings={settings} />;
  return renderToBuffer(document);
}

export async function GET() {
  // Fetch data
  let projects: Project[];
  let settings: SiteSettingsData;

  try {
    [projects, settings] = await Promise.all([
      getProjects(),
      getSiteSettings(),
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }

  // Filter to featured projects or limit to 6
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 6);
  const displayProjects = featuredProjects.length > 0
    ? featuredProjects
    : projects.slice(0, 6);

  // Generate PDF buffer
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generatePDF(displayProjects, settings);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }

  // Create filename
  const name = settings.heroGreeting.replace("Hi, I'm ", "").toLowerCase().replace(/\s+/g, "-");
  const filename = `${name}-portfolio.pdf`;

  // Return PDF as download (convert Buffer to Uint8Array for NextResponse)
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
