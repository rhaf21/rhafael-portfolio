import type { Experience } from "@/types/common";

interface TimelineProps {
  experience: Experience[];
}

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
      "Building Shopify, WordPress, and React projects for clients across e-commerce, travel, and SaaS.",
    current: true,
  },
  {
    year: "2024",
    title: "Launched BoardGameTally",
    desc:
      "Founded a multi-tenant SaaS for tracking board game scores. Real-time sync, Elo ranks, custom subdomains.",
  },
  {
    year: "2023",
    title: "Full-Stack Web Developer",
    desc:
      "Shipped 20+ production sites across e-commerce and content platforms. Specialized in Shopify and Next.js.",
  },
  {
    year: "2022",
    title: "Frontend Developer",
    desc:
      "Cut my teeth on React, TypeScript, and component-driven design systems.",
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
