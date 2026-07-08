import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  outputFileTracingIncludes: {
    "/api/portfolio-pdf": ["./public/fonts/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async rewrites() {
    return [
      // Clean, shareable resume URL that serves the generated portfolio PDF.
      { source: "/resume.pdf", destination: "/api/portfolio-pdf" },
    ];
  },
};

export default withPayload(nextConfig);
