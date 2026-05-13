import { Hero, FeaturedProjects, Testimonials } from "@/components/features/home";
import { BigCTA } from "@/components/ui";
import {
  getFeaturedProjects,
  getProjects,
  getSiteSettings,
  getFeaturedTestimonials,
} from "@/lib/payload";
import { PersonJsonLd, WebsiteJsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rhafael.dev";

export default async function HomePage() {
  const [settings, featuredProjects, allProjects, testimonials] =
    await Promise.all([
      getSiteSettings(),
      getFeaturedProjects(),
      getProjects(),
      getFeaturedTestimonials(),
    ]);

  // Fall back to the most recent projects if none are explicitly marked featured.
  const heroProjects =
    featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 4);

  const sameAs = settings.socialLinks
    .filter((link) => link.url)
    .map((link) => link.url);

  return (
    <>
      <WebsiteJsonLd
        name={settings.siteTitle}
        description={settings.siteDescription}
        url={BASE_URL}
      />
      <PersonJsonLd
        name="Rhafael"
        jobTitle="Full-Stack Developer"
        description={settings.siteDescription}
        url={BASE_URL}
        image={settings.profileImage || undefined}
        sameAs={sameAs}
      />
      <Hero
        greeting={settings.heroGreeting}
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        description={settings.heroDescription}
        availableForWork={settings.availableForWork}
        stats={settings.stats}
      />
      <FeaturedProjects projects={heroProjects} />
      <Testimonials testimonials={testimonials} />
      <BigCTA email={settings.email} />
    </>
  );
}
