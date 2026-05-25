import Link from "next/link";
import { Magnetic, Arrow } from "@/components/ui";
import { SplitWords } from "@/components/animations";

interface HeroProps {
  greeting?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  availableForWork?: boolean;
  stats?: Array<{ label: string; value: string }>;
}

const defaultStats = [
  { value: "7+", label: "Years building" },
  { value: "50+", label: "Projects shipped" },
  { value: "30+", label: "Happy clients" },
  { value: "30%+", label: "Avg conversion lift" },
];

function parseStat(value: string): { num: string; plus: string } {
  const match = value.match(/^([\d.,]+)(.*)$/);
  if (!match) return { num: value, plus: "" };
  return { num: match[1], plus: match[2] };
}

export function Hero({
  greeting = "Hi, I'm Rhafael.",
  title = "Shopify & WordPress",
  subtitle = "Developer & Automation Specialist",
  description = "I build high-converting Shopify and WordPress stores, modern React applications, and automation systems that connect your tools and take the busywork off your plate.",
  availableForWork = true,
  stats,
}: HeroProps) {
  const heroStats = stats?.length ? stats : defaultStats;

  return (
    <section className="hero container-x">
      <div className="hero-eyebrow" data-reveal>
        <span className="dot" />
        {availableForWork ? "Available for new projects · Q2 2026" : "Currently booked · Q3 2026"}
      </div>

      <h1>
        <span className="stack">
          <SplitWords text={greeting} delay={100} />
        </span>
        <br />
        <span className="stack">
          <SplitWords text="I build" delay={300} />
          <span className="grad" style={{ display: "inline-block" }}>
            <SplitWords text="high-converting" delay={450} />
          </span>
          <SplitWords text="experiences" delay={650} />
        </span>
        <br />
        <span className="stack">
          <SplitWords text="and" delay={800} />
          <span className="grad" style={{ display: "inline-block" }}>
            <SplitWords text="automation" delay={900} />
          </span>
          <SplitWords text="that runs itself." delay={1050} />
        </span>
      </h1>

      <p className="hero-sub" data-reveal data-delay="1200">
        {description}
      </p>

      <div className="hero-cta-row" data-reveal data-delay="1350">
        <Magnetic>
          <Link href="/projects" className="btn btn-primary">
            View my work <span className="arrow"><Arrow direction="up-right" /></span>
          </Link>
        </Magnetic>
        <Magnetic strength={0.2}>
          <Link href="/contact" className="btn btn-secondary">
            Get in touch <span className="arrow"><Arrow direction="right" /></span>
          </Link>
        </Magnetic>
      </div>

      <div className="hero-meta">
        {heroStats.map((s, i) => {
          const { num, plus } = parseStat(s.value);
          return (
            <div
              className="stat"
              key={i}
              data-reveal
              data-delay={1450 + i * 100}
            >
              <div className="num">
                {num}
                <span className="plus">{plus}</span>
              </div>
              <div className="label">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Hidden fields preserved from CMS (subtitle/title used only when present in default fallback) */}
      <span className="sr-only">
        {title} {subtitle}
      </span>
    </section>
  );
}
