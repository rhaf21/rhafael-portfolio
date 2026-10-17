// Plain-markdown views of the site for AI assistants (llms.txt convention).
import { getPosts, type PostData } from "@/lib/payload";
import { CRM_CASE, LEDGER, MILLINER_CASE, MILLINER_CLEARED, PROVEY_CASE, RATES, EXAMPLES, ENDS } from "@/data/proof";
import { SERVICES, TOOLKIT, SERVICE_QA } from "@/data/services";
import { UPWORK_URL } from "@/data/navigation";
import { PERSON, absoluteUrl } from "@/lib/site";
import { codeBlockText, embedName } from "@/components/features/blog/PostBody";

interface LexNode {
  type?: string;
  tag?: string;
  text?: string;
  listType?: string;
  language?: string;
  children?: LexNode[];
}

function inline(node: LexNode): string {
  if (node.text !== undefined) return node.text;
  return (node.children ?? []).map(inline).join("");
}

/** Lexical rich text to markdown: headings, paragraphs, lists, quotes, code. */
export function lexicalToMarkdown(content: unknown): string {
  const root = (content as { root?: LexNode } | null)?.root;
  if (!root) return "";
  const block = (node: LexNode): string => {
    switch (node.type) {
      case "heading": {
        const level = Number(node.tag?.replace("h", "")) || 2;
        return `${"#".repeat(Math.min(level + 1, 6))} ${inline(node)}`;
      }
      case "list":
        return (node.children ?? [])
          .map((li, i) => `${node.listType === "number" ? `${i + 1}.` : "-"} ${inline(li)}`)
          .join("\n");
      case "quote":
        return `> ${inline(node)}`;
      case "code":
        return "```" + (node.language ?? "") + "\n" + inline(node) + "\n```";
      case "horizontalrule":
        return "---";
      default: {
        // Interactive embeds have no text form; seeded code blocks become fenced code.
        if (embedName(node as Parameters<typeof embedName>[0])) return "";
        const code = codeBlockText(node as Parameters<typeof codeBlockText>[0]);
        if (code !== null) return "```\n" + code + "\n```";
        return inline(node);
      }
    }
  };
  return (root.children ?? [])
    .filter((n, i) => !(i === 0 && n.type === "heading" && n.tag === "h1"))
    .map(block)
    .filter((s) => s.trim())
    .join("\n\n");
}

const milliner = MILLINER_CLEARED ? "Ford Millinery" : "a designer milliner in Sydney";

function intro(): string {
  return [
    `# ${PERSON.name}`,
    "",
    `> ${PERSON.description}`,
    "",
    `${PERSON.name} works independently and async across US, UK, and Australian time zones, and replies within 24 hours. Clients book a 20-minute call at ${absoluteUrl("/contact")} or hire him on Upwork (${UPWORK_URL}).`,
  ].join("\n");
}

async function publishedPosts(): Promise<PostData[]> {
  return (await getPosts()).filter((p) => p.status === "published");
}

export async function llmsIndex(): Promise<string> {
  const posts = await publishedPosts();
  const lines = [
    intro(),
    "",
    "## Services",
    "",
    `- [Services and prices](${absoluteUrl("/services")}): ${SERVICES.map((s) => `${s.name} from ${s.from}`).join("; ")}.`,
    `- [Book a call](${absoluteUrl("/contact")}): a short brief, then a 20-minute call and a written next step within 24 hours.`,
    "",
    "## Work",
    "",
    `- [Shopify CRO audit, built on a live store](${absoluteUrl(MILLINER_CASE)}): a ten-point CRO audit for ${milliner}; checkout went from 4 clicks to 2.`,
    `- [GoHighLevel + n8n CRM rebuild](${absoluteUrl(CRM_CASE)}): an Australian training provider's CRM audited and rebuilt; 12 automations, 26 stranded students unblocked.`,
    `- [Provey](${absoluteUrl(PROVEY_CASE)}): ${PERSON.name}'s own product, an AI agent for Shopify merchants that plans, quotes, and does store work on a copy, then returns proof; 98 of 100 test cards finished, launching soon.`,
    `- [All work](${absoluteUrl("/projects")}): the full ledger of shipped changes, with before and after.`,
    "",
    "## About",
    "",
    `- [About ${PERSON.name}](${absoluteUrl("/about")}): background, toolkit, and how he works.`,
    `- [Side projects](${absoluteUrl("/side-projects")}): BoardGameTally, a free, patron-funded app for board game groups.`,
    "",
    "## Blog",
    "",
    ...posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.excerpt}`),
    "",
    "## Optional",
    "",
    `- [Full text for AI assistants](${absoluteUrl("/llms-full.txt")}): every page above, with full blog posts.`,
    `- [RSS feed](${absoluteUrl("/feed.xml")})`,
  ];
  return lines.join("\n") + "\n";
}

export async function llmsFull(): Promise<string> {
  const posts = await publishedPosts();
  const out: string[] = [intro(), ""];

  out.push("## Services and prices", "");
  for (const s of SERVICES) {
    out.push(`### ${s.name} (from ${s.from}, ${s.timeline})`, "", s.tagline + ".", ...s.includes.map((i) => `- ${i}`), "");
  }
  out.push("### Worked examples", "", ...EXAMPLES.map((e) => `- ${e.t}: ${e.r}. ${e.p}`), "");
  out.push("### How a job ends", "", ...ENDS.map((e) => `- ${e.label}: ${e.q} ${e.p}`), "");
  out.push("### Questions", "", ...SERVICE_QA.flatMap((q) => [`**${q.q}** ${q.a}`, ""]));
  out.push("### Rate card", "", ...RATES.map((r) => `- ${r.name}: ${r.price}. ${r.note}`), "");

  out.push("## Shipped changes (the ledger)", "");
  out.push(...LEDGER.map((r) => `- ${r.client}, ${r.change}: before, ${r.before}; after, ${r.after} (${r.status}).`), "");

  out.push("## Toolkit", "", ...TOOLKIT.map((t) => `- ${t.name}: ${t.detail}`), "");
  out.push("## Skills", "", PERSON.knowsAbout.join(", ") + ".", "");

  for (const post of posts) {
    out.push(`## Blog: ${post.title}`, "", `URL: ${absoluteUrl(`/blog/${post.slug}`)}`, "", `> ${post.excerpt}`, "");
    out.push(lexicalToMarkdown(post.content), "");
  }
  return out.join("\n");
}
