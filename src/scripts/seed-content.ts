/**
 * Seed content into Payload CMS:
 *   - Updates SiteSettings.stats with the new 4-stat row.
 *   - Inserts the markdown posts under content/blog/ into the Posts collection,
 *     converting their markdown body to Lexical rich text.
 *
 * Run with:  npm run seed:content
 * Only some posts:  npm run seed:content -- --only how-to-use-claude-code,another-slug
 */

import { getPayload } from "payload";
import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns";

import payloadConfig from "../payload.config";
import { mdToLexical, parseFrontmatter } from "../lib/markdown";

dns.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1", "8.8.4.4"]);

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────
async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const blogDir = join(here, "..", "..", "content", "blog");

  console.log("→ Initializing Payload…");
  const payload = await getPayload({ config: payloadConfig });

  // --only seeds just those posts and leaves site settings and skills alone.
  const onlyArg = process.argv.indexOf("--only");
  const only =
    onlyArg > -1
      ? new Set((process.argv[onlyArg + 1] ?? "").split(",").filter(Boolean))
      : null;

  if (!only) {
    // 1. Update SiteSettings stats
    console.log("→ Updating SiteSettings.stats…");
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        heroSubtitle: "Developer & Automation Specialist",
        heroDescription:
          "I build high-converting Shopify and WordPress stores, modern React applications, and automation systems that connect your tools and take the busywork off your plate.",
        stats: [
          { label: "Years building", value: "7+" },
          { label: "Projects shipped", value: "50+" },
          { label: "Happy clients", value: "30+" },
          { label: "Avg conversion lift", value: "30%+" },
        ],
      },
    });
    console.log("  ✓ stats + hero copy updated");

    // 1b. Seed the toolkit skills (idempotent by name) so the About "stack I
    //     reach for" grid is fully populated in production. The core stack must
    //     be present too: once *any* skill exists, SkillsGrid stops falling back
    //     to its hardcoded defaults, so seeding only the automation tools would
    //     otherwise hide React/Next/etc.
    console.log("→ Seeding toolkit skills…");
    const toolkitSkills = [
      { name: "React", category: "frontend", proficiency: 95, order: 1 },
      { name: "Next.js", category: "frontend", proficiency: 95, order: 2 },
      { name: "TypeScript", category: "frontend", proficiency: 90, order: 3 },
      { name: "Shopify", category: "frontend", proficiency: 92, order: 4 },
      { name: "WordPress", category: "backend", proficiency: 88, order: 5 },
      { name: "Tailwind CSS", category: "frontend", proficiency: 95, order: 6 },
      { name: "Node.js", category: "backend", proficiency: 85, order: 7 },
      { name: "MongoDB", category: "backend", proficiency: 82, order: 8 },
      { name: "n8n", category: "tools", proficiency: 90, order: 20 },
      { name: "Zapier", category: "tools", proficiency: 88, order: 21 },
      { name: "Make", category: "tools", proficiency: 85, order: 22 },
      {
        name: "Webhooks & AI Agents",
        category: "tools",
        proficiency: 88,
        order: 23,
      },
    ] as const;

    for (const skill of toolkitSkills) {
      const existing = await payload.find({
        collection: "skills" as "media",
        where: { name: { equals: skill.name } },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        const id = (existing.docs[0] as { id: string }).id;
        await payload.update({
          collection: "skills" as "media",
          id,
          data: skill as never,
        });
        console.log(`  ✓ updated skill "${skill.name}"`);
      } else {
        await payload.create({
          collection: "skills" as "media",
          data: skill as never,
        });
        console.log(`  ✓ created skill "${skill.name}"`);
      }
    }
  }

  // 2. Lookup projects so we can resolve relatedProjects slugs → IDs
  const allProjects = await payload.find({
    collection: "projects",
    limit: 200,
  });
  const projectIdBySlug = new Map<string, string>();
  for (const p of allProjects.docs) {
    if (typeof p === "object" && p && "slug" in p && "id" in p) {
      projectIdBySlug.set(String(p.slug), String(p.id));
    }
  }

  // 3. Walk blog posts
  const files = (await readdir(blogDir))
    .filter((f) => f.endsWith(".md"))
    .filter((f) => !only || only.has(f.replace(/\.md$/, "")));
  if (only && files.length !== only.size) {
    throw new Error(
      `--only matched ${files.length} of ${only.size} slugs; check the spelling`,
    );
  }
  console.log(`→ Found ${files.length} markdown posts in ${blogDir}`);

  for (const file of files) {
    const src = await readFile(join(blogDir, file), "utf8");
    const { data, body } = parseFrontmatter(src);
    const lexical = mdToLexical(body);

    const relatedIds = (data.relatedProjects ?? [])
      .map((slug) => projectIdBySlug.get(slug))
      .filter((id): id is string => Boolean(id));

    // Check if it already exists
    const existing = await payload.find({
      collection: "posts" as "media", // type assertion: payload-types lag
      where: { slug: { equals: data.slug } },
      limit: 1,
    });

    const docData = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      category: data.category,
      status: data.status,
      publishedAt: data.publishedAt
        ? new Date(data.publishedAt).toISOString()
        : undefined,
      readingTime: data.readingTime,
      tags: (data.tags ?? []).map((tag) => ({ tag })),
      content: lexical,
      relatedProjects: relatedIds.length ? relatedIds : undefined,
    };

    if (existing.docs.length > 0) {
      const id = (existing.docs[0] as { id: string }).id;
      await payload.update({
        collection: "posts" as "media",
        id,
        data: docData as never,
      });
      console.log(`  ✓ updated "${data.title}"`);
    } else {
      await payload.create({
        collection: "posts" as "media",
        data: docData as never,
      });
      console.log(`  ✓ created "${data.title}"`);
    }
  }

  console.log("✓ Seed complete");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
