"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  idx?: number;
  variant?: "large" | "compact";
}

export function ProjectCard({ project, idx = 0, variant = "large" }: ProjectCardProps) {
  const accent = "var(--accent)";
  const detailHref = `/projects/${project.slug}`;
  const image = project.images?.[0];

  const handleLive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (project.liveUrl) {
      window.open(project.liveUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (variant === "compact") {
    return (
      <Link
        href={detailHref}
        className="project-card compact"
        data-reveal
        data-delay={idx * 80}
        data-cursor="hover"
      >
        <div className="imgwrap" style={{ aspectRatio: "16 / 10" }}>
          {image ? (
            <Image
              src={image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                color: "var(--fg-mute)",
                fontSize: 48,
                fontWeight: 500,
              }}
            >
              {project.title.charAt(0)}
            </div>
          )}
        </div>
        <div className="info">
          <div className="info-top">
            <span className="pill">
              <span className="swatch" style={{ background: accent }} />
              {project.category}
            </span>
            <h3>{project.title}</h3>
            <p className="desc">{project.description}</p>
            <div className="stack-row">
              {project.techStack.slice(0, 4).map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="info-bottom">
            <span className="case-link">
              View case <span>→</span>
            </span>
            {project.liveUrl && (
              <span
                className="live-link"
                role="link"
                data-cursor="hover"
                onClick={handleLive}
              >
                Live ↗
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={detailHref}
      className="project-card large"
      data-reveal
      data-delay={idx * 80}
      data-cursor="hover"
    >
      <div className="info">
        <div className="info-top">
          <span className="pill">
            <span className="swatch" style={{ background: accent }} />
            {project.category}
          </span>
          <h3>{project.title}</h3>
          <p className="desc">{project.description}</p>
          <div className="stack-row">
            {project.techStack.map((s) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="info-bottom">
          <span className="case-link">
            View case study <span>→</span>
          </span>
          {project.liveUrl && (
            <span
              className="live-link"
              role="link"
              data-cursor="hover"
              onClick={handleLive}
            >
              Live demo ↗
            </span>
          )}
        </div>
      </div>
      <div className="imgwrap">
        {image ? (
          <Image
            src={image}
            alt={project.title}
            fill
            sizes="(max-width: 900px) 100vw, 60vw"
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "var(--fg-mute)",
              fontSize: 64,
              fontWeight: 500,
            }}
          >
            {project.title.charAt(0)}
          </div>
        )}
      </div>
    </Link>
  );
}
