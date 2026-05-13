import type { Metadata } from "next";
import {
  AboutHero,
  Bio,
  SkillsGrid,
  Timeline,
} from "@/components/features/about";
import { BigCTA } from "@/components/ui";
import { getSiteSettings, getSkills, getExperience } from "@/lib/payload";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "About",
  description:
    "Background, capabilities, and experience — Shopify, WordPress, and React.",
};

export default async function AboutPage() {
  const [settings, skills, experience] = await Promise.all([
    getSiteSettings(),
    getSkills(),
    getExperience(),
  ]);

  return (
    <>
      <AboutHero
        title={settings.aboutTitle}
        profileImage={settings.profileImage}
        stats={settings.stats}
      />
      <Bio
        content={settings.aboutContent}
        email={settings.email}
        stats={settings.stats}
      />
      <SkillsGrid skills={skills} />
      <Timeline experience={experience} />
      <BigCTA email={settings.email} />
    </>
  );
}
