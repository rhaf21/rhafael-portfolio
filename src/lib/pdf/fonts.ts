import { Font } from "@react-pdf/renderer";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rhafael.dev";

// Register Ubuntu font family for PDF generation
export function registerFonts() {
  Font.register({
    family: "Ubuntu",
    fonts: [
      {
        src: `${BASE_URL}/fonts/Ubuntu-Regular.ttf`,
        fontWeight: "normal",
      },
      {
        src: `${BASE_URL}/fonts/Ubuntu-Medium.ttf`,
        fontWeight: "medium",
      },
      {
        src: `${BASE_URL}/fonts/Ubuntu-Bold.ttf`,
        fontWeight: "bold",
      },
    ],
  });
}
