# Brief: Redesign rhafael.dev portfolio — 3 distinct art directions

You are a senior product / brand designer who has shipped award-winning portfolio sites for developers and creative studios. Your work is referenced on Awwwards, Godly, and Refokus' archives. You don't ship templates.

I need three **distinct, opinionated, and personal** art directions for my personal portfolio. The current build is technically sound but looks like a generic dark-portfolio template (glass-cards-on-black + a single neon accent). I want you to outdo it.

---

## About me (the client)

- **Name:** Rhafael
- **Role:** Full-stack developer
- **Specialties:** Shopify themes (Liquid), headless WordPress, modern React / Next.js apps. Conversion-focused e-commerce work.
- **Voice:** Confident but understated. I ship measurable outcomes (e.g. "+38% checkout completion"), not vibes. I'd rather show three perfect case studies than ten weak ones.
- **What I'm not:** Not a designer pretending to be a dev. Not a crypto / Web3 / agency. Not a junior. Not an "AI engineer."

## What I do NOT want

Three failure modes you must avoid:

1. **The generic AI-portfolio look** — glassy card on dark background with a single neon accent (lime green, in my case). It feels templated. Every AI builder spits this out.
2. **Weak typography** — single sans family carrying everything. Type hierarchy that doesn't do real expressive work. Identical font sizes on every section.
3. **Harsh / one-note color** — pure black + bright neon green is too video-game / hacker-LARP coded. I want depth, restraint, and contrast that earns its place.

Don't make me three flavors of the same idea. The three directions should look like they came from three different studios.

## Hard constraints (don't fight these)

- **Stack:** Next.js 15 App Router + Tailwind v4 + Payload CMS (MongoDB). Motion via `motion/react`. Designs will be implemented as React components.
- **Theme:** Single mode (no light/dark toggle). Pick the right mode for the direction — could be dark, light, or something more interesting.
- **Routes (must accommodate):** `/` (Home), `/projects`, `/projects/[slug]` (case study), `/about`, `/contact`, `/blog`, `/blog/[slug]`, `/admin` (Payload — visual only, leave alone).
- **CMS-backed content** (fields that must appear in the design — don't drop any):
  - **SiteSettings (global):** `siteTitle`, `siteDescription`, `availableForWork` (badge), `heroGreeting`, `heroTitle`, `heroSubtitle`, `heroDescription`, `aboutTitle`, `aboutContent` (richText), `profileImage`, `stats[]` (label/value), `email`, `socialLinks[]` (platform/url), `resumeFile`, `resumeLastUpdated`.
  - **Projects:** `title`, `slug`, `description`, `longDescription` (richText), `category` (Shopify/WordPress/React), `techStack[]`, `gallery[]` (images), `demoVideo`, `liveUrl`, `githubUrl`, `featured`, `completedAt`, `highlights[]`.
  - **Posts:** `title`, `slug`, `excerpt`, `featuredImage`, `content` (richText), `category` (tutorial/case-study/insights/news/tips), `tags[]`, `publishedAt`, `readingTime`, `relatedProjects[]`.
  - **Testimonials:** `name`, `role`, `company`, `avatar`, `quote`, `rating` (1–5), `featured`.
  - **Skills:** `name`, `category` (frontend/backend/tools), `proficiency` (0–100).
  - **Experience:** `company`, `role`, `description`, `startDate`, `endDate`, `highlights[]`.
- **PDF export** (`/api/portfolio-pdf`) exists and uses `@react-pdf/renderer` independently of site styles — out of scope.

## Real content you can use in the mockups

Use this exact copy so the designs feel grounded, not lorem-ipsum'd:

- **Hero:** Greeting "Hi, I'm Rhafael." · Title "Shopify, Wordpress, React Developer." · Description "I build high-converting e-commerce stores on Shopify, custom WordPress themes, and modern React applications that drive results for businesses."
- **Stats:** "4+ Years Experience" · "30+ Projects Completed" · "20+ Happy Clients"
- **Featured projects** (real, in CMS):
  - **Cherries Official** — Shopify · Liquid, JavaScript, CSS. "Premium lifestyle brand e-commerce store specializing in scent-infused phone cases and mobile accessories with a bold, playful aesthetic."
  - **Carpe Diem Tours** — React · Nextjs, Typescript, Tailwind, React. "Experiential travel company platform featuring guided tours and immersive activities throughout Italy and Europe, built with modern web technologies."
  - **Side Routes** — WordPress · WordPress, PHP, CSS, JavaScript. "Travel tour company website offering curated walking tours, food experiences, and cultural activities across European cities with a focus on slow, soulful…"
  - **BoardGameTally** — React · NextJS, React, MongoDB, Ably. "Board Game Tally is a simple web app for tracking board game scores with your group. Create an organization with a custom subdomain, invite…"
- **Tech that recurs:** NextJS, React, MongoDB, Ably, Cloudinary, Shopify, Liquid, JavaScript, CSS, TypeScript, Tailwind, PHP, WordPress.

## What I need from you

Produce **three** complete, distinct art directions. For each:

### Deliverable per direction

A **single self-contained HTML file** (inline `<style>`, inline SVG/data-URI assets where needed, no external CDNs except Google Fonts) that renders:

1. **Brand identity tile** at the top (200×80 swatch): wordmark + color palette + type pairing.
2. **Home page mockup** (full-width, scrollable): hero, featured projects (the 4 real projects above), tech ticker, testimonials, footer CTA.
3. **Project detail page mockup** using Cherries Official: hero with category + title + description, gallery placeholder, "Overview" body, highlights list, tech stack, related projects strip.
4. **About page mockup**: aboutTitle, stats row, bio paragraphs (placeholder OK), skills section (grouped), experience timeline (2 roles).
5. **Contact page mockup**: contact info card, social row, contact form.
6. **Blog index mockup**: 4–6 post cards.

All on one HTML page, stacked vertically with clear `<h1>` section dividers like:
```
═══════════════════════════════════════
01 / HOME
═══════════════════════════════════════
```

### Each direction must explicitly answer

- **Aesthetic name + 2-sentence thesis.** (e.g. "Editorial Quiet" — print-magazine restraint applied to a dev portfolio. Serif headlines, abundant whitespace, color as a punctuation mark, not a wash.)
- **Color system:** primary surface, ink, 2-3 supporting tones, the accent (or two accents). Real hex/oklch values.
- **Type pairing:** display + body + mono. Use Google Fonts so I can preview. Pick fonts that have *personality* — not just "Inter."
- **Type scale:** 5–7 sizes with intended use (display, h1, h2, body, caption, eyebrow, mono).
- **Spacing/grid:** baseline, gutter, container max-width, vertical rhythm.
- **Motion language:** what moves, what doesn't, how fast, what easing. One sentence.
- **One signature interaction:** the thing a visitor will notice and remember. Not three. One.

### The three directions

You decide. But they must be **categorically distinct** — different category answers to "what is a developer portfolio?" Examples of how far apart they should be:

- *Editorial / print* vs *Brutalist / monospace* vs *Material / depth-and-light* vs *Cinematic / fullscreen-image* vs *Spreadsheet / data-dense* vs *Zine / collage* vs *Apple-quiet* vs *Indie-game UI*.

Pick three answers that genuinely differ. If two of yours could be confused by a stranger, redo.

## Output format

Return your work as:

1. A short paragraph naming the three directions.
2. The three HTML files, each in its own fenced code block clearly labeled.
3. A 3-line per-direction summary at the end ("Pick #1 if you want…").

Don't preface with disclaimers. Don't ask clarifying questions — make the call and ship.
