import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Link from "next/link";
import type { CSSProperties } from "react";
import { RevealEffects } from "@/components/ui/RevealEffects";
import { getPosts } from "@/lib/payload";
import { CATEGORY_LABELS } from "@/data/blog";
import "@/styles/blog.css";

export const revalidate = 3600;

const base = pageMeta({
  title: "Blog: notes from the build",
  description:
    "How I build Shopify stores and CRM automation in GoHighLevel, Salesforce, and n8n, written so you can do it yourself, or know exactly what to ask for.",
  path: "/blog",
});

export const metadata: Metadata = {
  ...base,
  alternates: { ...base.alternates, types: { "application/rss+xml": "/feed.xml" } },
};

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function BlogPage() {
  const posts = (await getPosts()).filter((p) => p.status === "published");
  const featured = posts.find((p) => p.category === "case-study") ?? posts[0];
  const rest = posts.filter((p) => p !== featured);
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <div className="blog">
      <section className="wrap top">
        <div className="top-copy">
          <span className="label fade-up">Blog</span>
          <h1 className="h1">
            <span className="ml">
              <span style={d(80)}>Notes from</span>
            </span>
            <span className="ml">
              <span style={d(200)}>
                <em>the build.</em>
              </span>
            </span>
          </h1>
          <p className="lede fade-up" style={d(380)}>
            How I build Shopify stores and CRM automation, written so you can do it yourself, or know exactly what to
            ask for.
          </p>
        </div>
        <div className="follow fade-up" style={d(500)}>
          <span className="label">Follow along</span>
          <p>New posts land in the RSS feed the moment they go up. No newsletter filler.</p>
          <div className="cta">
            <a className="btn btn-line" href="/feed.xml">
              RSS feed
            </a>
            <Link className="btn btn-text" href="/contact">
              Ask a question <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>

      {featured && (
        <section className="wrap blog-feat-sec">
          <Link className="feat fade-up" style={d(600)} href={`/blog/${featured.slug}`}>
            <div className="feat-art" aria-hidden>
              <div className="nodes">
                <span className="nd">ghl</span>
                <span className="wire-ln" />
                <span className="nd hot">n8n</span>
                <span className="wire-ln" />
                <span className="nd">dashboard</span>
              </div>
            </div>
            <div className="feat-copy">
              <span className="label">Featured · {CATEGORY_LABELS[featured.category] ?? featured.category}</span>
              <h2 className="h2">{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="read">
                Read the post <Arrow />
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="wrap sec posts-sec">
        {/* Same CSS-only filter as the Work page: radios + :has(). */}
        <fieldset className="filters">
          <legend className="sr-only">Filter posts</legend>
          {["all", ...categories].map((c) => (
            <label key={c}>
              <input className="sr-only" type="radio" name="cat" id={`cat-${c}`} defaultChecked={c === "all"} />
              <span>{c === "all" ? "All" : CATEGORY_LABELS[c] ?? c}</span>
            </label>
          ))}
          <span className="count mono">
            {["all", ...categories].map((c) => {
              const n = c === "all" ? rest.length : rest.filter((p) => p.category === c).length;
              return (
                <span key={c} className={`c-${c}`}>
                  {n} {n === 1 ? "post" : "posts"}
                </span>
              );
            })}
          </span>
        </fieldset>
        <ol className="post-list" data-stagger>
          {rest.map((post, n) => (
            <li key={post.id} data-cat={post.category} style={{ "--i": n } as CSSProperties}>
              <Link className="post-row" href={`/blog/${post.slug}`}>
                <span className="mono idx">{String(n + 1).padStart(2, "0")}</span>
                <span className="post-copy">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </span>
                <span className="post-meta">
                  <span className="cat">{CATEGORY_LABELS[post.category] ?? post.category}</span>
                  {post.readingTime ? <span className="mono mins">{post.readingTime} min</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <RevealEffects />
    </div>
  );
}
