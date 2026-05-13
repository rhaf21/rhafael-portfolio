interface ContactInfoProps {
  email?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

const labels: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
  instagram: "Instagram",
  dribbble: "Dribbble",
};

export function ContactInfo({ email, socialLinks = [] }: ContactInfoProps) {
  return (
    <aside className="contact-info" data-reveal data-delay="200">
      <h3 style={{ marginTop: 0, fontSize: 22, fontWeight: 500 }}>
        Other ways to reach me
      </h3>
      <div className="channel">
        <span className="k">Email</span>
        <span className="v">
          <a href={`mailto:${email || "hi@rhafael.dev"}`} data-cursor="hover">
            {email || "hi@rhafael.dev"}
          </a>
        </span>
      </div>
      {socialLinks.map((link) => (
        <div className="channel" key={link.platform}>
          <span className="k">{labels[link.platform] || link.platform}</span>
          <span className="v">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
            >
              Visit ↗
            </a>
          </span>
        </div>
      ))}
      <div className="channel">
        <span className="k">Response time</span>
        <span className="v">Under 24 hours</span>
      </div>
      <p
        style={{
          marginTop: 32,
          color: "var(--fg-mute)",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        Best for: Shopify themes & customizations, WordPress development,
        Next.js / React applications, and SaaS MVPs.
      </p>
    </aside>
  );
}
