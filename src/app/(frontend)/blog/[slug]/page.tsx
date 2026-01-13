import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout";
import { Section, Badge } from "@/components/ui";
import { FadeIn } from "@/components/animations";
import { getPostBySlug, getPosts } from "@/lib/payload";

export const revalidate = 0;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

const categoryColors: Record<string, string> = {
  tutorial: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "case-study": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  insights: "bg-green-500/10 text-green-500 border-green-500/20",
  news: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  tips: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

const categoryLabels: Record<string, string> = {
  tutorial: "Tutorial",
  "case-study": "Case Study",
  insights: "Insights",
  news: "News",
  tips: "Tips & Tricks",
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Section>
      <Container className="max-w-4xl">
        <FadeIn>
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <span>←</span>
            <span>Back to Blog</span>
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={categoryColors[post.category] || ""}>
                {categoryLabels[post.category] || post.category}
              </Badge>
              {post.readingTime && (
                <span className="text-sm text-muted-foreground">
                  {post.readingTime} min read
                </span>
              )}
              <span className="text-sm text-muted-foreground">•</span>
              <time
                dateTime={post.publishedAt || undefined}
                className="text-sm text-muted-foreground"
              >
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Draft"}
              </time>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground">{post.excerpt}</p>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 bg-muted">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </article>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground">
                Thanks for reading! Have questions or feedback?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg font-medium px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </footer>
        </FadeIn>
      </Container>
    </Section>
  );
}
