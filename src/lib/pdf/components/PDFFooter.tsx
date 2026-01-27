import { View, Text } from "@react-pdf/renderer";
import { colors } from "../styles";
import type { SiteSettingsData } from "@/lib/payload";

interface PDFFooterProps {
  settings: SiteSettingsData;
}

export function PDFFooter({ settings }: PDFFooterProps) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 7, color: colors.muted }}>
        {settings.siteTitle}
      </Text>
      <Text style={{ fontSize: 6, color: colors.muted }}>
        Generated {date}
      </Text>
    </View>
  );
}
