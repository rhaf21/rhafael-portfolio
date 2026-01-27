import { StyleSheet } from "@react-pdf/renderer";

// Design tokens matching website theme
export const colors = {
  background: "#000000",
  foreground: "#ffffff",
  primary: "#84cc16", // Neon green (approximation of oklch(0.65 0.35 140))
  muted: "#a3a3a3",
  mutedForeground: "#d4d4d4",
  border: "#1a1a1a",
  card: "#0a0a0a",
};

// Base styles for PDF components
export const styles = StyleSheet.create({
  // Page layout
  page: {
    backgroundColor: colors.background,
    padding: 40,
    fontFamily: "Ubuntu",
    color: colors.foreground,
  },

  // Typography
  h1: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.foreground,
    marginBottom: 8,
  },
  h2: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.foreground,
    marginBottom: 12,
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.foreground,
    marginBottom: 8,
  },
  h4: {
    fontSize: 16,
    fontWeight: "medium",
    color: colors.foreground,
    marginBottom: 6,
  },
  body: {
    fontSize: 11,
    color: colors.mutedForeground,
    lineHeight: 1.6,
  },
  small: {
    fontSize: 9,
    color: colors.muted,
  },

  // Layout helpers
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexColumn: {
    flexDirection: "column",
  },
  section: {
    marginBottom: 24,
  },

  // Card style
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Badge style
  badge: {
    backgroundColor: colors.primary,
    color: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 9,
    fontWeight: "medium",
  },
  badgeOutline: {
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.muted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 8,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  // Image container
  imageContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  projectImage: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: 8,
  },

  // Link style (visual only, PDFs can't have interactive links in same way)
  link: {
    color: colors.primary,
    textDecoration: "underline",
  },

  // Centered content
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Full page centered (for cover)
  fullPageCentered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

// Compact styles for single-page layout
export const compactStyles = StyleSheet.create({
  // Compact page with tighter padding
  page: {
    backgroundColor: colors.background,
    padding: 20,
    fontFamily: "Ubuntu",
    color: colors.foreground,
  },

  // Compact typography
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.foreground,
  },
  h2: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.foreground,
    marginBottom: 6,
  },
  h3: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.foreground,
  },
  body: {
    fontSize: 9,
    color: colors.mutedForeground,
    lineHeight: 1.5,
  },
  small: {
    fontSize: 7,
    color: colors.muted,
  },

  // Compact section spacing
  section: {
    marginBottom: 8,
  },

  // Compact divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },

  // Compact badge
  badge: {
    backgroundColor: colors.primary,
    color: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 7,
    fontWeight: "medium",
  },
  badgeOutline: {
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.muted,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 6,
  },

  // Project row style
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // Available badge (compact)
  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  // Project card
  projectCard: {
    width: "48%",
    marginBottom: 8,
    padding: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Card grid container
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  // Sidebar container
  sidebar: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingLeft: 12,
  },

  // Sidebar item
  sidebarItem: {
    marginBottom: 8,
  },
});
