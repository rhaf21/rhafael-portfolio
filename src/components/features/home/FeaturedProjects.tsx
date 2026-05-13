import Link from "next/link";
import { Magnetic, Marquee, Arrow } from "@/components/ui";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import type { Project } from "@/types/project";

interface FeaturedProjectsProps {
  projects: Project[];
}

const defaultMarquee = [
  { text: "Shopify" },
  { text: "Next.js", italic: true },
  { text: "WordPress" },
  { text: "React" },
  { text: "TypeScript", italic: true },
  { text: "Tailwind" },
  { text: "Liquid" },
  { text: "Sanity", italic: true },
  { text: "MongoDB" },
];

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <>
      <Marquee items={defaultMarquee} />

      <section className="section container-x">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">Selected work</div>
            <h2 className="section-title" data-reveal>
              Recent projects, <span className="grad">crafted</span> with care.
            </h2>
          </div>
          <p className="section-meta" data-reveal>
            A selection of e-commerce stores, content sites, and SaaS products
            from the last two years.
          </p>
        </div>

        <div className="projects-grid style-stack">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} idx={i} variant="large" />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Magnetic strength={0.2}>
            <Link href="/projects" className="btn btn-secondary">
              View all projects <span className="arrow"><Arrow direction="right" /></span>
            </Link>
          </Magnetic>
        </div>
      </section>
    </>
  );
}
