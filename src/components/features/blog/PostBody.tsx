import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { EMBEDS } from "./embeds";

interface PostBodyProps {
  content: unknown;
}

interface LexicalNodeLike {
  type?: string;
  tag?: string;
  text?: string;
  // Text nodes store bit flags here; element nodes store their alignment as a string.
  format?: number | string;
  children?: LexicalNodeLike[];
}

type LexicalRootLike = {
  root: { children?: LexicalNodeLike[] } & Record<string, unknown>;
};

const BOLD = 1;
const CODE = 16;
const hasFlag = (node: LexicalNodeLike, flag: number) => typeof node.format === "number" && (node.format & flag) !== 0;
const EMBED = /^\{\{embed:([a-z0-9-]+)\}\}$/;

function isLexicalRoot(value: unknown): value is LexicalRootLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "root" in value &&
    typeof (value as { root: unknown }).root === "object"
  );
}

/**
 * Some authored posts include an opening `# Title` that duplicates the
 * title already shown in the post hero. Strip a leading h1 (if any) so the
 * detail page doesn't render the same heading twice.
 */
function stripLeadingH1(data: LexicalRootLike): LexicalRootLike {
  const children = data.root.children ?? [];
  if (children.length === 0) return data;
  const first = children[0];
  if (first.type === "heading" && first.tag === "h1") {
    return {
      ...data,
      root: { ...data.root, children: children.slice(1) },
    };
  }
  return data;
}

function nodeText(node: LexicalNodeLike): string {
  return node.text ?? (node.children ?? []).map(nodeText).join("");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// The seed stores fenced code as a paragraph of code-formatted text and line
// breaks (the default Lexical config has no code node), tables as a list of
// "**Header**: value · **Header**: value" items, and embeds as a paragraph
// holding only "{{embed:name}}". The helpers below recognize those shapes, so
// the admin keeps plain editable nodes while the site renders the real thing.

/** The code text if this paragraph is a seeded code block, else null. */
export function codeBlockText(node: LexicalNodeLike): string | null {
  const kids = node.children ?? [];
  if (node.type !== "paragraph" || kids.length === 0) return null;
  const isCode = kids.every((k) => k.type === "linebreak" || (k.type === "text" && hasFlag(k, CODE)));
  if (!isCode) return null;
  return kids.map((k) => (k.type === "linebreak" ? "\n" : k.text ?? "")).join("");
}

/** The embed name if this paragraph is only an "{{embed:name}}" marker, else null. */
export function embedName(node: LexicalNodeLike): string | null {
  if (node.type !== "paragraph") return null;
  return nodeText(node).trim().match(EMBED)?.[1] ?? null;
}

/** Header and rows if this list is a seeded table, else null. */
export function tableFromList(node: LexicalNodeLike): { headers: string[]; rows: string[][] } | null {
  if (node.type !== "list") return null;
  const items = node.children ?? [];
  if (items.length < 2) return null;
  const parsed = items.map((item) => {
    const headers: string[] = [];
    const cells: string[] = [];
    for (const k of item.children ?? []) {
      const text = k.text ?? nodeText(k);
      if (k.type === "text" && hasFlag(k, BOLD)) {
        headers.push(text.trim());
        cells.push("");
      } else if (cells.length > 0) {
        cells[cells.length - 1] += text;
      }
    }
    return { headers, cells: cells.map((c) => c.replace(/^:\s*/, "").replace(/\s*·\s*$/, "").trim()) };
  });
  const headers = parsed[0].headers;
  const consistent = headers.length >= 2 && parsed.every((p) => p.headers.join("|") === headers.join("|"));
  return consistent ? { headers, rows: parsed.map((p) => p.cells) } : null;
}

/** The post's h2s, for the "On this page" list. Ids match the ones PostBody renders. */
export function getToc(content: unknown): Array<{ id: string; text: string }> {
  if (!isLexicalRoot(content)) return [];
  return (content.root.children ?? [])
    .filter((n) => n.type === "heading" && n.tag === "h2")
    .map((n) => {
      const text = nodeText(n);
      return { id: slugify(text), text };
    })
    .filter((h) => h.text);
}

/** Question and answer pairs from an "FAQ" h2 section: each h3 is a question, the paragraphs after it the answer. */
export function getFaq(content: unknown): Array<{ q: string; a: string }> {
  if (!isLexicalRoot(content)) return [];
  const nodes = content.root.children ?? [];
  const start = nodes.findIndex((n) => n.type === "heading" && n.tag === "h2" && /^(faq|frequently asked)/i.test(nodeText(n)));
  if (start === -1) return [];
  const faq: Array<{ q: string; a: string }> = [];
  for (const n of nodes.slice(start + 1)) {
    if (n.type === "heading" && n.tag === "h2") break;
    if (n.type === "heading" && n.tag === "h3") faq.push({ q: nodeText(n), a: "" });
    else if (faq.length > 0 && n.type === "paragraph") {
      const last = faq[faq.length - 1];
      last.a = [last.a, nodeText(n)].filter(Boolean).join(" ");
    }
  }
  return faq.filter((f) => f.q && f.a);
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  // h2 and h3 get ids so the table of contents and shared links can jump to them.
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag;
    const children = nodesToJSX({ nodes: node.children });
    if (Tag !== "h2" && Tag !== "h3") return <Tag>{children}</Tag>;
    return <Tag id={slugify(nodeText(node as unknown as LexicalNodeLike))}>{children}</Tag>;
  },
  paragraph: (args) => {
    const node = args.node as unknown as LexicalNodeLike;
    const embed = embedName(node);
    if (embed) {
      const Embed = EMBEDS[embed];
      return Embed ? (
        <figure className="embed">
          <Embed />
        </figure>
      ) : null;
    }
    const code = codeBlockText(node);
    if (code !== null) {
      return (
        <pre className="code-block">
          <code>{code}</code>
        </pre>
      );
    }
    const fallback = defaultConverters.paragraph;
    return typeof fallback === "function" ? fallback(args) : null;
  },
  list: (args) => {
    const table = tableFromList(args.node as unknown as LexicalNodeLike);
    if (table) {
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {table.headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (c === 0 ? <th key={c} scope="row">{cell}</th> : <td key={c}>{cell}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    const fallback = defaultConverters.list;
    return typeof fallback === "function" ? fallback(args) : null;
  },
});

export function PostBody({ content }: PostBodyProps) {
  if (!isLexicalRoot(content)) return null;
  const cleaned = stripLeadingH1(content);
  return (
    <RichText
      className="prose"
      data={cleaned as unknown as SerializedEditorState}
      converters={converters}
    />
  );
}
