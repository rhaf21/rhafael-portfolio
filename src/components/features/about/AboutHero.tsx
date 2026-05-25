interface AboutHeroProps {
  title: string;
  profileImage?: string | null;
  stats?: Array<{ label: string; value: string }>;
}

export function AboutHero({ title }: AboutHeroProps) {
  return (
    <section className="about-hero container-x">
      <div className="hero-eyebrow" data-reveal>
        <span className="dot" />
        About me
      </div>
      <h1 data-reveal>
        A developer and automation specialist who cares about{" "}
        <span className="grad">{title.toLowerCase().includes("about") ? "craft, speed, and outcomes." : title + "."}</span>
      </h1>
    </section>
  );
}
