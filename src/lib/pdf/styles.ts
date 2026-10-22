import { StyleSheet } from "@react-pdf/renderer";

// Brand tokens, matching :root in globals.css.
export const colors = {
  canvas: "#f4f4f1",
  surface: "#ffffff",
  ink: "#121214",
  inkMuted: "#5b5b62",
  inkSubtle: "#86868d",
  line: "#e2e1dc",
  lineStrong: "#8f8e87",
  accent: "#b8461b",
  accentStrong: "#973812",
  accentSoft: "#f6e4d9",
  success: "#2e7d57",
  successSoft: "#ddf0e6",
};

export const fonts = {
  display: "Instrument Serif",
  sans: "Geist",
  mono: "Geist Mono",
};

/**
 * The layout was drawn on the canvas as an A4 sheet of 794 x 1123 CSS pixels, so every size
 * here is written in those pixels and converted: 1px = 0.75pt.
 */
export const px = (n: number) => n * 0.75;

/** Letter spacing given in em, as in the site's CSS, for a font size in pixels. */
export const em = (n: number, size: number) => px(n * size);

/** Spacing scale used throughout: gap between sections, label rule to content, items in a list. */
export const space = { section: px(40), label: px(12), item: px(12) };

export const s = StyleSheet.create({
  page: {
    backgroundColor: colors.canvas,
    paddingTop: px(44),
    paddingHorizontal: px(52),
    fontFamily: fonts.sans,
    fontSize: px(12),
    lineHeight: 1.5,
    color: colors.ink,
  },

  // Top bar: wordmark and the page's name.
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: px(10),
    borderBottomWidth: px(1),
    borderBottomColor: colors.ink,
  },
  wordmark: { flexDirection: "row", alignItems: "flex-end" },
  wordmarkText: { fontFamily: fonts.display, fontSize: px(19), lineHeight: 1.2, letterSpacing: em(-0.01, 19) },
  wordmarkDot: {
    width: px(5),
    height: px(5),
    borderRadius: px(2.5),
    backgroundColor: colors.accent,
    marginLeft: px(5),
    marginBottom: px(5),
  },
  barLabel: {
    fontFamily: fonts.mono,
    fontSize: px(9.5),
    letterSpacing: em(0.12, 9.5),
    textTransform: "uppercase",
    color: colors.inkMuted,
  },

  // Footer, pinned 28px above the sheet's bottom edge.
  foot: {
    position: "absolute",
    left: px(52),
    right: px(52),
    bottom: px(28),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: px(9),
    borderTopWidth: px(1),
    borderTopColor: colors.line,
    fontFamily: fonts.mono,
    fontSize: px(9),
    letterSpacing: em(0.1, 9),
    textTransform: "uppercase",
    color: colors.inkSubtle,
  },

  // Section label with its rule.
  label: {
    fontFamily: fonts.mono,
    fontWeight: 500,
    fontSize: px(9.5),
    letterSpacing: em(0.12, 9.5),
    textTransform: "uppercase",
    color: colors.inkMuted,
    paddingBottom: px(8),
    borderBottomWidth: px(1),
    borderBottomColor: colors.ink,
    marginBottom: space.label,
  },

  muted: { color: colors.inkMuted },
  mono: { fontFamily: fonts.mono },
  serif: { fontFamily: fonts.display },
  accentItalic: { fontFamily: fonts.display, fontStyle: "italic", color: colors.accent },

  // Status chip: the four ways a job ends, as on the site.
  chip: {
    alignSelf: "flex-start",
    paddingVertical: px(2),
    paddingHorizontal: px(7),
    borderRadius: px(999),
  },
  chipText: {
    fontFamily: fonts.mono,
    fontSize: px(8.5),
    lineHeight: 1.4,
    letterSpacing: em(0.08, 8.5),
    textTransform: "uppercase",
  },

  // Receipt slip.
  slip: {
    position: "relative",
    backgroundColor: colors.surface,
    borderWidth: px(1),
    borderColor: colors.line,
    paddingTop: px(16),
    paddingHorizontal: px(16),
    // Room under the last line for the stamp, so it never covers text.
    paddingBottom: px(44),
    fontFamily: fonts.mono,
    fontSize: px(10),
    lineHeight: 1.75,
  },
  slipHead: { textAlign: "center", fontSize: px(8.5), letterSpacing: em(0.14, 8.5), color: colors.inkMuted },
  slipClient: {
    fontFamily: fonts.display,
    fontSize: px(22),
    lineHeight: 1.05,
    textAlign: "center",
    marginTop: px(6),
    marginBottom: px(4),
  },
  slipMeta: { textAlign: "center", fontSize: px(8.5), letterSpacing: em(0.08, 8.5), color: colors.inkMuted },
  slipCut: { borderTopWidth: px(1), borderTopColor: colors.lineStrong, borderStyle: "dashed", marginVertical: px(9) },
  slipRow: { flexDirection: "row", alignItems: "flex-end", columnGap: px(6) },
  slipLeader: {
    flexGrow: 1,
    minWidth: px(8),
    borderBottomWidth: px(1),
    borderBottomColor: colors.lineStrong,
    borderStyle: "dotted",
    marginBottom: px(6),
  },
  slipTotal: { flexDirection: "row", justifyContent: "space-between", columnGap: px(10), fontWeight: 500 },
  stamp: {
    position: "absolute",
    right: px(16),
    bottom: px(12),
    transform: "rotate(-12deg)",
    opacity: 0.9,
    borderWidth: px(1),
    borderColor: colors.accent,
    borderRadius: px(5),
    padding: px(2),
  },
  stampInner: {
    borderWidth: px(1.5),
    borderColor: colors.accent,
    borderRadius: px(3),
    backgroundColor: colors.surface,
    paddingVertical: px(2),
    paddingHorizontal: px(8),
  },
  stampText: {
    fontFamily: fonts.mono,
    fontWeight: 500,
    fontSize: px(10),
    lineHeight: 1.4,
    letterSpacing: em(0.14, 10),
    color: colors.accent,
  },
});
