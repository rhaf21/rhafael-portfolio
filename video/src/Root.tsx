import { Composition, Still } from "remotion";
import { IntroStory } from "./IntroStory";
import { PortfolioCover } from "./PortfolioCover";
import { WorkThumb, type WorkThumbProps } from "./WorkThumb";
import { HOME_OG, OgCard, type OgCardProps } from "./OgCard";
import { LinkedInBanner } from "./LinkedInBanner";
import { Favicon } from "./Favicon";
import { DURATION, FPS } from "./timeline";

// Composed by scripts/score.mjs from the same frame timeline.
const SCORE = "music/score.wav";

// Share images for the pages people link to, so each LinkedIn Featured card differs.
const OGS: Array<[string, OgCardProps]> = [
  [
    "OgMilliner",
    {
      line1: "A CRO audit,",
      line2: "built on a ",
      em: "live store.",
      size: 84,
      sub: "A ten-point CRO audit, shipped on a Sydney milliner's Shopify store before Spring Racing.",
      receipt: { ...HOME_OG.receipt, title: "Sydney milliner" },
    },
  ],
  [
    "OgCrm",
    {
      line1: "A leaking CRM,",
      line2: "",
      em: "rebuilt.",
      size: 96,
      sub: "A training provider's GoHighLevel account, audited and rebuilt with n8n.",
      receipt: {
        title: "Training provider",
        rows: [
          ["Duplicate fields", "27"],
          ["Stuck contacts", "~244"],
          ["Automations", "12"],
          ["Unblocked", "26"],
        ],
        accentRow: 3,
        stamp: "SHIPPED",
      },
    },
  ],
  [
    "OgProvey",
    {
      line1: "Every task comes",
      line2: "back ",
      em: "with proof.",
      size: 84,
      sub: "Provey, my AI agent for Shopify merchants. Launching soon.",
      receipt: {
        title: "Provey",
        rows: [
          ["Test cards", "100"],
          ["Finished", "98"],
          ["First try", "58"],
          ["Median", "8 min"],
        ],
        accentRow: 1,
        stamp: "TESTED",
      },
    },
  ],
  [
    "OgClaudeCode",
    {
      line1: "Claude Code,",
      line2: "used ",
      em: "properly.",
      size: 96,
      sub: "A working developer's field guide: checks, plans, context, and permissions.",
      receipt: {
        title: "Field guide",
        rows: [
          ["Habit one", "verify"],
          ["Bugs caught", "4"],
          ["Read", "12 min"],
          ["Status", "published"],
        ],
        accentRow: 0,
        stamp: "CHECKED",
      },
    },
  ],
];

// Live-site thumbnails for the rest of the Upwork portfolio (captures in public/work).
const THUMBS: Array<[string, WorkThumbProps]> = [
  ["ThumbDisplaysense", { lane: "Shopify", client: "Displaysense", line: "Theme work on 3,500+ products, plus a draft-order quote flow for trade buyers.", url: "displaysense.co.uk", shot: "work/displaysense.png" }],
  ["ThumbOperaBeds", { lane: "Shopify", client: "Opera Beds", line: "Product finder and finance tooling, built into the storefront.", url: "operabeds.com", shot: "work/operabeds.png" }],
  ["ThumbCherries", { lane: "Shopify", client: "Cherries Official", line: "Storefront for a scent-infused phone case brand.", url: "cherriesofficial.com", shot: "work/cherries.png" }],
  ["ThumbSideRoutes", { lane: "WordPress", client: "Side Routes", line: "Tour company site for slow travel across European cities.", url: "sideroutes.com", shot: "work/sideroutes.png" }],
  ["ThumbProvey", { lane: "My product", client: "Provey", line: "An AI agent for Shopify merchants. Every task comes back with proof.", url: "Provey · in your Shopify admin", shot: "work/provey.png" }],
  ["ThumbCarpeDiem", { lane: "Next.js", client: "Carpe Diem Tours", line: "Experiential tours across Italy and Europe, built in Next.js.", url: "carpediemtours.com", shot: "work/carpediem.png" }],
];

export const RemotionRoot: React.FC = () => (
  <>
    {/* 4:5 for the site and LinkedIn */}
    <Composition id="IntroStory" component={IntroStory} durationInFrames={DURATION} fps={FPS} width={1080} height={1350} defaultProps={{ musicSrc: SCORE }} />
    {/* 16:9 for the Upwork profile video */}
    <Composition id="IntroStoryWide" component={IntroStory} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ musicSrc: SCORE }} />
    {/* 4:3 covers for Upwork portfolio items */}
    <Still
      id="CoverFordMillinery"
      component={PortfolioCover}
      width={1600}
      height={1200}
      defaultProps={{
        lane: "Shopify CRO",
        title: "A CRO audit, built on a",
        accent: "live store.",
        client: "Ford Millinery",
        meta: "SYDNEY · SHOPIFY",
        items: ["Cart pop-up to checkout", "Sizing for headwear", "Cross-sells auto-filled", "Breadcrumbs + schema"],
        totals: [["Clicks to pay", "4 → 2"], ["Conversion", "0.86% → 0.92%"]],
      }}
    />
    {/* Same cover without the client's name or analytics, until they clear publishing them */}
    <Still
      id="CoverMilliner"
      component={PortfolioCover}
      width={1600}
      height={1200}
      defaultProps={{
        lane: "Shopify CRO",
        title: "A CRO audit, built on a",
        accent: "live store.",
        client: "Sydney milliner",
        meta: "SYDNEY · SHOPIFY",
        items: ["Cart pop-up to checkout", "Sizing for headwear", "Cross-sells auto-filled", "Breadcrumbs + schema"],
        totals: [["Clicks to pay", "4 → 2"], ["Fixes shipped", "4 of 4"]],
      }}
    />
    <Still
      id="CoverCrmBuild"
      component={PortfolioCover}
      width={1600}
      height={1200}
      defaultProps={{
        lane: "CRM automation",
        title: "A leaking CRM, turned into",
        accent: "the system it runs on.",
        client: "Training provider",
        meta: "AUSTRALIA · GOHIGHLEVEL + N8N",
        items: ["CRM audit", "Round-robin lead owners", "Evidence chase rebuilt", "Dashboard in GHL"],
        totals: [["Automations shipped", "12"], ["Students unblocked", "26"]],
      }}
    />
    {/* Site icons: rounded for browser tabs, square for Apple (iOS rounds it itself) */}
    <Still id="Favicon" component={Favicon} width={512} height={512} defaultProps={{ rounded: true }} />
    <Still id="AppleIcon" component={Favicon} width={512} height={512} defaultProps={{ rounded: false }} />
    <Still id="FaviconSmall" component={Favicon} width={512} height={512} defaultProps={{ rounded: true, heavy: true }} />
    {/* Share image for the site (Open Graph, 1200x630) */}
    <Still id="OgCard" component={OgCard} width={1200} height={630} defaultProps={HOME_OG} />
    {OGS.map(([id, props]) => (
      <Still key={id} id={id} component={OgCard} width={1200} height={630} defaultProps={props} />
    ))}
    {/* LinkedIn cover image */}
    <Still id="LinkedInBanner" component={LinkedInBanner} width={1584} height={396} />
    {THUMBS.map(([id, props]) => (
      <Still key={id} id={id} component={WorkThumb} width={1600} height={1200} defaultProps={props} />
    ))}
  </>
);
