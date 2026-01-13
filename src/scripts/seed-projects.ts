import { getPayload } from "payload";
import config from "../payload.config";

const projects = [
  {
    title: "Cherries Official",
    slug: "cherries-official",
    description:
      "Premium lifestyle brand e-commerce store specializing in scent-infused phone cases and mobile accessories with a bold, playful aesthetic.",
    category: "shopify" as const,
    techStack: [
      { tech: "shopify" },
      { tech: "liquid" },
      { tech: "javascript" },
      { tech: "css" },
    ],
    liveUrl: "https://cherriesofficial.com/",
    featured: true,
    completedAt: "2024-06-01",
  },
  {
    title: "Side Routes",
    slug: "side-routes",
    description:
      "Travel tour company website offering curated walking tours, food experiences, and cultural activities across European cities with a focus on slow, soulful travel.",
    category: "wordpress" as const,
    techStack: [
      { tech: "wordpress" },
      { tech: "php" },
      { tech: "css" },
      { tech: "javascript" },
    ],
    liveUrl: "https://sideroutes.com/",
    featured: true,
    completedAt: "2024-08-15",
  },
  {
    title: "Carpe Diem Tours",
    slug: "carpe-diem-tours",
    description:
      "Experiential travel company platform featuring guided tours and immersive activities throughout Italy and Europe, built with modern web technologies.",
    category: "react" as const,
    techStack: [
      { tech: "nextjs" },
      { tech: "typescript" },
      { tech: "tailwind" },
      { tech: "react" },
    ],
    liveUrl: "https://carpediemtours.com/",
    featured: true,
    completedAt: "2024-11-01",
  },
];

async function seed() {
  console.log("Starting project seed...");

  const payload = await getPayload({ config });

  for (const project of projects) {
    // Check if project already exists
    const existing = await payload.find({
      collection: "projects",
      where: {
        slug: { equals: project.slug },
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      console.log(`Project "${project.title}" already exists, skipping...`);
      continue;
    }

    // Create the project
    await payload.create({
      collection: "projects",
      data: project,
    });

    console.log(`Created project: ${project.title}`);
  }

  console.log("Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
