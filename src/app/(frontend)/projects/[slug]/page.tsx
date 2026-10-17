import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { RevealEffects } from "@/components/ui/RevealEffects";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getProjectBySlug, getProjects, getSiteSettings } from "@/lib/payload";
import { Closer, Crumbs, Facts, NextCase } from "@/components/proof/CaseParts";
import "@/styles/case.css";

export const revalidate = 3600;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

const LANE: Record<string, string> = {
  shopify: "Shopify",
  wordpress: "Website · WordPress",
  react: "Website · Next.js",
  automation: "CRM automation",
  // Legacy value still on the Cherries Official record.
  theme: "Shopify",
};

const laneFor = (category: string) =>
  LANE[category] ?? category.charAt(0).toUpperCase() + category.slice(1);

// Live-site captures for projects with no images in the CMS.
const CAPTURES: Record<string, string> = {
  "side-routes": "/work/side-routes-full.webp",
  "carpe-diem-tours": "/work/carpe-diem-tours-full.webp",
  "cherries-official": "/work/cherries-official-full.webp",
  displaysense: "/work/displaysense-full.webp",
  "opera-beds": "/work/opera-beds-full.webp",
};

// These have their own designed pages under /projects/<slug>.
const DESIGNED = new Set(["gohighlevel-n8n-crm-build", "shopify-cro-sydney-milliner", "provey"]);

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.filter((p) => !DESIGNED.has(p.slug)).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return pageMeta({ title: project.title, description: project.description, path: `/projects/${project.slug}`, type: "article" });
}

const isVideo = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, all, settings] = await Promise.all([getProjectBySlug(slug), getProjects(), getSiteSettings()]);
  if (!project) notFound();

  const email = settings.email || "rhafaelcorpuz21@gmail.com";
  const idx = all.findIndex((p) => p.id === project.id);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : undefined;
  const uploaded = (project.images ?? []).filter(Boolean);
  const media = uploaded.length > 0 ? uploaded : CAPTURES[project.slug] ? [CAPTURES[project.slug]] : [];
  const lane = laneFor(project.category);
  const paragraphs = (project.longDescription ?? "").split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="case">
      <JsonLd
        graph={[
          articleSchema({
            headline: project.title,
            description: project.description,
            path: `/projects/${project.slug}`,
            image: media[0] && !isVideo(media[0]) ? media[0] : undefined,
            about: [lane, ...project.techStack],
          }),
          breadcrumbSchema([["Home", "/"], ["Work", "/projects"], [project.title, `/projects/${project.slug}`]]),
        ]}
      />
      <Crumbs current={project.title} />
      <section className="wrap top case-top">
        <div className="top-copy">
          <span className="label fade-up">Project · {lane}</span>
          <h1 className="h1">
            <span className="ml">
              <span style={{ "--d": 80 } as CSSProperties}>{project.title}</span>
            </span>
          </h1>
          <p className="lede fade-up" style={{ "--d": 260 } as CSSProperties}>
            {project.description}
          </p>
          {project.liveUrl && (
            <div className="cta fade-up" style={{ "--d": 380 } as CSSProperties}>
              <a className="btn btn-ink" href={project.liveUrl} target="_blank" rel="noopener">
                Visit the live site <span className="arr">↗</span>
              </a>
            </div>
          )}
        </div>
        <div className="fade-up" style={{ "--d": 480 } as CSSProperties}>
          <Facts
            rows={[
              ["Lane", lane],
              ["Role", "Design and build"],
              ["Stack", project.techStack.join(", ")],
            ]}
          />
        </div>
      </section>

      {media.length > 0 && (
        <section className="wrap sec gallery" data-stagger>
          {media.map((src, i) => (
            <figure key={src} className={i === 0 ? "shot lead-shot" : "shot"} style={{ "--i": i } as CSSProperties}>
              {isVideo(src) ? (
                <video src={src} controls playsInline preload="metadata" />
              ) : (
                <Image
                  src={src}
                  alt={`${project.title}, screen ${i + 1}`}
                  width={1600}
                  height={1000}
                  sizes={i === 0 ? "(max-width: 1280px) 100vw, 1200px" : "(max-width: 820px) 100vw, 50vw"}
                  priority={i === 0}
                />
              )}
            </figure>
          ))}
        </section>
      )}

      {(paragraphs.length > 0 || (project.highlights?.length ?? 0) > 0) && (
        <section className="wrap sec body-sec">
          <div className="sec-top" data-reveal>
            <div>
              <span className="label">The work</span>
              <h2 className="h2">What I built.</h2>
            </div>
          </div>
          <div className="body-grid">
            {paragraphs.length > 0 && (
              <div className="prose" data-reveal>
                {paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
            {project.highlights && project.highlights.length > 0 && (
              <ul className="highlights" data-stagger>
                {project.highlights.map((h, i) => (
                  <li key={h} style={{ "--i": i } as CSSProperties}>
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {next && (
        <section className="wrap sec">
          <NextCase href={`/projects/${next.slug}`} label="Next project" title={next.title} />
        </section>
      )}

      <section className="wrap sec">
        <Closer
          title={
            <>
              Want something like this <em>built for you?</em>
            </>
          }
          cta="Book a call"
          email={email}
        />
      </section>
      <RevealEffects />
    </article>
  );
}
