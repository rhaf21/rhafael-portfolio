import type { Metadata } from "next";
import { Container } from "@/components/layout";
import { Section } from "@/components/ui";
import { Background } from "@/components/features/about";
import { getSiteSettings } from "@/lib/payload";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about my background, skills, and experience as a full-stack developer.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <Section>
      <Container>
        <Background title={settings.aboutTitle} stats={settings.stats} profileImage={settings.profileImage} />
      </Container>
    </Section>
  );
}
