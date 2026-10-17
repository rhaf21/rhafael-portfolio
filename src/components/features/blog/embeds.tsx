import type { ComponentType } from "react";
import { ExtensionPicker } from "./ExtensionPicker";
import { GhlOrN8n } from "./GhlOrN8n";
import { QuoteBuilder } from "./QuoteBuilder";
import { ShopifyGhlSim } from "./ShopifyGhlSim";
import { AuditChecklist } from "./AuditChecklist";
import { DensityCalculator } from "./DensityCalculator";
import { FinderDemo } from "./FinderDemo";
import { InterviewScorecard } from "./InterviewScorecard";

/**
 * Interactive pieces a post can embed with a paragraph holding only
 * "{{embed:name}}". Unknown names render nothing, so a typo never breaks a post.
 */
export const EMBEDS: Record<string, ComponentType> = {
  "claude-code-extensions": ExtensionPicker,
  "ghl-or-n8n": GhlOrN8n,
  "draft-order-quote": QuoteBuilder,
  "shopify-ghl-sync": ShopifyGhlSim,
  "ghl-audit-checklist": AuditChecklist,
  "salesforce-density": DensityCalculator,
  "product-finder": FinderDemo,
  "ghl-hiring-scorecard": InterviewScorecard,
};
