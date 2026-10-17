// Post categories are a closed set in the Posts collection; blog.css has one
// filter rule per category, so add one there when adding one here.
export const CATEGORY_LABELS: Record<string, string> = {
  tutorial: "Tutorial",
  "case-study": "Case study",
  insights: "Insights",
  news: "News",
  tips: "Tips",
};

/** Posts with their own 1200x630 share image (rendered in video/, see OgCard); others use the site card. */
export const POST_OG: Record<string, string> = {
  "how-to-use-claude-code": "/og/claude-code.jpg",
};
