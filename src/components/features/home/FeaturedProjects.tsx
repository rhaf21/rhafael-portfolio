"use client";

import Link from "next/link";
import { Container } from "@/components/layout";
import { Button, Section, SectionHeader } from "@/components/ui";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import type { Project } from "@/types/project";

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <Section className="bg-[var(--card)]">
      <Container>
        <FadeIn>
          <SectionHeader
            title="Featured Projects"
            description="A selection of my recent work in web and software development."
          />
        </FadeIn>

        <StaggerContainer className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.4} className="mt-12 text-center">
          <Link href="/projects">
            <Button variant="outline" size="lg">
              View All Projects
            </Button>
          </Link>
        </FadeIn>
      </Container>
    </Section>
  );
}
