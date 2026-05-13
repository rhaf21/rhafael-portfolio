"use client";

import { useState, useMemo } from "react";
import {
  ProjectFilter,
  ProjectGrid,
  type FilterOption,
} from "@/components/features/projects";
import type { Project } from "@/types/project";

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [filter, setFilter] = useState<FilterOption>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter, projects]);

  return (
    <>
      <section className="projects-page-hero container-x">
        <div className="hero-eyebrow" data-reveal>
          <span className="dot" />
          {projects.length} projects shown
        </div>
        <h1
          className="section-title"
          data-reveal
          style={{
            fontSize: "clamp(48px, 8vw, 120px)",
            maxWidth: "none",
            marginTop: 32,
          }}
        >
          A library of <span className="grad">my work.</span>
        </h1>
        <ProjectFilter activeFilter={filter} onFilterChange={setFilter} />
      </section>

      <section className="container-x" style={{ paddingBottom: 80 }}>
        <ProjectGrid projects={filtered} />
      </section>
    </>
  );
}
