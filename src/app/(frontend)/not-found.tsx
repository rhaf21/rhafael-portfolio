import Link from "next/link";
import { Magnetic, Arrow } from "@/components/ui";

export default function NotFound() {
  return (
    <section
      className="container-x"
      style={{
        minHeight: "calc(100vh - 4rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 0",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 640 }}>
        <div className="hero-eyebrow" data-reveal>
          <span className="dot" />
          Page not found
        </div>
        <h1
          data-reveal
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(80px, 16vw, 200px)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            margin: "32px 0 24px",
          }}
        >
          <span className="grad">404</span>
        </h1>
        <p
          className="hero-sub"
          style={{ margin: "0 auto 36px", textAlign: "center" }}
        >
          You&apos;ve wandered off the map. The page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </p>
        <div
          className="hero-cta-row"
          style={{ justifyContent: "center" }}
        >
          <Magnetic>
            <Link href="/" className="btn btn-primary">
              Back home <span className="arrow"><Arrow direction="up-right" /></span>
            </Link>
          </Magnetic>
          <Magnetic strength={0.2}>
            <Link href="/projects" className="btn btn-secondary">
              See the work <span className="arrow"><Arrow direction="right" /></span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
