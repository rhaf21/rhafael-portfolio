import { Document, Page, View } from "@react-pdf/renderer";
import { compactStyles, colors } from "./styles";
import { registerFonts } from "./fonts";
import {
  PDFHeader,
  PDFAbout,
  PDFProjects,
  PDFContactSidebar,
  PDFExperience,
  PDFFooter,
} from "./components";
import type { Project } from "@/types/project";
import type { SiteSettingsData } from "@/lib/payload";

// Register fonts before rendering
registerFonts();

interface PortfolioDocumentProps {
  projects: Project[];
  settings: SiteSettingsData;
}

export function PortfolioDocument({
  projects,
  settings,
}: PortfolioDocumentProps) {
  return (
    <Document
      title={`${settings.siteTitle} - Portfolio`}
      author={settings.heroGreeting.replace("Hi, I'm ", "")}
      subject="Professional Portfolio"
      keywords="portfolio, developer, web development, shopify, wordpress, react"
      creator="Portfolio PDF Generator"
    >
      {/* Single page with all sections */}
      <Page size="A4" style={compactStyles.page}>
        {/* Main content wrapper with flex: 1 to enable footer pinning */}
        <View style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* TOP SECTION: Header + About with Contact Sidebar */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            {/* Left 70%: Header + About */}
            <View style={{ width: "70%", paddingRight: 16 }}>
              <PDFHeader settings={settings} />
              <PDFAbout settings={settings} />
            </View>

            {/* Right 30%: Contact Sidebar */}
            <View
              style={{
                width: "30%",
                borderLeftWidth: 1,
                borderLeftColor: colors.border,
                paddingLeft: 16,
              }}
            >
              <PDFContactSidebar settings={settings} />
            </View>
          </View>

          {/* Divider */}
          <View style={compactStyles.divider} />

          {/* EXPERIENCE: Full width, 3-column cards */}
          <PDFExperience />

          {/* PROJECTS: Full width, 2-column grid */}
          <PDFProjects projects={projects} />

          {/* Spacer to push footer to bottom */}
          <View style={{ flex: 1 }} />

          {/* FOOTER: Pinned at bottom */}
          <PDFFooter settings={settings} />
        </View>
      </Page>
    </Document>
  );
}
