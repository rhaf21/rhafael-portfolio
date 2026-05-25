import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BigCTA } from "@/components/ui";
import { PostBody } from "@/components/features/blog";
import { getPostBySlug, getPosts, getSiteSettings } from "@/lib/payload";

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt || undefined,
    },
  };
}

const categoryLabels: Record<string, string> = {
  tutorial: "Tutorial",
  "case-study": "Case Study",
  insights: "Insights",
  news: "News",
  tips: "Tips & Tricks",
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="detail-hero container-x">
        <Link href="/blog" className="back-link" data-cursor="hover">
          ← Back to blog
        </Link>
        <span className="pill">
          <span className="swatch" />
          {categoryLabels[post.category] || post.category}
        </span>
        <h1 data-reveal>{post.title}</h1>
        <p className="lede" data-reveal data-delay="100">
          {post.excerpt}
        </p>
        <div className="detail-meta">
          <div className="m">
            <div className="k">Published</div>
            <div className="v">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-"}
            </div>
          </div>
          {post.readingTime && (
            <div className="m">
              <div className="k">Read time</div>
              <div className="v">{post.readingTime} min</div>
            </div>
          )}
          <div className="m">
            <div className="k">Tags</div>
            <div className="v">{post.tags.slice(0, 3).join(", ") || "-"}</div>
          </div>
          <div className="m">
            <div className="k">Author</div>
            <div className="v">Rhafael</div>
          </div>
        </div>
      </section>

      <section
        className="container-tight"
        style={{ padding: "8px 0 60px" }}
      >
        <PostBody content={post.content} />
      </section>

      <BigCTA email={settings.email} />
    </>
  );
}
