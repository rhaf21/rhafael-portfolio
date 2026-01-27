import { View, Text } from "@react-pdf/renderer";
import { compactStyles, colors } from "../styles";

const experience = [
  {
    company: "CreateCircus",
    role: "Senior Developer",
    period: "Present",
    description:
      "Building interactive web experiences and leading frontend architecture for creative digital projects",
  },
  {
    company: "CarpeDiemTours",
    role: "Full Stack Developer",
    period: "2024-2025",
    description:
      "Developed booking systems and tour management platform using React and Node.js",
  },
  {
    company: "Freelance",
    role: "Shopify/WordPress Developer",
    period: "2020-Present",
    description:
      "Custom e-commerce solutions, theme development, and site optimizations for various clients",
  },
];

export function PDFExperience() {
  return (
    <View style={{ marginBottom: 12 }}>
      {/* Section header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Text style={compactStyles.h2}>Experience</Text>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: colors.border,
            marginLeft: 8,
          }}
        />
      </View>

      {/* Experience cards - horizontal layout */}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {experience.map((exp, index) => (
          <View
            key={index}
            style={{
              width: "31%",
              marginRight: index < 2 ? "3.5%" : 0,
              padding: 10,
              backgroundColor: colors.card,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: "bold",
                color: colors.foreground,
                marginBottom: 2,
              }}
            >
              {exp.company}
            </Text>
            <Text
              style={{ fontSize: 7, color: colors.primary, marginBottom: 4 }}
            >
              {exp.role} · {exp.period}
            </Text>
            <Text
              style={{
                fontSize: 7,
                color: colors.mutedForeground,
                lineHeight: 1.3,
              }}
            >
              {exp.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
