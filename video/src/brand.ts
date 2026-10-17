import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

const serif = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
loadSerif("italic", { weights: ["400"], subsets: ["latin"] });
const sans = loadSans("normal", { weights: ["400", "500"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const fonts = {
  display: serif.fontFamily,
  sans: sans.fontFamily,
  mono: mono.fontFamily,
};

// Mirrors the rhafael.dev Brand tokens (Atelier theme, deep band roles).
export const colors = {
  deep: "#141416",
  deepInk: "#f1f0ec",
  deepMuted: "#a1a1a7",
  accent: "#b8461b",
  accentOnDeep: "#e07a4a",
  surface: "#ffffff",
  ink: "#121214",
  inkMuted: "#5b5b62",
} as const;
