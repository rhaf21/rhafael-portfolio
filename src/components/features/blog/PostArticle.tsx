import Link from "next/link";
import type { CSSProperties } from "react";
import { JsonLd } from "@/components/JsonLd";
import { RevealEffects } from "@/components/ui/RevealEffects";
import { CATEGORY_LABELS } from "@/data/blog";
import type { PostData } from "@/lib/payload";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { PostBody, getFaq, getToc } from "./PostBody";

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

interface PostArticleProps {
  post: PostData;
  posts: PostData[];
  email: string;
}

/** The full post template, shared by live posts and the dev-only draft preview. */
export function PostArticle({ post, posts, email }: PostArticleProps) {
  const toc = getToc(post.content);
  const faq = getFaq(post.content);
  const category = CATEGORY_LABELS[post.category] ?? post.category;
  const related = posts.filter((p) => p.id !== post.id && p.status === "published").slice(0, 2);

  return (
    <article className="post">
      <JsonLd
        graph={[
          articleSchema({
            type: "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            keywords: post.tags,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
          }),
          breadcrumbSchema([["Home", "/"], ["Blog", "/blog"], [post.title, `/blog/${post.slug}`]]),
          ...(faq.length > 0 ? [faqSchema(faq)] : []),
        ]}
      />
      <nav className="wrap crumbs mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/blog">Blog</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{category}</span>
      </nav>

      <header className="wrap post-head">
        <span className="label fade-up">{category}</span>
        <h1 className="post-title fade-up" style={d(100)}>
          {post.title}
        </h1>
        <p className="dek fade-up" style={d(240)}>
          {post.excerpt}
        </p>
        <div className="byline fade-up" style={d(340)}>
          <span className="avatar" aria-hidden>
            R
          </span>
          <span>
            <b>Rhafael Corpuz</b>
            {post.readingTime ? ` · ${post.readingTime} min read` : null}
          </span>
        </div>
        {post.tags.length > 0 && (
          <div className="tagrow fade-up" style={d(420)}>
            {post.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
      </header>

      <div className="wrap post-layout">
        {toc.length > 1 ? (
          <nav className="toc" aria-label="On this page">
            <span className="label">On this page</span>
            {toc.map((h) => (
              <a key={h.id} href={`#${h.id}`}>
                {h.text}
              </a>
            ))}
          </nav>
        ) : (
          <span />
        )}
        <div className="post-body">
          <PostBody content={post.content} />
          <div className="inline-cta">
            <span>
              <b>Want this built for you?</b>
              The Systems Audit maps your store or CRM in five business days, with a fixed quote for the fixes.
            </span>
            <Link className="btn btn-ink" href="/services#audit">
              See the audit <span className="arr">→</span>
            </Link>
          </div>
        </div>
        <aside className="post-aside">
          <div className="author">
            <span className="avatar" aria-hidden>
              R
            </span>
            <span className="who">
              <b>Rhafael Corpuz</b>
              <span>Wrote this post</span>
            </span>
            <p>Shopify developer and CRM automation specialist. GoHighLevel, Salesforce, n8n, and the Shopify APIs.</p>
            <Link className="btn btn-ink" href="/contact">
              Book a call
            </Link>
            <a className="btn btn-text" href={`mailto:${email}`}>
              Email me
            </a>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="wrap sec more">
          <div className="sec-top" data-reveal>
            <div>
              <span className="label">Keep reading</span>
              <h2 className="h2">More from the build.</h2>
            </div>
          </div>
          <div className="related" data-stagger>
            {related.map((p, n) => (
              <Link className="rel" key={p.id} href={`/blog/${p.slug}`} style={{ "--i": n } as CSSProperties}>
                <span className="mono">
                  {CATEGORY_LABELS[p.category] ?? p.category}
                  {p.readingTime ? ` · ${p.readingTime} min` : ""}
                </span>
                <h3>{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
      <RevealEffects />
    </article>
  );
}
