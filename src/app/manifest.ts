import type { MetadataRoute } from "next";
import { PERSON } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PERSON.name} · Shopify and CRM automation`,
    short_name: "Rhafael",
    description: PERSON.description,
    start_url: "/",
    display: "browser",
    background_color: "#f4f4f1",
    theme_color: "#141416",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
