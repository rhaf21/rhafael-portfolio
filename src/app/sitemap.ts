import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/payload";
import { CRM_CASE, MILLINER_CASE, PROVEY_CASE } from "@/data/proof";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  const pages: Array<[string, MetadataRoute.Sitemap[number]["changeFrequency"], number]> = [
    ["/", "weekly", 1],
    ["/services", "monthly", 0.9],
    ["/projects", "weekly", 0.9],
    [MILLINER_CASE, "monthly", 0.8],
    [CRM_CASE, "monthly", 0.8],
    [PROVEY_CASE, "monthly", 0.7],
    ["/about", "monthly", 0.8],
    ["/blog", "weekly", 0.7],
    ["/side-projects", "monthly", 0.5],
    ["/contact", "yearly", 0.6],
  ];
  const designed = new Set(pages.map(([path]) => path));

  return [
    ...pages.map(([path, changeFrequency, priority]) => ({ url: absoluteUrl(path), changeFrequency, priority })),
    ...projects
      .map((p) => `/projects/${p.slug}`)
      .filter((path) => !designed.has(path))
      .map((path) => ({ url: absoluteUrl(path), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts
      .filter((p) => p.status === "published")
      .map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
