---
title: "Liquid in 2026: why I still reach for it"
slug: "liquid-in-2026"
category: "insights"
status: "published"
publishedAt: "2026-05-13"
readingTime: 6
tags:
  - Shopify
  - Liquid
  - Hydrogen
  - Performance
  - DSL
excerpt: "Defending a fifteen-year-old templating language against React-Server-Component-everywhere energy. Liquid's underrated wins, and the cases where it still beats Hydrogen."
relatedProjects:
  - "cherries-official"
featuredImage: "/assets/blog/liquid-2026-hero.png"
---

# Liquid in 2026: why I still reach for it

There's a quiet assumption running through Shopify developer conversations these days: Liquid is the past, Hydrogen is the future, and anyone still writing `{% for product in collection.products %}` is one quarter away from being replaced by a Server Component.

I disagree, and I want to lay out why.

I've shipped four Hydrogen sites and dozens of Liquid themes in the last few years. Hydrogen is great. Liquid is also great. They are not the same tool and they don't solve the same problem, and the industry tendency to flatten them into "old vs new" is making people pick the wrong one.

## What Liquid actually is

Liquid is a server-side template language. You write HTML with `{{ moustaches }}` and `{% tags %}` and the Shopify infrastructure renders it on their edge, with their data, and ships HTML to the browser.

That's the whole pitch. It's a 2010 idea, a template language for a CMS, that has aged remarkably well because Shopify has invested in two things React-the-framework can't easily match: **commerce primitives** and **edge proximity to product data**.

## The three things Liquid still wins on

### 1. Zero hydration cost

A Liquid page is fully rendered HTML by the time it reaches the browser. There is no JavaScript bundle to download before the page becomes interactive, because the page is already interactive, links work, forms submit, the cart drawer opens via a tiny vanilla-JS sprinkle.

This is the conversion advantage the React-everywhere crowd usually skips past. Hydrogen has done admirable work on streaming SSR and selective hydration, but you're still shipping a meaningful JavaScript runtime and rehydrating event handlers. On a Shopify product page with five reviews widgets, two upsell apps, and a sticky cart, that runtime adds up.

For brands whose conversion rate is dominated by mobile users on flaky 4G, the zero-hydration default of Liquid is worth a measurable percentage. Not "claimed in a blog post" worth; "I've watched the GA4 dashboard climb" worth.

### 2. Commerce primitives that aren't anyone else's problem

`{{ product.variants }}`, `{{ cart.items }}`, `{{ customer.orders }}`, these are first-class Liquid objects with a stable, documented shape. Behind them is Shopify's product catalog, inventory engine, and order system, available without you writing a single line of fetch logic.

In Hydrogen you can hit the Storefront API to get the same data. But you have to:

- Query for it (GraphQL)
- Pipe it through your fetcher
- Manage cache invalidation when stock changes
- Re-query on the client when the user changes a variant

In Liquid you write `{{ product.selected_variant.price | money }}` and move on. The shop runs the query, applies the customer's currency, formats the result. You don't touch the network.

This isn't "easier syntax." It's a different ownership model. In Liquid, Shopify owns the freshness and correctness of commerce data. In Hydrogen, you do. For 80% of stores, that's the wrong trade.

### 3. Free CDN edge rendering

Liquid pages are rendered on Shopify's edge and cached aggressively. A repeat visit to a product page is served from a POP somewhere within a few hundred miles of the user, and nothing in your codebase had to do anything special for that to happen.

You can replicate this with Hydrogen on Oxygen (Shopify's hosting for Hydrogen), but you're now reasoning about your own caching strategy, cache invalidation on product updates, image CDN routing, and so on. Liquid gives you a fast site by default. Hydrogen makes a fast site achievable.

## Where Liquid genuinely falls short

I'm not arguing it's the right tool for every Shopify build. Three specific cases where Hydrogen wins:

**Highly dynamic, customer-specific UX.** A configurator that mutates 30+ visible elements as the user selects options. A product page that re-flows entirely based on whether the customer is logged in, B2B-tagged, or a recent purchaser. Doing this in Liquid means a lot of vanilla JavaScript stitching the DOM to data; doing it in React is just React. Reach for Hydrogen.

**Headless multi-channel.** When the same product data needs to ship to a marketing site, an iOS app, and an in-store kiosk, Liquid only solves one of those. Hydrogen + the Storefront API is the right answer.

**Brand-defining motion design.** Shopify themes are constrained by the rendering pipeline, you can't easily stream, suspend, or progressively reveal content. A site whose differentiator is "we have the most thoughtful product page transitions on the internet" is a Hydrogen brief.

If your project matches any of those three, build Hydrogen. The other 80% of Shopify stores I see asking for a "modern rebuild" are stores whose problem is page weight, theme cruft, and bad merchandising, none of which are solved by switching frameworks. They're solved by writing better Liquid.

## The boring conclusion

Pick the tool for the job. Liquid for content-driven storefronts that need to be fast and cheap to maintain. Hydrogen for app-shaped experiences that need React's interactivity model. Stop treating the choice as a generation marker.

The bias I notice in my own work: I default to Liquid and *upgrade* to Hydrogen when there's a specific reason, not the other way around. Defaulting to Hydrogen and rationalizing it later is how stores end up with 800kb of JavaScript shipping a product page that could have been 40kb.

A fifteen-year-old templating language is still the right call for a lot of e-commerce work. The argument against it usually comes from people who haven't shipped a high-converting store on either stack. Try both. Measure. Decide.
