import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

interface PostBodyProps {
  content: unknown;
}

type LexicalRootLike = {
  root: {
    children?: Array<{ type?: string; tag?: string }>;
  } & Record<string, unknown>;
};

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

export function PostBody({ content }: PostBodyProps) {
  if (!isLexicalRoot(content)) return null;
  const cleaned = stripLeadingH1(content);
  return (
    <article className="prose" data-reveal>
      <RichText data={cleaned as unknown as SerializedEditorState} />
    </article>
  );
}
