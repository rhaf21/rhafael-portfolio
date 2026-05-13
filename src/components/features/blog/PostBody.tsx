import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

interface PostBodyProps {
  content: unknown;
}

export function PostBody({ content }: PostBodyProps) {
  if (!content || typeof content !== "object") {
    return null;
  }
  return (
    <article className="prose" data-reveal>
      <RichText data={content as SerializedEditorState} />
    </article>
  );
}
