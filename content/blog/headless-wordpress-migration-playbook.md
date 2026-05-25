---
title: "Headless WordPress + Next.js: the migration playbook I wish I had"
slug: "headless-wordpress-migration-playbook"
category: "tutorial"
status: "published"
publishedAt: "2026-05-13"
readingTime: 11
tags:
  - WordPress
  - Next.js
  - Headless CMS
  - GraphQL
  - ACF
  - ISR
excerpt: "ACF, GraphQL, ISR, and the five gotchas that nobody warns you about. The plain-English migration checklist I run on every headless WordPress build."
relatedProjects:
  - "side-routes"
featuredImage: "/assets/blog/headless-wp-hero.png"
---

# Headless WordPress + Next.js: the migration playbook I wish I had

Headless WordPress is a great idea on a slide. It's a more complicated idea in production. I've migrated four sites onto a Next.js + WordPress backend now, and every single time I've tripped over something the tutorials skipped.

This is the checklist I run on every migration. It's the article I wish I'd had on project number one.

It assumes the basics: you've got a WordPress install with the Advanced Custom Fields (ACF), WPGraphQL, and WPGraphQL for ACF plugins. You're building a Next.js App Router frontend that consumes the GraphQL endpoint. You want ISR for revalidation. Skip ahead to the gotchas if that's old news.

## Should you actually go headless?

Before any of this, the question I ask every client.

**Go headless when:**

- You're building something that isn't a blog. A booking platform, a configurator, a personalized dashboard. WordPress is a great content store. It's a mediocre app framework.
- Your editorial team will keep using the WP admin (the headless win) and your frontend team wants TypeScript + React (the developer win). Both wins matter.
- You'll need to ship the same content to multiple surfaces: web, an iOS app, a digital signage rail. Headless pays off the moment you have two consumers of the same content.

**Stay on classic WordPress when:**

- The site is 95% blog and brochure pages. The editorial UX of WP block editor previewing in-place is something you will lose, and it matters.
- You're a team of one and you don't already know GraphQL. The complexity tax is real.
- You need page builders (Elementor, Divi) and the marketing team will riot if they go away.

Half the headless migrations I've been asked to do shouldn't have happened. The other half were transformative. The honest conversation is worth having before you write a line of code.

## The five gotchas

These are the ones that hurt. Each has an established fix; the problem is most blog posts don't even mention them.

### 1. Preview mode

The default Next.js GraphQL fetch hits the public WordPress API. Drafts don't appear there. The editorial team writes a draft, hits "Preview," and lands on the live frontend with no draft visible. They send you a Slack with the words "this is broken."

The fix is the **Draft Mode** API in Next.js App Router (the rebranded successor to "preview mode"). The full plumbing:

- In WordPress, register a custom **preview link** that points to `https://yourapp.com/api/preview?secret=…&id=…&slug=…`. The Yoast SEO plugin overrides the default preview URL, so you may need to filter `preview_post_link` in PHP.
- In Next.js, a route handler at `/api/preview` validates the secret, calls `draftMode().enable()`, and redirects to the post's slug.
- Inside your page component, check `(await draftMode()).isEnabled` and, if true, fetch with an authenticated WPGraphQL request and pass `?asPreview=true` so it returns drafts.
- Add an "Exit preview" banner that hits `/api/exit-preview` to call `draftMode().disable()`.

The bit nobody mentions: **the WordPress preview button uses a `wp_nonce`-authenticated request from the WP admin browser session**. Your Next.js draft fetch happens server-side and needs a separate auth path, a per-author JWT or an Application Password. Configure that, or your editors will see "Login required" errors on every preview.

### 2. Image proxying and `next/image`

WordPress hosts your images. `next/image` wants to optimize them. Two problems:

**a) The remote pattern.** You have to add your WordPress origin to `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "cms.example.com" },
  ],
}
```

Easy. Now the harder one.

**b) The double-CDN trap.** Your WordPress install is probably behind a CDN (Cloudflare, BunnyCDN, etc.) serving optimized images. `next/image` *also* runs its own optimizer. You're now paying for two optimizers and shipping images that have been resized twice, the second pass introduces compression artifacts because the input is already a JPEG.

Pick one. Either:

- Disable WordPress's image manipulation (deactivate the plugin, configure the CDN to pass through) and let `next/image` do the work. Best when Next.js is the only frontend.
- Set `unoptimized: true` on `next/image` and trust WordPress's CDN. Best when you have multiple frontends or you're fronting everything with Cloudflare anyway.

Either choice is fine. Doing both is not.

**c) Alt text and sizes.** WordPress media items carry `alt_text` and image sizes (thumbnail, medium, large, full). Pass them through your GraphQL query and use them. Hard-coding `width={1600} height={1000}` for every image is how you get CLS regressions.

### 3. Comments

Where do they live? You have three options and none are obvious.

**Keep them in WordPress.** Use the WP REST API (not GraphQL, comment mutations are clearer over REST) for submit. Render the existing thread via a server component that fetches at request time. Moderation stays in WP admin where the editor is used to it. Spam protection (Akismet) keeps working.

**Migrate to a third-party (Disqus, Hyvor, Giscus).** Fast to set up, abdicates ownership of comment data, often a performance hit on first paint. Fine for blogs that don't get many comments. Not fine if comments are part of the editorial experience.

**Build your own.** Don't, unless comments are core to the product (and at that point WordPress probably isn't the right tool). The amount of moderation tooling you'll re-implement is not what you want to spend your Q2 on.

I default to keeping them in WordPress. The editor is already trained. Moderation is already battle-tested. Don't move what works.

### 4. Sitemap merging

You now have two routing layers, WordPress for content URLs, Next.js for application routes. Yoast or RankMath generates a sitemap for WP. Next.js's `app/sitemap.ts` generates one for the app.

Google does not want two sitemaps fighting. You want one canonical sitemap.

**The pattern:** generate `app/sitemap.ts` in Next.js as the source of truth. Inside it, query WPGraphQL for all post and page URLs and emit them as entries. Add your application routes (`/`, `/about`, etc.) explicitly. Disable or unlink the Yoast/RankMath sitemap so it isn't accessible. Submit only `/sitemap.xml` from the Next.js side to Google Search Console.

The tricky bit: the `lastModified` field. WordPress posts have `modified` timestamps in GraphQL. Use them. Don't return `new Date()` for every entry, that tells Google your entire site changed today and it stops trusting any of your update signals.

### 5. WPML routing

The fifth gotcha is for anyone running a multilingual WordPress with WPML. Three things will bite you:

**a) The locale prefix.** WPML's default is `/en/`, `/it/`, etc. as URL prefixes. Next.js i18n in the App Router uses route groups: `app/[lang]/...`. Decide on the URL shape *first*, then configure WPML to match. If they diverge, WP says `/it/` and your Next router says `/it-IT/`, your sitemap, your redirects, and your social shares all break in ways you'll spend two days finding.

**b) Translated slugs.** A blog post titled "About us" in English might be `/about` in WP. Its Italian translation might be `/chi-siamo`. WPML stores both; WPGraphQL returns the localized slug per language. Your dynamic route handler needs to query for all locale variants when you call `generateStaticParams`. Forget this and you'll get 404s on every translated URL.

**c) String translations.** Static strings in your React UI ("Read more," "Subscribe") aren't in WordPress at all. They need to be in a Next.js translation layer, I use `next-intl`. Trying to source UI strings from WPML is a path of pain; the plugin wasn't built for it.

## Cache, revalidation, and ISR

This is the part everyone gets right by accident and never tests under pressure.

**Use ISR with tag-based invalidation.** Every fetch from WPGraphQL gets a `next: { tags: [...] }` option. When a post is published or updated in WordPress, a webhook hits `/api/revalidate?tag=post-{id}` in Next.js, which calls `revalidateTag()`. The post regenerates on next request.

The webhook is a few lines of PHP in `functions.php` listening to `save_post` and `wp_after_insert_post`. Validate a shared secret. Fail loudly if the request fails, silent revalidation failures are how stale content sneaks in.

**Don't use `revalidate: 60` everywhere.** Time-based ISR is a hammer. You'll waste compute regenerating pages that haven't changed and serve stale content for the worst-case 60 seconds when they do. Tag-based revalidation is more code and saves you both.

**Cache the GraphQL response, not the page.** This is the small one. Use `fetch` with `next: { revalidate: false, tags: [...] }` for the GraphQL call. Then the cache survives across pages that share the same query (a header that needs the menu, a sitemap that needs all post slugs).

## The migration order I follow

Twelve steps, in this order, each one independently shippable:

1. Stand up WordPress, plugins, content modeled. Don't touch the frontend yet.
2. Build a Next.js app that fetches a single GraphQL query (homepage) and renders it. Get the typing right with `graphql-codegen`.
3. Build the listing pages (posts, pages by template).
4. Build the detail pages with `generateStaticParams`.
5. Wire ISR with tag-based revalidation. Test by saving a draft → publish → confirm the page updates.
6. Migrate images. Pick one optimizer. Verify `next/image` widths and alt text.
7. Build the menu/global queries (header, footer). Cache aggressively.
8. Wire preview/draft mode. Test with a non-developer editor.
9. Migrate forms. (Gravity Forms via REST, or rebuild in Next.js with server actions hitting WP REST for storage.)
10. Migrate comments (keep them in WP unless there's a reason not to).
11. Sitemap, robots.txt, redirects (301s from old WP URLs to new Next URLs).
12. Switch DNS. Watch the logs for 24 hours.

The order matters. If you flip steps 5 and 8, the editorial team can't preview anything during the migration. If you flip steps 11 and 12, you'll watch your Google rankings dip and panic about it for a week before realizing you forgot a redirect.

## When you're done

You'll have a faster site, a happier dev team, and exactly the same content workflow for editors. You'll also have a more complex deployment, two systems to keep updated, and a non-zero chance that one day you'll be asked to "add a small thing" that turns out to require code on both sides.

That's the trade. Make it on purpose, not by default.
