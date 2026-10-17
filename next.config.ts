import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// Static headers rather than a per-request nonce: the site's pages are prebuilt, and a nonce
// policy would need every page rendered on each request. Inline scripts stay allowed for
// Next's own bootstrap; everything else is limited to this origin.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self'",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // The public site only: the CMS admin and API set their own rules, and dev needs eval for hot reload.
      ...(process.env.NODE_ENV === "production"
        ? [{ source: "/((?!admin|api).*)", headers: [{ key: "Content-Security-Policy", value: CSP }] }]
        : []),
    ];
  },
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
