import type { Metadata } from "next";
import { ProjectsClient } from "@/components/features/projects/ProjectsClient";
import { BigCTA } from "@/components/ui";
import { getProjects, getSiteSettings } from "@/lib/payload";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A library of work across Shopify, WordPress, and React.",
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSiteSettings(),
  ]);

  return (
    <>
      <ProjectsClient projects={projects} />
      <BigCTA email={settings.email} />
    </>
  );
}
