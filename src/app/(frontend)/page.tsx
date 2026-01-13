import { Hero, FeaturedProjects, Testimonials } from "@/components/features/home";
import { getFeaturedProjects, getSiteSettings, getFeaturedTestimonials } from "@/lib/payload";
import { PersonJsonLd, WebsiteJsonLd } from "@/components/JsonLd";

export const revalidate = 0;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rhafael.dev";

export default async function HomePage() {
  const [settings, featuredProjects, testimonials] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getFeaturedTestimonials(),
  ]);

  // Build social links array for JSON-LD
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
      />
      <FeaturedProjects projects={featuredProjects} />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
