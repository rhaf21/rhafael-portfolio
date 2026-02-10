import path from "path";
import { Font } from "@react-pdf/renderer";

const fontsDir = path.join(process.cwd(), "public", "fonts");

// Register Ubuntu font family for PDF generation
export function registerFonts() {
  Font.register({
    family: "Ubuntu",
    fonts: [
      {
        src: path.join(fontsDir, "Ubuntu-Regular.ttf"),
        fontWeight: "normal",
      },
      {
        src: path.join(fontsDir, "Ubuntu-Medium.ttf"),
        fontWeight: "medium",
      },
      {
        src: path.join(fontsDir, "Ubuntu-Bold.ttf"),
        fontWeight: "bold",
      },
    ],
  });
}
