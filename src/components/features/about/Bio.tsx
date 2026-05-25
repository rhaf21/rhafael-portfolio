interface BioProps {
  content?: string;
  email?: string | null;
  stats?: Array<{ label: string; value: string }>;
}

const fallback = [
  "I'm Rhafael, a full-stack developer. I build e-commerce stores, content platforms, and SaaS products for founders and growing teams.",
  "My focus is on the unglamorous things that matter: page speed, conversion-friendly UX, code that the next developer can read, and shipping on the date we agreed on.",
  "I started with WordPress and PHP, fell in love with the React ecosystem, and now spend most of my time in Next.js, TypeScript, and Shopify Liquid.",
  "A growing part of my work is automation. I wire tools together with n8n, Zapier, and Make, build custom webhook pipelines, and add AI agents where they genuinely save time. If your team is repeating the same task every morning, that is usually the thing I can take off your plate.",
];

export function Bio({ content, email, stats = [] }: BioProps) {
  const paragraphs = content?.trim()
    ? content.split(/\n\s*\n|\n/).filter((p) => p.trim().length > 0)
    : fallback;

  return (
    <section className="section container-x">
      <div className="about-grid">
        <div className="bio" data-reveal>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <aside className="fact-card" data-reveal data-delay="200">
          {stats.slice(0, 4).map((s, i) => (
            <div className="row" key={`stat-${i}`}>
              <span className="k">{s.label}</span>
              <span className="v">{s.value}</span>
            </div>
          ))}
          <div className="row">
            <span className="k">Currently</span>
            <span className="v">Independent · Open to work</span>
          </div>
          {email && (
            <div className="row">
              <span className="k">Email</span>
              <span className="v">{email}</span>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
