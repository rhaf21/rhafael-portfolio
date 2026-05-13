"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div
        style={{
          padding: "64px 0",
          textAlign: "center",
          color: "var(--fg-mute)",
          fontSize: 14,
        }}
      >
        No projects in this category yet — check back soon.
      </div>
    );
  }

  return (
    <div className="projects-index">
      {projects.map((p, i) => (
        <Link
          key={p.slug}
          href={`/projects/${p.slug}`}
          className="project-row"
          data-cursor="hover"
        >
          <span className="idx">{String(i + 1).padStart(2, "0")}</span>
          <span className="name">{p.title}</span>
          <span className="desc-r">
            {p.description.length > 80
              ? `${p.description.slice(0, 80)}…`
              : p.description}
          </span>
          <span className="stacks">
            {p.techStack.slice(0, 3).map((s) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </span>
          <span className="arrow-r">↗</span>
          {p.images?.[0] && (
            <span className="preview">
              <Image
                src={p.images[0]}
                alt={p.title}
                fill
                sizes="240px"
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
