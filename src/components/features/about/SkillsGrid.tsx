import type { Skill } from "@/types/common";

interface SkillsGridProps {
  skills: Skill[];
}

const defaultSkills: Skill[] = [
  { id: "d1", name: "React & Next.js", category: "frontend", proficiency: 95 },
  { id: "d2", name: "TypeScript", category: "frontend", proficiency: 90 },
  { id: "d3", name: "Shopify", category: "frontend", proficiency: 92 },
  { id: "d4", name: "WordPress", category: "backend", proficiency: 88 },
  { id: "d5", name: "Tailwind CSS", category: "frontend", proficiency: 95 },
  { id: "d6", name: "Node.js", category: "backend", proficiency: 85 },
  { id: "d7", name: "MongoDB", category: "backend", proficiency: 82 },
  { id: "d8", name: "Stripe", category: "tools", proficiency: 80 },
];

const skillDescriptions: Record<string, string> = {
  "React & Next.js": "App Router, RSC, edge runtime",
  TypeScript: "Strict mode by default",
  Shopify: "Liquid, custom themes, Hydrogen",
  WordPress: "Custom themes, ACF, Gutenberg",
  "Tailwind CSS": "Design systems at scale",
  "Node.js": "APIs, edge functions",
  MongoDB: "Aggregations, schema design",
  Stripe: "Payments, subscriptions",
};

function letterFor(name: string) {
  const parts = name.split(/\s|\.|-/).filter(Boolean);
  if (parts.length >= 2 && parts[0].length === 1) return parts[0] + parts[1][0];
  return parts[0].slice(0, 2).toUpperCase();
}

function colorFor(idx: number) {
  return idx % 2 === 0 ? "var(--accent)" : "var(--fg)";
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  const list = skills.length > 0 ? skills : defaultSkills;

  return (
    <section className="section container-x">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Toolkit</div>
          <h2 className="section-title" data-reveal>
            The stack I <span className="grad">reach for.</span>
          </h2>
        </div>
      </div>
      <div className="skills-grid">
        {list.map((skill, i) => (
          <div
            className="skill-card"
            key={skill.id}
            data-reveal
            data-delay={i * 60}
          >
            <div className="skill-icon" style={{ background: colorFor(i) }}>
              {letterFor(skill.name)}
            </div>
            <h4>{skill.name}</h4>
            <p>{skillDescriptions[skill.name] || skill.category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
