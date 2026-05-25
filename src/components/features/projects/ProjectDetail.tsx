"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { Magnetic, Arrow } from "@/components/ui";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types/project";

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|avi|mkv|ogg)/i.test(url);
}

function formatDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

function MediaModal({
  items,
  index,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: {
  items: { src: string; alt: string }[];
  index: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = items[index];

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !current) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.94)",
        backdropFilter: "blur(8px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        data-cursor="hover"
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          width: 44,
          height: 44,
          borderRadius: 999,
          border: "1px solid var(--line-strong)",
          background: "rgba(255,255,255,0.04)",
          color: "var(--fg)",
          fontSize: 18,
        }}
      >
        ✕
      </button>
      <div
        style={{
          position: "relative",
          maxWidth: "min(1200px, 92vw)",
          maxHeight: "88vh",
          width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo(current.src) ? (
          <video
            ref={videoRef}
            src={current.src}
            controls
            autoPlay
            loop
            playsInline
            style={{
              width: "100%",
              maxHeight: "88vh",
              objectFit: "contain",
              borderRadius: 16,
            }}
          />
        ) : (
          <div style={{ position: "relative", width: "100%", height: "88vh" }}>
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="92vw"
              style={{ objectFit: "contain", borderRadius: 16 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectDetailProps {
  project: Project;
  related?: Project[];
}

export function ProjectDetail({ project, related = [] }: ProjectDetailProps) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const next = related[0];

  const items = (project.images || []).map((src, i) => ({
    src,
    alt: `${project.title} ${isVideo(src) ? "video" : "screenshot"} ${i + 1}`,
  }));

  const close = useCallback(() => setModalIndex(null), []);
  const goNext = useCallback(() => {
    if (modalIndex === null) return;
    setModalIndex((i) => (i === null ? 0 : (i + 1) % items.length));
  }, [modalIndex, items.length]);
  const goPrev = useCallback(() => {
    if (modalIndex === null) return;
    setModalIndex((i) =>
      i === null ? 0 : (i - 1 + items.length) % items.length
    );
  }, [modalIndex, items.length]);

  const year = project.completedAt
    ? new Date(project.completedAt).getFullYear().toString()
    : "-";

  return (
    <>
      <MediaModal
        items={items}
        index={modalIndex ?? 0}
        isOpen={modalIndex !== null}
        onClose={close}
        onNext={goNext}
        onPrev={goPrev}
      />

      <section className="detail-hero container-x">
        <Link href="/projects" className="back-link" data-cursor="hover">
          ← Back to all projects
        </Link>
        <span className="pill">
          <span className="swatch" />
          {project.category}
        </span>
        <h1 data-reveal>{project.title}</h1>
        <p className="lede" data-reveal data-delay="100">
          {project.description}
        </p>
        <div className="hero-cta-row">
          {project.liveUrl && (
            <Magnetic>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                data-cursor="hover"
              >
                Visit live site <span className="arrow"><Arrow direction="up-right" /></span>
              </a>
            </Magnetic>
          )}
          {project.githubUrl && (
            <Magnetic strength={0.2}>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                data-cursor="hover"
              >
                Source code <span className="arrow"><Arrow direction="right" /></span>
              </a>
            </Magnetic>
          )}
        </div>
        <div className="detail-meta">
          <div className="m">
            <div className="k">Year</div>
            <div className="v">{year}</div>
          </div>
          <div className="m">
            <div className="k">Role</div>
            <div className="v">Lead Developer</div>
          </div>
          <div className="m">
            <div className="k">Category</div>
            <div className="v" style={{ textTransform: "capitalize" }}>
              {project.category}
            </div>
          </div>
          <div className="m">
            <div className="k">Stack</div>
            <div className="v">{project.techStack.slice(0, 2).join(", ")}</div>
          </div>
        </div>
      </section>

      {items[0] && (
        <section className="container-x">
          <button
            type="button"
            className="detail-shot"
            data-reveal
            data-cursor="hover"
            onClick={() => setModalIndex(0)}
            style={{
              padding: 0,
              border: "1px solid var(--line)",
              cursor: "inherit",
              width: "100%",
              background: "var(--surface)",
            }}
          >
            <Image
              src={items[0].src}
              alt={items[0].alt}
              width={1600}
              height={1000}
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
            />
          </button>
        </section>
      )}

      {project.demoVideo && (
        <section className="container-x">
          <div className="detail-shot" data-reveal>
            <video
              src={project.demoVideo}
              controls
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </section>
      )}

      {items.length > 1 && (
        <section className="container-x" style={{ marginBottom: 60 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {items.slice(1).map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setModalIndex(i + 1)}
                data-cursor="hover"
                style={{
                  position: "relative",
                  aspectRatio: "16 / 10",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  border: "1px solid var(--line)",
                  background: "var(--surface)",
                  padding: 0,
                  cursor: "inherit",
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="container-x">
        {project.longDescription && (
          <div className="detail-body">
            <div className="label">Overview</div>
            <div className="copy" data-reveal>
              <h3>The brief.</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{project.longDescription}</p>
            </div>
          </div>
        )}

        {project.highlights && project.highlights.length > 0 && (
          <div className="detail-body">
            <div className="label">Highlights</div>
            <div className="copy" data-reveal>
              <h3>What I solved.</h3>
              <ul>
                {project.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="detail-body">
          <div className="label">Stack</div>
          <div className="copy" data-reveal>
            <div className="stack-row">
              {project.techStack.map((s) => (
                <span
                  key={s}
                  className="tag"
                  style={{ fontSize: 13, padding: "6px 12px" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {next && (
        <section className="section container-x">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Up next</div>
              <h2 className="section-title" data-reveal>
                {next.title} <span className="grad">→</span>
              </h2>
            </div>
          </div>
          <ProjectCard project={next} idx={0} variant="large" />
        </section>
      )}
    </>
  );
}
