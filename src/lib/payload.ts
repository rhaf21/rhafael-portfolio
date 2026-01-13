import { getPayload } from "payload";
import config from "@/payload.config";
import type {
  Project as PayloadProject,
  Skill as PayloadSkill,
  Experience as PayloadExperience,
  Media,
  SiteSetting,
} from "@/payload-types";

// These types will be available after running `pnpm payload generate:types`
// For now, we use inline type definitions
interface PayloadTestimonial {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  avatar?: Media | string | null;
  quote: string;
  project?: PayloadProject | string | null;
  rating?: number | null;
  featured?: boolean | null;
  order?: number | null;
}

interface PayloadPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: Media | string | null;
  content?: unknown;
  category: "tutorial" | "case-study" | "insights" | "news" | "tips";
  tags?: { tag: string }[] | null;
  status: "draft" | "published";
  publishedAt?: string | null;
  readingTime?: number | null;
  relatedProjects?: (PayloadProject | string)[] | null;
}
import type { Project } from "@/types/project";
import type { Skill } from "@/types/common";
import type { Experience } from "@/types/common";

// Static data imports for fallback
import { getAllProjects, getFeaturedProjects as getStaticFeaturedProjects } from "@/data/projects";

let payloadClient: Awaited<ReturnType<typeof getPayload>> | null = null;

async function getPayloadClient() {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("your-username")) {
    return null;
  }

  if (payloadClient) return payloadClient;

  try {
    payloadClient = await getPayload({ config });
    return payloadClient;
  } catch (error) {
    console.warn("Failed to connect to Payload CMS, using static data:", error);
    return null;
  }
}

// Helper to get media URL
function getMediaUrl(media: Media | string | null | undefined): string | null {
  if (!media) return null;
  if (typeof media === "string") return media;
  return media.url || null;
}

// Adapters to convert Payload types to static types
function adaptProject(payloadProject: PayloadProject): Project {
  return {
    id: payloadProject.id,
    slug: payloadProject.slug,
    title: payloadProject.title,
    description: payloadProject.description,
    longDescription: payloadProject.longDescription
      ? extractTextFromLexical(payloadProject.longDescription)
      : undefined,
    category: payloadProject.category,
    techStack: payloadProject.techStack?.map((t) => t.tech) || [],
    images: payloadProject.gallery?.map(g => getMediaUrl(g.image)).filter((url): url is string => url !== null) || [],
    liveUrl: payloadProject.liveUrl || undefined,
    githubUrl: payloadProject.githubUrl || undefined,
    featured: payloadProject.featured || false,
    completedAt: payloadProject.completedAt || undefined,
    highlights: payloadProject.highlights?.map((h) => h.highlight) || undefined,
  };
}

function adaptSkill(payloadSkill: PayloadSkill): Skill {
  return {
    id: payloadSkill.id,
    name: payloadSkill.name,
    category: payloadSkill.category,
    proficiency: payloadSkill.proficiency,
  };
}

function adaptExperience(payloadExp: PayloadExperience): Experience {
  return {
    id: payloadExp.id,
    company: payloadExp.company,
    role: payloadExp.role,
    description: payloadExp.description || undefined,
    startDate: payloadExp.startDate,
    endDate: payloadExp.endDate || undefined,
    highlights: payloadExp.highlights?.map((h) => h.highlight) || undefined,
  };
}

// Helper to extract text from Lexical rich text
function extractTextFromLexical(lexicalData: unknown): string {
  if (!lexicalData || typeof lexicalData !== "object") return "";

  const data = lexicalData as {
    root?: {
      children?: Array<{
        children?: Array<{ text?: string }>;
      }>;
    };
  };

  try {
    return (
      data.root?.children
        ?.map((node) =>
          node.children?.map((child) => child.text || "").join("") || ""
        )
        .join("\n") || ""
    );
  } catch {
    return "";
  }
}

// Projects
export async function getProjects(): Promise<Project[]> {
  const payload = await getPayloadClient();

  if (!payload) {
    return getAllProjects();
  }

  try {
    const { docs } = await payload.find({
      collection: "projects",
      sort: "_order",
      limit: 100,
    });
    return docs.map(adaptProject);
  } catch (error) {
    console.warn("Failed to fetch projects from CMS:", error);
    return getAllProjects();
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const payload = await getPayloadClient();

  if (!payload) {
    return getStaticFeaturedProjects();
  }

  try {
    const { docs } = await payload.find({
      collection: "projects",
      where: {
        featured: { equals: true },
      },
      sort: "_order",
      limit: 6,
    });
    return docs.map(adaptProject);
  } catch (error) {
    console.warn("Failed to fetch featured projects from CMS:", error);
    return getStaticFeaturedProjects();
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const payload = await getPayloadClient();

  if (!payload) {
    return getAllProjects().find((p) => p.slug === slug);
  }

  try {
    const { docs } = await payload.find({
      collection: "projects",
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    });
    return docs[0] ? adaptProject(docs[0]) : undefined;
  } catch (error) {
    console.warn("Failed to fetch project by slug from CMS:", error);
    return getAllProjects().find((p) => p.slug === slug);
  }
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const payload = await getPayloadClient();

  if (!payload) {
    return getAllProjects().filter((p) => p.category === category);
  }

  try {
    const { docs } = await payload.find({
      collection: "projects",
      where: {
        category: { equals: category },
      },
      sort: "_order",
      limit: 100,
    });
    return docs.map(adaptProject);
  } catch (error) {
    console.warn("Failed to fetch projects by category from CMS:", error);
    return getAllProjects().filter((p) => p.category === category);
  }
}

// Skills
export async function getSkills(): Promise<Skill[]> {
  const payload = await getPayloadClient();

  if (!payload) {
    return [];
  }

  try {
    const { docs } = await payload.find({
      collection: "skills",
      sort: "order",
      limit: 100,
    });
    return docs.map(adaptSkill);
  } catch (error) {
    console.warn("Failed to fetch skills from CMS:", error);
    return [];
  }
}

export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  const payload = await getPayloadClient();

  if (!payload) {
    return [];
  }

  try {
    const { docs } = await payload.find({
      collection: "skills",
      where: {
        category: { equals: category },
      },
      sort: "order",
      limit: 100,
    });
    return docs.map(adaptSkill);
  } catch (error) {
    console.warn("Failed to fetch skills by category from CMS:", error);
    return [];
  }
}

// Experience
export async function getExperience(): Promise<Experience[]> {
  const payload = await getPayloadClient();

  if (!payload) {
    return [];
  }

  try {
    const { docs } = await payload.find({
      collection: "experience",
      sort: "order",
      limit: 100,
    });
    return docs.map(adaptExperience);
  } catch (error) {
    console.warn("Failed to fetch experience from CMS:", error);
    return [];
  }
}

// Site Settings
export interface SiteSettingsData {
  siteTitle: string;
  siteDescription: string;
  availableForWork: boolean;
  heroGreeting: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutContent: string;
  profileImage: string | null;
  stats: Array<{ label: string; value: string }>;
  email: string | null;
  socialLinks: Array<{ platform: string; url: string }>;
}

const defaultSiteSettings: SiteSettingsData = {
  siteTitle: "Rhafael - Portfolio",
  siteDescription: "Shopify & WordPress Developer specializing in e-commerce solutions",
  availableForWork: true,
  heroGreeting: "Hi, I'm Rhafael",
  heroTitle: "Shopify & WordPress",
  heroSubtitle: "Developer",
  heroDescription:
    "I build high-converting e-commerce stores on Shopify, custom WordPress themes, and modern React applications that drive results for businesses.",
  aboutTitle: "About Me",
  aboutContent: "",
  profileImage: null,
  stats: [
    { label: "Years Experience", value: "4+" },
    { label: "Projects Completed", value: "30+" },
    { label: "Happy Clients", value: "20+" },
  ],
  email: null,
  socialLinks: [],
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const payload = await getPayloadClient();

  if (!payload) {
    return defaultSiteSettings;
  }

  try {
    const settings = await payload.findGlobal({
      slug: "site-settings",
    }) as SiteSetting;

    return {
      siteTitle: settings.siteTitle || defaultSiteSettings.siteTitle,
      siteDescription: settings.siteDescription || defaultSiteSettings.siteDescription,
      availableForWork: settings.availableForWork ?? defaultSiteSettings.availableForWork,
      heroGreeting: settings.heroGreeting || defaultSiteSettings.heroGreeting,
      heroTitle: settings.heroTitle || defaultSiteSettings.heroTitle,
      heroSubtitle: settings.heroSubtitle || defaultSiteSettings.heroSubtitle,
      heroDescription: settings.heroDescription || defaultSiteSettings.heroDescription,
      aboutTitle: settings.aboutTitle || defaultSiteSettings.aboutTitle,
      aboutContent: settings.aboutContent
        ? extractTextFromLexical(settings.aboutContent)
        : defaultSiteSettings.aboutContent,
      profileImage: getMediaUrl(settings.profileImage),
      stats: settings.stats?.map((s) => ({ label: s.label, value: s.value })) || defaultSiteSettings.stats,
      email: settings.email || defaultSiteSettings.email,
      socialLinks:
        settings.socialLinks?.map((s) => ({ platform: s.platform, url: s.url })) ||
        defaultSiteSettings.socialLinks,
    };
  } catch (error) {
    console.warn("Failed to fetch site settings from CMS:", error);
    return defaultSiteSettings;
  }
}

export { getMediaUrl };

// Testimonial type
export interface TestimonialData {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatar: string | null;
  quote: string;
  projectId?: string;
  rating?: number;
  featured: boolean;
  order?: number;
}

// Adapt Payload testimonial to our type
function adaptTestimonial(payloadTestimonial: PayloadTestimonial): TestimonialData {
  return {
    id: payloadTestimonial.id,
    name: payloadTestimonial.name,
    role: payloadTestimonial.role || undefined,
    company: payloadTestimonial.company || undefined,
    avatar: getMediaUrl(payloadTestimonial.avatar),
    quote: payloadTestimonial.quote,
    projectId: typeof payloadTestimonial.project === "string"
      ? payloadTestimonial.project
      : payloadTestimonial.project?.id,
    rating: payloadTestimonial.rating || undefined,
    featured: payloadTestimonial.featured || false,
    order: payloadTestimonial.order || undefined,
  };
}

// Static testimonials fallback
const defaultTestimonials: TestimonialData[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc.",
    avatar: null,
    quote: "Rhafael delivered an exceptional Shopify store that exceeded our expectations. The attention to detail and performance optimization made a real difference to our conversion rates.",
    featured: true,
    rating: 5,
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Marketing Director",
    company: "GrowthCo",
    avatar: null,
    quote: "Working with Rhafael was a pleasure. They understood our vision and translated it into a beautiful, functional WordPress site that our team loves to use.",
    featured: true,
    rating: 5,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Founder",
    company: "Artisan Goods",
    avatar: null,
    quote: "The custom React application Rhafael built for us streamlined our operations significantly. Professional, responsive, and highly skilled.",
    featured: true,
    rating: 5,
  },
];

// Testimonials
export async function getTestimonials(): Promise<TestimonialData[]> {
  const payload = await getPayloadClient();

  if (!payload) {
    return defaultTestimonials;
  }

  try {
    const { docs } = await payload.find({
      collection: "testimonials" as "media", // Type assertion until types are regenerated
      sort: "order",
      limit: 100,
    });
    return (docs as unknown as PayloadTestimonial[]).map(adaptTestimonial);
  } catch (error) {
    console.warn("Failed to fetch testimonials from CMS:", error);
    return defaultTestimonials;
  }
}

export async function getFeaturedTestimonials(): Promise<TestimonialData[]> {
  const payload = await getPayloadClient();

  if (!payload) {
    return defaultTestimonials.filter(t => t.featured);
  }

  try {
    const { docs } = await payload.find({
      collection: "testimonials" as "media", // Type assertion until types are regenerated
      where: {
        featured: { equals: true },
      },
      sort: "order",
      limit: 6,
    });
    return (docs as unknown as PayloadTestimonial[]).map(adaptTestimonial);
  } catch (error) {
    console.warn("Failed to fetch featured testimonials from CMS:", error);
    return defaultTestimonials.filter(t => t.featured);
  }
}

// Blog Post type
export interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  content: string;
  category: "tutorial" | "case-study" | "insights" | "news" | "tips";
  tags: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  readingTime?: number;
  relatedProjects?: string[];
}

// Adapt Payload post to our type
function adaptPost(payloadPost: PayloadPost): PostData {
  return {
    id: payloadPost.id,
    title: payloadPost.title,
    slug: payloadPost.slug,
    excerpt: payloadPost.excerpt,
    featuredImage: getMediaUrl(payloadPost.featuredImage),
    content: payloadPost.content ? extractTextFromLexical(payloadPost.content) : "",
    category: payloadPost.category,
    tags: payloadPost.tags?.map((t: { tag: string }) => t.tag) || [],
    status: payloadPost.status,
    publishedAt: payloadPost.publishedAt || null,
    readingTime: payloadPost.readingTime || undefined,
    relatedProjects: payloadPost.relatedProjects?.map((p: PayloadProject | string) =>
      typeof p === "string" ? p : p.id
    ) || [],
  };
}

// Static posts fallback
const defaultPosts: PostData[] = [
  {
    id: "1",
    title: "Building High-Performance Shopify Stores",
    slug: "building-high-performance-shopify-stores",
    excerpt: "Learn the key techniques for optimizing Shopify store performance and improving conversion rates.",
    featuredImage: null,
    content: "Coming soon...",
    category: "tutorial",
    tags: ["Shopify", "Performance", "E-commerce"],
    status: "published",
    publishedAt: new Date().toISOString(),
    readingTime: 8,
  },
  {
    id: "2",
    title: "Modern WordPress Development with React",
    slug: "modern-wordpress-development-with-react",
    excerpt: "Exploring headless WordPress architecture and building modern frontends with React.",
    featuredImage: null,
    content: "Coming soon...",
    category: "insights",
    tags: ["WordPress", "React", "Headless CMS"],
    status: "published",
    publishedAt: new Date().toISOString(),
    readingTime: 12,
  },
];

// Posts
export async function getPosts(): Promise<PostData[]> {
  const payload = await getPayloadClient();

  if (!payload) {
    return defaultPosts;
  }

  try {
    const { docs } = await payload.find({
      collection: "posts" as "media", // Type assertion until types are regenerated
      where: {
        status: { equals: "published" },
      },
      sort: "-publishedAt",
      limit: 100,
    });
    return (docs as unknown as PayloadPost[]).map(adaptPost);
  } catch (error) {
    console.warn("Failed to fetch posts from CMS:", error);
    return defaultPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<PostData | undefined> {
  const payload = await getPayloadClient();

  if (!payload) {
    return defaultPosts.find((p) => p.slug === slug);
  }

  try {
    const { docs } = await payload.find({
      collection: "posts" as "media", // Type assertion until types are regenerated
      where: {
        slug: { equals: slug },
        status: { equals: "published" },
      },
      limit: 1,
    });
    const typedDocs = docs as unknown as PayloadPost[];
    return typedDocs[0] ? adaptPost(typedDocs[0]) : undefined;
  } catch (error) {
    console.warn("Failed to fetch post by slug from CMS:", error);
    return defaultPosts.find((p) => p.slug === slug);
  }
}

export async function getPostsByCategory(category: string): Promise<PostData[]> {
  const payload = await getPayloadClient();

  if (!payload) {
    return defaultPosts.filter((p) => p.category === category);
  }

  try {
    const { docs } = await payload.find({
      collection: "posts" as "media", // Type assertion until types are regenerated
      where: {
        category: { equals: category },
        status: { equals: "published" },
      },
      sort: "-publishedAt",
      limit: 100,
    });
    return (docs as unknown as PayloadPost[]).map(adaptPost);
  } catch (error) {
    console.warn("Failed to fetch posts by category from CMS:", error);
    return defaultPosts.filter((p) => p.category === category);
  }
}
