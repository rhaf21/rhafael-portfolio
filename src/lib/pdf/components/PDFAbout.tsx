import { View, Text } from "@react-pdf/renderer";
import { compactStyles, colors } from "../styles";
import type { SiteSettingsData } from "@/lib/payload";

interface PDFAboutProps {
  settings: SiteSettingsData;
}

// Maximum characters for about section to fit single page
const MAX_ABOUT_LENGTH = 350;

export function PDFAbout({ settings }: PDFAboutProps) {
  // Get first paragraph or truncate content
  let aboutText = settings.aboutContent || "";

  // Get first paragraph
  const firstParagraph = aboutText.split("\n").find((p) => p.trim()) || aboutText;

  // Truncate if needed
  aboutText = firstParagraph.length > MAX_ABOUT_LENGTH
    ? firstParagraph.substring(0, MAX_ABOUT_LENGTH).trim() + "..."
    : firstParagraph;

  // Fallback text if no content
  if (!aboutText.trim()) {
    aboutText =
      "Passionate developer specializing in building high-quality e-commerce stores and web applications. Experienced in Shopify, WordPress, and React.";
  }

  return (
    <View>
      {/* Section header with underline */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
        <Text style={compactStyles.h2}>About</Text>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: colors.border,
            marginLeft: 8,
          }}
        />
      </View>

      {/* Single paragraph */}
      <Text style={compactStyles.body}>{aboutText}</Text>
    </View>
  );
}
