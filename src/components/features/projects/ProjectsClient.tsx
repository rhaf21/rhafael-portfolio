"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/layout";
import { Section, SectionHeader } from "@/components/ui";
import {
  ProjectFilter,
  ProjectGrid,
  type FilterOption,
} from "@/components/features/projects";
import { FadeIn } from "@/components/animations";
import type { Project } from "@/types/project";

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <Section>
      <Container>
        <FadeIn>
          <SectionHeader
            title="Projects"
            description="A collection of my work across web development, apps, and software."
          />
        </FadeIn>

        <FadeIn delay={0.2} className="mb-12">
          <ProjectFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </FadeIn>

        <ProjectGrid projects={filteredProjects} />
      </Container>
    </Section>
  );
}
