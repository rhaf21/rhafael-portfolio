// Markdown in content/blog to Payload's Lexical JSON. Shared by the seed script,
// which writes posts to the database, and the dev-only draft preview route.

export type Frontmatter = {
  title: string;
  slug: string;
  category: "tutorial" | "case-study" | "insights" | "news" | "tips";
  status: "draft" | "published";
  publishedAt?: string;
  readingTime?: number;
  tags?: string[];
  excerpt: string;
  relatedProjects?: string[];
};

// ─────────────────────────────────────────────────────────────
// Minimal YAML frontmatter parser (handles strings, numbers, arrays)
// ─────────────────────────────────────────────────────────────
export function parseFrontmatter(src: string): { data: Frontmatter; body: string } {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("No frontmatter found");
  const yaml = match[1];
  const body = match[2];

  const data: Record<string, unknown> = {};
  const lines = yaml.split(/\r?\n/);
  let key: string | null = null;
  let listValues: string[] | null = null;

  for (const line of lines) {
    if (/^\s*-\s+/.test(line) && key && listValues) {
      const v = line.replace(/^\s*-\s+/, "").trim();
      listValues.push(stripQuotes(v));
      continue;
    }
    if (key && listValues) {
      data[key] = listValues;
      key = null;
      listValues = null;
    }
    const kv = line.match(/^([a-zA-Z][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!kv) continue;
    const [, k, rawV] = kv;
    const v = rawV.trim();
    if (v === "") {
      key = k;
      listValues = [];
    } else {
      data[k] = parseScalar(v);
    }
  }
  if (key && listValues) data[key] = listValues;

  return { data: data as unknown as Frontmatter, body: body.trim() };
}

function parseScalar(v: string): string | number | boolean {
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
  if (v === "true") return true;
  if (v === "false") return false;
  return stripQuotes(v);
}

function stripQuotes(v: string): string {
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

// ─────────────────────────────────────────────────────────────
// Markdown → Lexical converter (handles the subset I write in)
// ─────────────────────────────────────────────────────────────
type LexNode = Record<string, unknown>;

const BASE = { format: "", indent: 0, version: 1, direction: "ltr" as const };

function textNode(text: string, format = 0): LexNode {
  return {
    type: "text",
    text,
    format,
    detail: 0,
    mode: "normal",
    style: "",
    version: 1,
  };
}

function linkNode(text: string, url: string, format = 0): LexNode {
  return {
    type: "link",
    fields: { url, newTab: /^https?:/.test(url), linkType: "custom" },
    children: [textNode(text, format)],
    ...BASE,
  };
}

// Parse inline markdown (**bold**, *italic*, `code`, [text](url))
function inlineParse(s: string): LexNode[] {
  const out: LexNode[] = [];
  let i = 0;
  let buf = "";
  const format = 0;

  const flush = () => {
    if (buf) {
      out.push(textNode(buf, format));
      buf = "";
    }
  };

  while (i < s.length) {
    // Bold **text**
    if (s.startsWith("**", i)) {
      flush();
      const end = s.indexOf("**", i + 2);
      if (end !== -1) {
        out.push(textNode(s.slice(i + 2, end), format | 1));
        i = end + 2;
        continue;
      }
    }
    // Inline code `code`
    if (s[i] === "`") {
      flush();
      const end = s.indexOf("`", i + 1);
      if (end !== -1) {
        out.push(textNode(s.slice(i + 1, end), format | 16)); // 16 = code
        i = end + 1;
        continue;
      }
    }
    // Italic _text_ or *text* (single)
    if ((s[i] === "_" || s[i] === "*") && s[i + 1] !== s[i]) {
      flush();
      const marker = s[i];
      const end = s.indexOf(marker, i + 1);
      if (end !== -1 && end - i > 1 && /\S/.test(s.slice(i + 1, end))) {
        out.push(textNode(s.slice(i + 1, end), format | 2));
        i = end + 1;
        continue;
      }
    }
    // Link [text](url)
    if (s[i] === "[") {
      const close = s.indexOf("]", i + 1);
      if (close !== -1 && s[close + 1] === "(") {
        const urlEnd = s.indexOf(")", close + 2);
        if (urlEnd !== -1) {
          flush();
          const text = s.slice(i + 1, close);
          const url = s.slice(close + 2, urlEnd);
          out.push(linkNode(text, url, format));
          i = urlEnd + 1;
          continue;
        }
      }
    }
    buf += s[i];
    i++;
  }
  flush();
  return out;
}

function paragraph(children: LexNode[]): LexNode {
  return { type: "paragraph", children, textFormat: 0, textStyle: "", ...BASE };
}

function heading(tag: "h1" | "h2" | "h3" | "h4", children: LexNode[]): LexNode {
  return { type: "heading", tag, children, ...BASE };
}

function quote(text: string): LexNode {
  return { type: "quote", children: inlineParse(text), ...BASE };
}

function list(listType: "bullet" | "number", items: string[]): LexNode {
  return {
    type: "list",
    listType,
    tag: listType === "bullet" ? "ul" : "ol",
    start: 1,
    children: items.map((item, i) => ({
      type: "listitem",
      value: i + 1,
      checked: undefined,
      children: inlineParse(item),
      ...BASE,
    })),
    ...BASE,
  };
}

function codeBlock(content: string): LexNode {
  // Default Lexical config doesn't include a "code" node type. Fall back to a
  // paragraph of monospaced text, visually distinct enough in our prose style.
  return {
    type: "paragraph",
    children: content.split("\n").flatMap((line, i, arr) => {
      const nodes: LexNode[] = [textNode(line, 16)];
      if (i < arr.length - 1) nodes.push({ type: "linebreak", version: 1 });
      return nodes;
    }),
    textFormat: 0,
    textStyle: "",
    ...BASE,
  };
}

export function mdToLexical(md: string): { root: LexNode } {
  const lines = md.split(/\r?\n/);
  const children: LexNode[] = [];
  let i = 0;

  const isHeading = (line: string) => /^#{1,4} /.test(line);
  const isList = (line: string) => /^[-*] /.test(line) || /^\d+\. /.test(line);
  const isQuote = (line: string) => line.startsWith("> ");
  const isCode = (line: string) => line.startsWith("```");
  const isTable = (line: string) => line.startsWith("|");
  const isSpecial = (line: string) =>
    isHeading(line) ||
    isList(line) ||
    isQuote(line) ||
    isCode(line) ||
    isTable(line);

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (isCode(line)) {
      i++;
      const buf: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing ```
      children.push(codeBlock(buf.join("\n")));
      continue;
    }

    if (isHeading(line)) {
      const level = (line.match(/^(#+) /)?.[1].length ?? 1) as 1 | 2 | 3 | 4;
      const tag = (`h${Math.min(level, 4)}`) as "h1" | "h2" | "h3" | "h4";
      children.push(heading(tag, inlineParse(line.replace(/^#+\s+/, ""))));
      i++;
      continue;
    }

    if (isQuote(line)) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      children.push(quote(buf.join(" ")));
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, ""));
        i++;
      }
      children.push(list("bullet", items));
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      children.push(list("number", items));
      continue;
    }

    if (isTable(line)) {
      // Convert table into a bullet list of "header: value" rows.
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        if (cells.some((c) => /^-+$/.test(c))) {
          i++;
          continue; // skip separator row
        }
        rows.push(cells);
        i++;
      }
      if (rows.length > 0) {
        const headers = rows[0];
        const dataRows = rows.slice(1);
        const items = dataRows.map((row) =>
          row
            .map((cell, idx) =>
              headers[idx] ? `**${headers[idx]}**: ${cell}` : cell
            )
            .join(" · ")
        );
        children.push(list("bullet", items));
      }
      continue;
    }

    // Paragraph
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !isSpecial(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    children.push(paragraph(inlineParse(buf.join(" "))));
  }

  return {
    root: {
      type: "root",
      children,
      ...BASE,
    },
  };
}
