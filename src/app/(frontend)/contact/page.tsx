import type { Metadata } from "next";
import { ContactForm, ContactInfo } from "@/components/features/contact";
import { getSiteSettings } from "@/lib/payload";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch — Shopify, WordPress, and React projects. I reply within 24 hours.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="contact-hero container-x">
        <div className="hero-eyebrow" data-reveal>
          <span className="dot" />
          Currently accepting projects
        </div>
        <h1
          className="section-title"
          data-reveal
          style={{
            fontSize: "clamp(48px, 8vw, 120px)",
            maxWidth: "none",
            marginTop: 32,
          }}
        >
          Let&apos;s build <span className="grad">something.</span>
        </h1>
        <p className="hero-sub" data-reveal data-delay="100">
          Tell me a bit about your project. I usually reply within 24 hours.
        </p>
      </section>

      <section className="container-x" style={{ paddingBottom: 100 }}>
        <div className="contact-grid">
          <ContactForm />
          <ContactInfo
            email={settings.email ?? undefined}
            socialLinks={settings.socialLinks}
          />
        </div>
      </section>
    </>
  );
}
