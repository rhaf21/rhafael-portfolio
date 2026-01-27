import { View, Text } from "@react-pdf/renderer";
import { compactStyles, colors } from "../styles";
import type { SiteSettingsData } from "@/lib/payload";

interface PDFHeaderProps {
  settings: SiteSettingsData;
}

export function PDFHeader({ settings }: PDFHeaderProps) {
  // Extract name from greeting (e.g., "Hi, I'm Rhafael" -> "Rhafael")
  const name = settings.heroGreeting.replace(/^Hi,?\s*I['']m\s*/i, "").trim();

  return (
    <View style={{ marginBottom: 8 }}>
      {/* Name + Title inline */}
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
        <Text style={compactStyles.h1}>{name}</Text>
        <Text style={{ fontSize: 10, color: colors.muted }}>|</Text>
        <Text style={{ fontSize: 12, color: colors.primary }}>
          {settings.heroTitle}
        </Text>
      </View>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: 9,
          color: colors.mutedForeground,
          marginTop: 2,
        }}
      >
        {settings.heroSubtitle}
      </Text>

      {/* Stats row */}
      {settings.stats && settings.stats.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginTop: 6,
          }}
        >
          {settings.stats.map((stat, index) => (
            <View key={index} style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: 7,
                  color: colors.muted,
                  marginLeft: 3,
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
