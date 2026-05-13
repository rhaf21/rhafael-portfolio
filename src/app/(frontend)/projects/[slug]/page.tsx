import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects, getSiteSettings } from "@/lib/payload";
import { ProjectDetail } from "@/components/features/projects/ProjectDetail";
import { BigCTA } from "@/components/ui";

export const revalidate = 3600;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, all, settings] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  const idx = all.findIndex((p) => p.id === project.id);
  const next = all[(idx + 1) % all.length];
  const related = next && next.id !== project.id ? [next] : [];

  return (
    <>
      <ProjectDetail project={project} related={related} />
      <BigCTA email={settings.email} />
    </>
  );
}
