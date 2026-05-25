/**
 * Unified outline-style icon mapper for the tech-stack grid.
 *
 * Uses Lucide icons (already a project dep) for a consistent flat-outline
 * look across the entire grid. Maps each skill name to a conceptual icon
 * that evokes what the technology does, rather than its brand logo, that
 * way every tile feels like part of one design system.
 */

import { createElement } from "react";
import {
  Atom,
  Triangle,
  Braces,
  ShoppingBag,
  Newspaper,
  Wind,
  Server,
  Database,
  CreditCard,
  Droplet,
  FileCode2,
  Network,
  FileCode,
  Terminal,
  Code2,
  Layers,
  GitBranch,
  Container,
  Cloud,
  Workflow,
  Zap,
  Webhook,
  Bot,
  Blocks,
  type LucideIcon,
} from "lucide-react";

interface TechIconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  // Frontend / frameworks
  react: Atom,
  "react & next.js": Atom,
  next: Triangle,
  "next.js": Triangle,
  nextjs: Triangle,

  // Languages
  typescript: Braces,
  ts: Braces,
  javascript: Code2,
  js: Code2,
  python: Terminal,
  php: FileCode,

  // CSS / styling
  tailwind: Wind,
  "tailwind css": Wind,
  tailwindcss: Wind,
  css: Layers,
  sass: Layers,
  liquid: Droplet,

  // Commerce
  shopify: ShoppingBag,
  woocommerce: ShoppingBag,
  stripe: CreditCard,
  "stripe & checkout": CreditCard,

  // Content / CMS
  wordpress: Newspaper,
  wp: Newspaper,
  sanity: FileCode2,
  payload: FileCode2,
  contentful: FileCode2,

  // Backend / runtime
  node: Server,
  "node.js": Server,
  nodejs: Server,
  deno: Server,
  bun: Server,
  fastify: Server,
  express: Server,

  // Data
  mongodb: Database,
  mongo: Database,
  postgres: Database,
  postgresql: Database,
  mysql: Database,
  redis: Database,
  prisma: Database,
  graphql: Network,

  // Infra
  docker: Container,
  vercel: Triangle,
  aws: Cloud,
  cloudflare: Cloud,
  ably: GitBranch,
  pusher: GitBranch,

  // Automation
  n8n: Workflow,
  zapier: Zap,
  zap: Zap,
  make: Blocks,
  "make (integromat)": Blocks,
  integromat: Blocks,
  webhook: Webhook,
  webhooks: Webhook,
  "webhooks & ai agents": Bot,
  "ai agents": Bot,
  "ai agent": Bot,
  automation: Workflow,
};

function normalize(name: string): string {
  return name.toLowerCase().trim();
}

export function getTechIcon(name: string): LucideIcon | null {
  const key = normalize(name);
  if (ICON_MAP[key]) return ICON_MAP[key];
  // partial match (e.g., "React & Next.js" → react)
  for (const k of Object.keys(ICON_MAP)) {
    if (k.length >= 3 && key.includes(k)) return ICON_MAP[k];
  }
  return null;
}

export function TechIcon({
  name,
  size = 22,
  strokeWidth = 1.6,
  className,
}: TechIconProps) {
  const Icon = getTechIcon(name);
  if (!Icon) return null;
  // createElement avoids a false-positive react/no-component-in-render
  // ESLint warning when Icon is resolved from a map at runtime.
  return createElement(Icon, {
    size,
    strokeWidth,
    className,
    "aria-hidden": true,
  });
}
