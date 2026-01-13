"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Section, Badge } from "@/components/ui";
import { Container } from "@/components/layout";
import { FadeIn } from "@/components/animations";
import type { Project } from "@/types/project";

// Helper to check if a URL is a video
function isVideo(url: string): boolean {
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".ogg"];
  const lowercaseUrl = url.toLowerCase();
  return videoExtensions.some((ext) => lowercaseUrl.includes(ext));
}

// Modal component for fullscreen media view with navigation
function MediaModal({
  mediaItems,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: {
  mediaItems: { src: string; alt: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = mediaItems[currentIndex];
  const hasMultiple = mediaItems.length > 1;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, onNext, onPrev]);

  // Auto-play video when modal opens or media changes
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    }
  }, [isOpen, currentIndex]);

  if (!current) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 md:p-8"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-primary-500/30 transition-colors group"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white group-hover:text-primary-400"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Counter */}
          {hasMultiple && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
              {currentIndex + 1} / {mediaItems.length}
            </div>
          )}

          {/* Previous button */}
          {hasMultiple && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-primary-500/30 transition-all group hover:scale-110"
              aria-label="Previous media"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white group-hover:text-primary-400"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {hasMultiple && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-primary-500/30 transition-all group hover:scale-110"
              aria-label="Next media"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white group-hover:text-primary-400"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Media content */}
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-7xl w-full max-h-[90vh]"
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
                className="w-full h-full max-h-[90vh] object-contain rounded-lg"
              />
            ) : (
              <div className="relative w-full h-[90vh]">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  className="object-contain rounded-lg"
                  sizes="100vw"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Media item component that handles both images and videos
function MediaItem({
  src,
  alt,
  index,
  onClick,
}: {
  src: string;
  alt: string;
  index: number;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (isVideo(src)) {
    return (
      <motion.div
        className="relative aspect-video rounded-lg overflow-hidden bg-[var(--border)] cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Play icon overlay - hidden when playing */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-black ml-1"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative aspect-video rounded-lg overflow-hidden bg-[var(--border)] cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
    </motion.div>
  );
}

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const formattedDate = project.completedAt
    ? new Date(project.completedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  // Build media items array with alt text
  const mediaItems = (project.images || []).map((src, index) => ({
    src,
    alt: `${project.title} ${isVideo(src) ? "video" : "screenshot"} ${index + 1}`,
  }));

  const openModal = useCallback((index: number) => {
    setModalIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setModalIndex(null);
  }, []);

  const goToNext = useCallback(() => {
    if (modalIndex !== null) {
      setModalIndex((prev) => (prev !== null ? (prev + 1) % mediaItems.length : 0));
    }
  }, [modalIndex, mediaItems.length]);

  const goToPrev = useCallback(() => {
    if (modalIndex !== null) {
      setModalIndex((prev) => (prev !== null ? (prev - 1 + mediaItems.length) % mediaItems.length : 0));
    }
  }, [modalIndex, mediaItems.length]);

  return (
    <>
    {/* Media Modal */}
    <MediaModal
      mediaItems={mediaItems}
      currentIndex={modalIndex ?? 0}
      isOpen={modalIndex !== null}
      onClose={closeModal}
      onNext={goToNext}
      onPrev={goToPrev}
    />

    <Section>
      <Container size="lg">
        {/* Back Link */}
        <FadeIn>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
        </FadeIn>

        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="mb-8">
            <Badge variant="primary" className="capitalize mb-4">
              {project.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-[var(--muted)] mb-4">
              {project.description}
            </p>
            {formattedDate && (
              <p className="text-sm text-[var(--muted)]">
                Completed: {formattedDate}
              </p>
            )}
          </div>
        </FadeIn>

        {/* Media Gallery (Images & Videos) */}
        {project.images && project.images.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="mb-12">
              <div
                className={`grid gap-4 ${
                  project.images.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {project.images.map((media, index) => (
                  <MediaItem
                    key={index}
                    src={media}
                    alt={mediaItems[index]?.alt || ""}
                    index={index}
                    onClick={() => openModal(index)}
                  />
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Long Description */}
        {project.longDescription && (
          <FadeIn delay={0.3}>
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
              <p className="text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
                {project.longDescription}
              </p>
            </div>
          </FadeIn>
        )}

        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <FadeIn delay={0.4}>
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="capitalize">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <FadeIn delay={0.5}>
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Key Highlights</h2>
              <ul className="space-y-3">
                {project.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-[var(--muted)]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mt-0.5 flex-shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        )}

        {/* Action Buttons */}
        {(project.liveUrl || project.githubUrl) && (
          <FadeIn delay={0.6}>
            <div className="flex flex-wrap gap-4">
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View Live Site
                </motion.a>
              )}
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--card)] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View Source Code
                </motion.a>
              )}
            </div>
          </FadeIn>
        )}
      </Container>
    </Section>
    </>
  );
}
