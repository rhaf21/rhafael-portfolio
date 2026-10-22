import Link from "next/link";
import { footerItems, UPWORK_URL } from "@/data/navigation";

interface FooterProps {
  email: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

export function Footer({ email, socialLinks = [] }: FooterProps) {
  const github = socialLinks.find((l) => l.platform === "github");
  const linkedin = socialLinks.find((l) => l.platform === "linkedin");

  return (
    <footer className="ftr">
      <div className="wrap ftr-in">
        <Link className="wm" href="/">
          Rhafael Corpuz<i aria-hidden />
        </Link>
        <span className="ftr-contact mono">
          <a href={`mailto:${email}`}>{email}</a> · async across US, UK, AU
        </span>
        <nav className="ftr-links" aria-label="Footer">
          {footerItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a href="/resume.pdf" target="_blank" rel="noopener">
            Resume (PDF)
          </a>
          <a href={UPWORK_URL} rel="me noopener" target="_blank">
            Upwork
          </a>
          {github && (
            <a href={github.url} rel="me noopener" target="_blank">
              GitHub
            </a>
          )}
          {linkedin && (
            <a href={linkedin.url} rel="me noopener" target="_blank">
              LinkedIn
            </a>
          )}
        </nav>
      </div>
    </footer>
  );
}
