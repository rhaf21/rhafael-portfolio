---
title: "How to build a Shopify product finder that actually sells"
slug: "shopify-product-finder"
category: "tutorial"
status: "draft"
publishedAt: "2026-10-17"
readingTime: 5
tags:
  - Shopify
  - Product finder
  - Metafields
  - Storefront filtering
  - Conversion
excerpt: "A good product finder asks three to five questions, filters on what's non-negotiable, ranks what's left, and lands on a real collection URL. Built on metafields, not a heavy quiz app."
---

# How to build a Shopify product finder that actually sells

A product finder that sells asks three to five questions, uses the answers in two different ways, and ends on a real Shopify collection page. Must-haves like size and budget become filters, so nothing unsuitable ever shows. Preferences like feel or style become a score that ranks what's left. Store the answers' data in product metafields, use Shopify's own storefront filtering for the must-haves, and the finder stays fast, maintainable, and measurable.

I built a product finder into the storefront for Opera Beds, a UK bed maker, where choosing between beds and mattresses is exactly the kind of decision shoppers want help with. This is the approach that works, with the filtering details checked against Shopify's documentation.

## When does a store need a product finder?

When shoppers can't tell your products apart from the product grid. Mattresses, skincare, coffee, bike sizes, and anything with a "which one is right for me?" question are the classic cases. If shoppers ask the same question in chat or by email again and again, that question is your finder's first step.

A finder is the wrong fix when the real problem is navigation. If people can't find categories, fix the menu and the collection filters first. A quiz on top of a confusing store is still a confusing store.

## How should the questions work?

Split them into two kinds, because they do different jobs:

- **Must-haves filter.** Size, budget, compatibility, in stock. If a product fails one, it shouldn't appear at all.
- **Preferences rank.** Firmness, style, scent, sleeping position. A product that misses one is still a candidate, just a lower one.

Most finders get this wrong in one of two directions. Treat everything as a filter and a shopper with four preferences gets "no results". Treat everything as a score and someone with a king-size bed gets recommended a single. Try it with a small mattress range:

{{embed:product-finder}}

Keep it to three to five questions. Every extra question loses people, and each one should change the result. If an answer wouldn't change what you recommend, cut the question.

## Where should the product data live?

In product metafields, defined once in the Shopify admin, with a clear type for each attribute: firmness as a single-line text value from a fixed list, suitable sleeping positions as a list, and so on. That gives you three things at once:

- **One source of truth.** The finder, the product page, and the collection filters all read the same values.
- **Native filtering.** Shopify's storefront filtering can filter on metafields of these types: single-line text, lists of text, numbers, booleans, and metaobject references.
- **Editable by the team.** Merchandisers update attributes in the admin, and nobody touches code.

For attributes shared across many products, like a fabric or a material with its own description and swatch, use a metaobject and reference it from the product.

## How does the finder hand off to Shopify?

The best finders don't end on a custom results page. They end on a real collection URL with Shopify's filters applied, so shoppers can keep browsing, sorting, and filtering as normal. Applied filters live in the URL:

```text
/collections/mattresses?filter.v.option.size=King&filter.v.price.lte=900&filter.p.m.custom.firmness=medium
```

Product filters start with `filter.p.`, variant filters with `filter.v.`, and metafield filters name the namespace and key, as in `filter.p.m.custom.firmness`. Different filters combine with AND, and several values for one filter combine with OR. Filters have to be enabled in Shopify's Search & Discovery app before the URL will respect them, and a store can have up to 25.

The ranking happens on top: the finder knows the shopper's preferences, so it can reorder or highlight the top matches on that page.

## How do you build it without slowing the store down?

As a theme section with a small amount of JavaScript, not an app that loads a heavy script on every page. The section renders the questions in Liquid, so they appear instantly and work in the theme editor. A little JavaScript tracks answers and builds the URL. Product data comes from metafields already on the page, or from Shopify's own endpoints when the range is large.

Quiz apps are fine for testing whether a finder helps at all. Once it earns its place, a native section is faster, matches the theme exactly, and doesn't add a monthly fee.

## How do you know it's working?

Measure it like any other funnel:

- **Completion rate.** How many people who start the finder reach a result. A big drop at one question means that question is confusing or unnecessary.
- **Result clicks.** Whether people click the recommended products, or ignore them and browse.
- **Conversion of finder users.** Compare people who completed the finder with similar visitors who didn't.
- **Zero-result rate.** How often the must-haves filter everything out. Each zero result is a gap in your range or an over-strict question.

## Key takeaways

- Use must-haves as filters and preferences as a score.
- Ask three to five questions, and cut any that don't change the result.
- Store product attributes in typed metafields, so the finder and filters share one source.
- End on a real collection URL with Shopify's filters applied.
- Track completion, result clicks, conversion, and zero results.

If you'd like one built for your range, product finders are part of my [Shopify builds](/services#shopify).

## FAQ

### Do I need an app to build a Shopify product finder?

No. A theme section with a little JavaScript, product metafields, and Shopify's storefront filtering is enough, and it's faster than most apps. A quiz app is a reasonable way to test the idea first.

### How many questions should a product finder ask?

Three to five. Each question should change the recommendation. If an answer wouldn't change what you show, remove the question.

### Can Shopify filter collections by metafields?

Yes. Shopify's storefront filtering supports metafield filters for single-line text, lists of text, numbers, booleans, and metaobject references, once they're enabled in the Search & Discovery app.

### What should happen when nothing matches?

Say so plainly, and suggest the nearest alternative, such as the closest size or the next price point. A blank page loses the shopper.

### Does a product finder help SEO?

Not directly. Its job is conversion. Keep your collection pages crawlable and well written, and let the finder hand shoppers to them with filters applied.
