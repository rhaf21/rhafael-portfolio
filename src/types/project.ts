export type ProjectCategory = "shopify" | "wordpress" | "react";

export type TechStack =
  | "shopify"
  | "liquid"
  | "wordpress"
  | "woocommerce"
  | "php"
  | "react"
  | "nextjs"
  | "typescript"
  | "javascript"
  | "tailwind"
  | "css"
  | "html"
  | "nodejs"
  | "mysql"
  | "mongodb"
  | "graphql"
  | "rest-api"
  | "vercel"
  | "netlify";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  techStack: string[];
  images?: string[];
  demoVideo?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  completedAt?: string;
  highlights?: string[];
}
