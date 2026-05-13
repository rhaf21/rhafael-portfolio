import type { Metadata } from "next";
import Link from "next/link";
import { BigCTA } from "@/components/ui";
import { getPosts, getSiteSettings } from "@/lib/payload";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tutorials, case studies, and notes on shipping fast e-commerce and editorial sites.",
};

const categoryLabels: Record<string, string> = {
  tutorial: "Tutorial",
  "case-study": "Case Study",
  insights: "Insights",
  news: "News",
  tips: "Tips & Tricks",
};

function formatDate(value: string | null): string {
  if (!value) return "Draft";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "Draft";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    getPosts(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="projects-page-hero container-x">
        <div className="hero-eyebrow" data-reveal>
          <span className="dot" />
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </div>
        <h1
          className="section-title"
          data-reveal
          style={{
            fontSize: "clamp(48px, 8vw, 120px)",
            maxWidth: "none",
            marginTop: 32,
          }}
        >
          Notes from <span className="grad">the build.</span>
        </h1>
        <p
          className="hero-sub"
          data-reveal
          data-delay="100"
          style={{ marginTop: 24 }}
        >
          Tutorials, case studies, and notes on shipping fast e-commerce and
          editorial sites.
        </p>
      </section>

      <section className="container-x" style={{ paddingBottom: 80 }}>
        {posts.length === 0 ? (
          <div
            style={{
              padding: "64px 0",
              textAlign: "center",
              color: "var(--fg-mute)",
              fontSize: 14,
            }}
          >
            No posts yet. Check back soon.
          </div>
        ) : (
          <div className="projects-index" role="list">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="project-row"
                data-cursor="hover"
                role="listitem"
                data-reveal
                data-delay={i * 60}
              >
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="name">{post.title}</span>
                <span className="desc-r">{post.excerpt}</span>
                <span className="stacks">
                  <span className="tag">
                    {categoryLabels[post.category] || post.category}
                  </span>
                  <span
                    className="tag"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {formatDate(post.publishedAt)}
                  </span>
                  {post.readingTime && (
                    <span
                      className="tag"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {post.readingTime} min
                    </span>
                  )}
                </span>
                <span className="arrow-r">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <BigCTA email={settings.email} />
    </>
  );
}
