import { View, Text, Link } from "@react-pdf/renderer";
import { compactStyles, colors } from "../styles";
import type { Project } from "@/types/project";

interface PDFProjectsProps {
  projects: Project[];
}

// Helper to get category display name
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    shopify: "Shopify",
    wordpress: "WordPress",
    react: "React",
  };
  return labels[category] || category;
}

// Maximum projects to display
const MAX_PROJECTS = 8;

// Maximum description length (increased for larger cards)
const MAX_DESC_LENGTH = 150;

// Helper to truncate description
function truncateDesc(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function PDFProjects({ projects }: PDFProjectsProps) {
  // Limit projects for single page
  const displayProjects = projects.slice(0, MAX_PROJECTS);

  return (
    <View>
      {/* Section header with underline */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={compactStyles.h2}>Featured Projects</Text>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: colors.border,
            marginLeft: 8,
          }}
        />
      </View>

      {/* 2-column card grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {displayProjects.map((project, index) => (
          <View
            key={project.id}
            style={{
              width: "48%",
              marginRight: index % 2 === 0 ? "4%" : 0,
              marginBottom: 10,
              padding: 12,
              backgroundColor: colors.card,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Title + Category */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              {project.liveUrl ? (
                <Link src={project.liveUrl} style={{ textDecoration: "none" }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: colors.primary,
                    }}
                  >
                    {project.title}
                  </Text>
                </Link>
              ) : (
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: colors.foreground,
                  }}
                >
                  {project.title}
                </Text>
              )}
              <View style={compactStyles.badge}>
                <Text style={{ fontSize: 5, color: colors.background }}>
                  {getCategoryLabel(project.category)}
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text
              style={{
                fontSize: 8,
                color: colors.mutedForeground,
                marginBottom: 4,
                lineHeight: 1.4,
              }}
            >
              {truncateDesc(project.description, MAX_DESC_LENGTH)}
            </Text>

            {/* Tech stack */}
            <Text style={{ fontSize: 6, color: colors.muted }}>
              {(project.techStack || []).slice(0, 5).join(" · ")}
            </Text>
          </View>
        ))}
      </View>

      {/* More projects note */}
      <Text
        style={{
          fontSize: 7,
          color: colors.muted,
          textAlign: "center",
          marginTop: 6,
        }}
      >
        Many more projects completed over the past year
      </Text>
    </View>
  );
}
