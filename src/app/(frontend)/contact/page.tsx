import type { Metadata } from "next";
import { Container } from "@/components/layout";
import { Section, SectionHeader } from "@/components/ui";
import { ContactForm, ContactInfo } from "@/components/features/contact";
import { FadeIn } from "@/components/animations";
import { getSiteSettings } from "@/lib/payload";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with me for collaboration opportunities, project inquiries, or just to say hello.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <Section>
      <Container>
        <FadeIn>
          <SectionHeader
            title="Contact Me"
            description="Let's work together on your next project."
          />
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn delay={0.1}>
            <ContactInfo
              email={settings.email ?? undefined}
              socialLinks={settings.socialLinks}
            />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="p-6 md:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
