import path from "path";
import { Font } from "@react-pdf/renderer";

const fontsDir = path.join(process.cwd(), "public", "fonts");
const font = (file: string) => path.join(fontsDir, file);

// The site's three brand faces, as static TTFs (react-pdf can't pick weights out of a variable font).
export function registerFonts() {
  Font.register({
    family: "Geist",
    fonts: [
      { src: font("Geist-Regular.ttf"), fontWeight: 400 },
      { src: font("Geist-Medium.ttf"), fontWeight: 500 },
      { src: font("Geist-SemiBold.ttf"), fontWeight: 600 },
    ],
  });
  Font.register({
    family: "Geist Mono",
    fonts: [
      { src: font("GeistMono-Regular.ttf"), fontWeight: 400 },
      { src: font("GeistMono-Medium.ttf"), fontWeight: 500 },
    ],
  });
  Font.register({
    family: "Instrument Serif",
    fonts: [
      { src: font("InstrumentSerif-Regular.ttf") },
      { src: font("InstrumentSerif-Italic.ttf"), fontStyle: "italic" },
    ],
  });

  // Whole words only: react-pdf hyphenates by default, which split "lead-ing" mid-line.
  Font.registerHyphenationCallback((word) => [word]);
}
