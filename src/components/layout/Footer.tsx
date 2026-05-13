import Link from "next/link";

interface FooterProps {
  socialLinks?: Array<{ platform: string; url: string }>;
}

export function Footer({ socialLinks = [] }: FooterProps) {
  const year = new Date().getFullYear();
  const github = socialLinks.find((l) => l.platform === "github");

  return (
    <footer className="footer">
      <div className="container-x">
        <div className="big-name" aria-hidden>
          RHAFAEL
        </div>
        <div className="footer-inner">
          <div className="copy">© {year} Rhafael. All rights reserved.</div>
          <div className="footer-links">
            <Link href="/" data-cursor="hover">Home</Link>
            <Link href="/about" data-cursor="hover">About</Link>
            <Link href="/projects" data-cursor="hover">Projects</Link>
            <Link href="/blog" data-cursor="hover">Blog</Link>
            <Link href="/contact" data-cursor="hover">Contact</Link>
            {github && (
              <a
                href={github.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
              >
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
