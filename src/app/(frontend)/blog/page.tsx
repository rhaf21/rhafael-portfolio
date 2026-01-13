import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout";
import { Section, SectionHeader, Badge } from "@/components/ui";
import { FadeIn, StaggerContainer } from "@/components/animations";
import { getPosts } from "@/lib/payload";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights, tutorials, and case studies on web development, e-commerce, and modern technologies.",
};

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

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <Section>
      <Container>
        <FadeIn>
          <SectionHeader
            title="Blog"
            description="Thoughts, tutorials, and insights on web development."
          />
        </FadeIn>

        {posts.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No posts yet. Check back soon!
              </p>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <FadeIn key={post.id} delay={index * 0.1}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                    {/* Featured Image */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl text-muted-foreground/30">
                            📝
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge
                          className={categoryColors[post.category] || ""}
                        >
                          {categoryLabels[post.category] || post.category}
                        </Badge>
                        {post.readingTime && (
                          <span className="text-xs text-muted-foreground">
                            {post.readingTime} min read
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <time dateTime={post.publishedAt || undefined}>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "Draft"}
                        </time>
                        <span className="text-primary font-medium group-hover:underline">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </Section>
  );
}
