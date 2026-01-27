import { Font } from "@react-pdf/renderer";

// Register Ubuntu font family for PDF generation
export function registerFonts() {
  Font.register({
    family: "Ubuntu",
    fonts: [
      {
        src: process.cwd() + "/public/fonts/Ubuntu-Regular.ttf",
        fontWeight: "normal",
      },
      {
        src: process.cwd() + "/public/fonts/Ubuntu-Medium.ttf",
        fontWeight: "medium",
      },
      {
        src: process.cwd() + "/public/fonts/Ubuntu-Bold.ttf",
        fontWeight: "bold",
      },
    ],
  });
}
