import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/features/blog/PostArticle";
import { getPosts, getSiteSettings, type PostData } from "@/lib/payload";
import { mdToLexical, parseFrontmatter } from "@/lib/markdown";
import "@/styles/blog.css";

// Development only: renders a draft from content/blog/<slug>.md through the
// live post template, so drafts can be reviewed before they're seeded.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Draft preview", robots: { index: false, follow: false } };

export default async function DraftPreview({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();

  const src = await readFile(path.join(process.cwd(), "content", "blog", `${slug}.md`), "utf8").catch(() => null);
  if (src === null) notFound();
  const { data, body } = parseFrontmatter(src);

  const post: PostData = {
    id: `draft-${slug}`,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    featuredImage: null,
    content: mdToLexical(body),
    category: data.category,
    tags: data.tags ?? [],
    status: data.status,
    publishedAt: data.publishedAt ?? null,
    updatedAt: null,
    readingTime: data.readingTime,
  };
  const [posts, settings] = await Promise.all([getPosts(), getSiteSettings()]);

  return (
    <>
      <p className="wrap draft-banner mono">Draft preview · {data.status} · not in the database yet</p>
      <PostArticle post={post} posts={posts} email={settings.email || "rhafaelcorpuz21@gmail.com"} />
    </>
  );
}
