import { GlassCard } from "@/components/ui";
import type { Experience } from "@/types/common";

interface TimelineProps {
  experience: Experience[];
}

// Suppress unused-warning while keeping the type imported for future use.
void GlassCard;

const defaultTimeline: Array<{
  year: string;
  title: string;
  desc: string;
  current?: boolean;
}> = [
  {
    year: "2026",
    title: "Independent Developer",
    desc:
      "Running my own studio. Shopify rebuilds, headless WordPress, Next.js apps across e-commerce, travel, and SaaS.",
    current: true,
  },
  {
    year: "2025",
    title: "Launched BoardGameTally",
    desc:
      "Founded a multi-tenant SaaS for tracking board game scores. Real-time sync, Elo ranks, custom subdomains — runs on Next.js + MongoDB + Ably.",
  },
  {
    year: "2023",
    title: "Full-stack: React + Next.js",
    desc:
      "Added React, Next.js, and TypeScript to the toolkit. Started shipping headless WordPress and SaaS dashboards alongside e-commerce work.",
  },
  {
    year: "2021",
    title: "Expanded into WordPress",
    desc:
      "Picked up custom WordPress themes, WooCommerce, and ACF-driven editorial sites. Doubled the type of client I could take on.",
  },
  {
    year: "2019",
    title: "Freelance Shopify Developer",
    desc:
      "Started freelancing on Liquid. Built and customized Shopify themes for small DTC brands. The years that taught me how e-commerce actually converts.",
  },
];

function yearFrom(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : String(d.getFullYear());
}

export function Timeline({ experience }: TimelineProps) {
  const items =
    experience.length > 0
      ? experience.map((exp, i) => ({
          year: yearFrom(exp.startDate),
          title: `${exp.role} · ${exp.company}`,
          desc: exp.description || "",
          current: i === 0 && !exp.endDate,
        }))
      : defaultTimeline;

  return (
    <section className="section container-x">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Path</div>
          <h2 className="section-title" data-reveal>
            How I got <span className="grad">here.</span>
          </h2>
        </div>
      </div>
      <div className="timeline">
        {items.map((t, i) => (
          <div
            key={i}
            className={`timeline-item${t.current ? " current" : ""}`}
            data-reveal
            data-delay={i * 80}
          >
            <div className="yr">{t.year}</div>
            <h4>{t.title}</h4>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
