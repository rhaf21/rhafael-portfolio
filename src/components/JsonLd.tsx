/**
 * Renders schema.org nodes as one JSON-LD @graph. Build nodes with the
 * helpers in src/lib/schema.ts so they share the same Person and business ids.
 */
export function JsonLd({ graph }: { graph: Array<Record<string, unknown>> }) {
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  // Escape "<" so a value can never close the script tag early.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }} />;
}
