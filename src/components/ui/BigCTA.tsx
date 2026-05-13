import Link from "next/link";
import { Magnetic } from "./Magnetic";
import { Arrow } from "./Arrow";

interface BigCTAProps {
  email?: string | null;
}

export function BigCTA({ email }: BigCTAProps = {}) {
  const mailto = `mailto:${email || "hi@rhafael.dev"}`;
  return (
    <section className="section">
      <div className="container-x">
        <div className="big-cta" data-reveal>
          <h2>
            Have a project in <span className="grad">mind?</span>
          </h2>
          <p>
            I work with founders and teams to ship fast, beautiful, and
            high-converting web experiences.
          </p>
          <div className="cta-actions">
            <Magnetic>
              <Link href="/contact" className="btn btn-primary">
                Start a project <span className="arrow"><Arrow direction="up-right" /></span>
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href={mailto} className="btn btn-secondary" data-cursor="hover">
                Email me <span className="arrow"><Arrow direction="right" /></span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
