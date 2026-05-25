import { TechIcon, getTechIcon } from "@/components/ui/TechIcon";
import type { Skill } from "@/types/common";

interface SkillsGridProps {
  skills: Skill[];
}

const defaultSkills: Skill[] = [
  { id: "d1", name: "React", category: "frontend", proficiency: 95 },
  { id: "d2", name: "Next.js", category: "frontend", proficiency: 95 },
  { id: "d3", name: "TypeScript", category: "frontend", proficiency: 90 },
  { id: "d4", name: "Shopify", category: "frontend", proficiency: 92 },
  { id: "d5", name: "WordPress", category: "backend", proficiency: 88 },
  { id: "d6", name: "Tailwind CSS", category: "frontend", proficiency: 95 },
  { id: "d7", name: "Node.js", category: "backend", proficiency: 85 },
  { id: "d8", name: "MongoDB", category: "backend", proficiency: 82 },
  { id: "d9", name: "n8n", category: "tools", proficiency: 90 },
  { id: "d10", name: "Zapier", category: "tools", proficiency: 88 },
  { id: "d11", name: "Make", category: "tools", proficiency: 85 },
  { id: "d12", name: "Webhooks & AI Agents", category: "tools", proficiency: 88 },
];

const skillDescriptions: Record<string, string> = {
  React: "Hooks, RSC, Suspense, modern React on every build",
  "Next.js": "App Router, ISR, server actions, edge runtime",
  TypeScript: "Strict mode by default, end-to-end typed",
  Shopify: "Liquid, custom themes, Hydrogen, sections",
  WordPress: "Custom themes, ACF, headless via WPGraphQL",
  "Tailwind CSS": "Design systems at scale, v4 tokens",
  "Node.js": "APIs, edge functions, queues",
  MongoDB: "Aggregations, schema design, Atlas",
  Stripe: "Payments, subscriptions, Connect",
  GraphQL: "Schemas, federation, codegen",
  JavaScript: "Vanilla, ESM, browser primitives",
  PHP: "WordPress, WooCommerce, Laravel",
  n8n: "Self-hosted workflow automation, custom nodes",
  Zapier: "App-to-app Zaps, multi-step workflows",
  Make: "Visual scenarios, branching automation logic",
  "Webhooks & AI Agents": "Custom webhook pipelines, AI-driven agents",
};

function letterFor(name: string) {
  const parts = name.split(/[\s.\-/&]+/).filter(Boolean);
  if (parts.length >= 2 && parts[0].length === 1) return parts[0] + parts[1][0];
  return parts[0].slice(0, 2).toUpperCase();
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
        {list.map((skill, i) => {
          const hasIcon = !!getTechIcon(skill.name);
          return (
            <div
              className="skill-card"
              key={skill.id}
              data-reveal
              data-delay={i * 60}
            >
              <div className="skill-icon skill-icon--outline">
                {hasIcon ? (
                  <TechIcon name={skill.name} size={22} />
                ) : (
                  <span className="skill-icon__letter">
                    {letterFor(skill.name)}
                  </span>
                )}
              </div>
              <h4>{skill.name}</h4>
              <p>{skillDescriptions[skill.name] || skill.category}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
