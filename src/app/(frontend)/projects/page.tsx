import type { Metadata } from "next";
import { ProjectsClient } from "@/components/features/projects/ProjectsClient";
import { getProjects } from "@/lib/payload";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of my work across Shopify, WordPress, and React development.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsClient projects={projects} />;
}
