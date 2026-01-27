import { View, Text, Link } from "@react-pdf/renderer";
import { compactStyles, colors } from "../styles";
import type { SiteSettingsData } from "@/lib/payload";

interface PDFContactSidebarProps {
  settings: SiteSettingsData;
}

// Hardcoded data for Languages and Tech Stack
const languages = ["JavaScript", "TypeScript", "PHP", "Python", "Dart"];
const techStack = [
  "React",
  "Next.js",
  "Node.js",
  "Tailwind",
  "PostgreSQL",
  "Shopify",
  "WordPress",
  "REST APIs",
];

// Helper to get platform display label
function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "Twitter",
    instagram: "Instagram",
    dribbble: "Dribbble",
    behance: "Behance",
    youtube: "YouTube",
  };
  return labels[platform.toLowerCase()] || platform;
}

export function PDFContactSidebar({ settings }: PDFContactSidebarProps) {
  return (
    <View>
      {/* Available badge */}
      {settings.availableForWork && (
        <View style={{ ...compactStyles.availableBadge, marginBottom: 12 }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.primary,
              marginRight: 5,
            }}
          />
          <Text style={{ fontSize: 7, color: colors.primary }}>
            Available for hire
          </Text>
        </View>
      )}

      {/* Email */}
      {settings.email && (
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 6, color: colors.muted, marginBottom: 2 }}>
            EMAIL
          </Text>
          <Link src={`mailto:${settings.email}`} style={{ textDecoration: "none" }}>
            <Text style={{ fontSize: 8, color: colors.primary }}>
              {settings.email}
            </Text>
          </Link>
        </View>
      )}

      {/* Social links */}
      {settings.socialLinks?.map((social, index) => (
        <View key={index} style={{ marginBottom: 6 }}>
          <Link src={social.url} style={{ textDecoration: "none" }}>
            <Text style={{ fontSize: 8, color: colors.mutedForeground }}>
              {getPlatformLabel(social.platform)}
            </Text>
          </Link>
        </View>
      ))}

      {/* Languages */}
      <View style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 6, color: colors.muted, marginBottom: 4 }}>
          LANGUAGES
        </Text>
        <Text
          style={{
            fontSize: 7,
            color: colors.mutedForeground,
            lineHeight: 1.4,
          }}
        >
          {languages.join(" · ")}
        </Text>
      </View>

      {/* Tech Stack */}
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 6, color: colors.muted, marginBottom: 4 }}>
          TECH STACK
        </Text>
        <Text
          style={{
            fontSize: 7,
            color: colors.mutedForeground,
            lineHeight: 1.4,
          }}
        >
          {techStack.join(" · ")}
        </Text>
      </View>
    </View>
  );
}
