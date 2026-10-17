import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { PostArticle } from "@/components/features/blog/PostArticle";
import { getPostBySlug, getPosts, getSiteSettings } from "@/lib/payload";
import "@/styles/blog.css";

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return pageMeta({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, type: "article" });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, posts, settings] = await Promise.all([getPostBySlug(slug), getPosts(), getSiteSettings()]);
  if (!post) notFound();

  return <PostArticle post={post} posts={posts} email={settings.email || "rhafaelcorpuz21@gmail.com"} />;
}
