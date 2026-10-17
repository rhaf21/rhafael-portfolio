---
title: "How to build a quote request flow on Shopify with Draft Orders"
slug: "shopify-quote-flow-draft-orders"
category: "tutorial"
status: "draft"
publishedAt: "2026-10-17"
readingTime: 7
tags:
  - Shopify
  - Draft Orders API
  - B2B
  - GraphQL
  - Quote requests
excerpt: "Replace “email us for pricing” with a quote that turns into a real order: the buyer requests it, your team prices it as a draft order, and they pay through Shopify's own checkout."
---

# How to build a quote request flow on Shopify with Draft Orders

Use Shopify's Draft Orders API. The buyer builds a quote on your storefront, your app turns it into a draft order with their items, quantities, and contact details, your team adjusts prices or applies trade pricing in the Shopify admin, and Shopify emails them an invoice. The buyer pays through Shopify's own checkout from that invoice link, and the quote becomes a real order the moment it's paid. No separate quoting tool, and nothing to reconcile afterwards.

I build these for stores that sell to businesses. Displaysense, a UK display and signage retailer with more than 3,500 products, sells to trade buyers and to schools, the NHS, and councils, the kind of customers who need a quote before they can buy. The quote flow I built on Draft Orders replaced "email us for pricing" with a request that lands straight in their Shopify admin. This guide is the pattern, with operations validated against the 2026-10 Admin API.

## Why is "email us for pricing" costing you orders?

Because every step it adds is a place to lose the buyer. They have to find your email, describe what they want in a message, wait for a reply, and then come back to check out somewhere else. A procurement buyer comparing three suppliers will often go with whichever one answers in a format they can approve.

On your side, the email becomes manual work: retyping product names into a spreadsheet, building a PDF, chasing the reply, then entering the order. Every quote that converts gets typed in twice, and the ones that don't leave no trace you can learn from.

A draft order fixes both ends. The buyer's request arrives structured, with real products and quantities. Your team prices it where they already work, and the buyer pays in the same checkout as every other customer.

## How does a Draft Orders quote flow work?

Five steps, and Shopify handles three of them:

1. **The buyer requests a quote.** A "request a quote" button or drawer on the storefront collects products, quantities, and contact details.
2. **Your app creates a draft order.** A small backend receives the request and calls `draftOrderCreate` with the line items, the buyer's email, and a tag such as `quote-request`.
3. **Your team prices it.** In the Shopify admin they adjust quantities, override a line price, add a trade discount or shipping, and check the total.
4. **Shopify sends the invoice.** One click in the admin, or `draftOrderInvoiceSend` from your app, emails the buyer a secure checkout link.
5. **The buyer pays.** The invoice opens Shopify's checkout. When they pay, the draft order becomes a normal order, with stock, fulfillment, and reporting working as usual.

Try the middle of that flow:

{{embed:draft-order-quote}}

## What does the API call look like?

The request your backend sends is one mutation. This is the shape I use, validated against the 2026-10 Admin API schema:

```graphql
mutation CreateQuote($input: DraftOrderInput!) {
  draftOrderCreate(input: $input) {
    draftOrder {
      id
      name
      invoiceUrl
      totalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

The variables carry the buyer's request. Line items use real variant IDs, so Shopify knows the products, their prices, and their stock. A trade discount goes in `appliedDiscount`, either across the whole order or on a single line:

```json
{
  "input": {
    "email": "buyer@school.example",
    "tags": ["quote-request"],
    "note": "Trade quote requested from the storefront",
    "lineItems": [
      { "variantId": "gid://shopify/ProductVariant/1001", "quantity": 10 },
      { "variantId": "gid://shopify/ProductVariant/1002", "quantity": 2 }
    ],
    "appliedDiscount": { "title": "Trade pricing", "valueType": "PERCENTAGE", "value": 10 }
  }
}
```

When your team is ready, `draftOrderInvoiceSend` emails the invoice. The app needs the `write_draft_orders` and `read_draft_orders` access scopes. The full reference is in [Shopify's draftOrderCreate docs](https://shopify.dev/docs/api/admin-graphql/latest/mutations/draftOrderCreate).

## Where should the request be handled?

Never in theme JavaScript. Creating a draft order needs an Admin API token, and anything in the theme is public. Anyone could read the token from the page source and use your store's admin API.

The request goes to a server you control. Two common options:

- **An app proxy.** Shopify forwards a request from a path on your store's own domain to your app, and signs it so your app can check it really came through the store.
- **A small serverless function** that the storefront posts to, with its own spam protection.

Either way, the server re-checks everything the browser sent: that each variant exists and is sellable, that quantities are sensible, and that prices come from Shopify rather than from the request. The storefront only ever says "these products, these quantities".

## What should happen after the request comes in?

The quote flow fails quietly if nobody notices new requests, so the details after creation matter as much as the mutation:

- **Tell the team immediately.** An email or a chat message with the buyer, the total, and a link to the draft order in the admin.
- **Confirm to the buyer.** An instant "we've got your quote request" email, with when to expect the priced quote.
- **Hold stock if it's tight.** Draft orders can reserve inventory until a set date with `reserveInventoryUntil`, so the quoted items don't sell out while the buyer gets approval.
- **Tag and tidy.** Tag every request, and clear out stale ones on a schedule. A draft orders list full of abandoned quotes is how teams stop trusting it.
- **Send it to the CRM.** If sales follow up from a CRM, pass the request there too, so an unanswered quote becomes a task rather than a forgotten email.

## Should you use draft orders or Shopify's native B2B features?

If your plan includes Shopify's native B2B features, some of this comes built in. They solve a different problem:

| Need | Draft order quotes | Native B2B |
|---|---|---|
| One-off negotiated quotes | Built for it | Not the main use |
| Buyers you don't know yet | Anyone can request | Buyers need a company account |
| Fixed price lists per customer | Manual each time | Catalogs handle it |
| Payment terms like net 30 | Possible on the draft | Built in |
| Volume pricing and quantity rules | Manual each time | Built in |

Many stores use both: native B2B for established trade accounts with agreed pricing, and draft order quotes for new buyers and one-off requests, like a school buying for a new building.

## What are the most common mistakes?

- **Putting the Admin token in the theme.** Covered above, and the single most damaging one.
- **Trusting prices from the browser.** The storefront sends products and quantities. Prices come from Shopify or from your team.
- **No spam protection.** A public form that creates admin records will be found by bots. Add a honeypot field and rate limiting at least.
- **No owner for new requests.** If nobody is notified, the flow is slower than the email it replaced.
- **Letting draft orders pile up.** Tag, expire, and clean up, or the list becomes noise.

## Key takeaways

- A quote request should become a draft order, so it turns into a real order when the buyer pays.
- The storefront sends only products and quantities; a server you control creates the draft order.
- Your team prices the quote in the Shopify admin, and the invoice email does the rest.
- Notify the team, confirm to the buyer, and reserve stock when supply is tight.
- Use native B2B for established accounts and draft order quotes for everyone else.

If you'd rather have this built than build it, it's one of my [Shopify services](/services#shopify), and the [work page](/projects) shows the stores I've built it for.

## FAQ

### Can Shopify do quote requests without an app?

Not on the storefront. Staff can create draft orders and send invoices from the admin by hand, but letting buyers request a quote from the store needs a form and a small backend or app that calls the Draft Orders API.

### Does the buyer pay through Shopify checkout?

Yes. The invoice email contains a secure link to Shopify's checkout for that draft order. When the buyer pays, the draft order becomes a normal order.

### Can I hold stock while a quote is pending?

Yes. Draft orders can reserve inventory until a date you set, so the quoted items stay available while the buyer gets approval.

### Is a draft order quote the same as Shopify B2B?

No. Native B2B gives established company accounts their own catalogs, payment terms, and volume pricing. Draft order quotes handle one-off, negotiated requests from any buyer. Many stores use both.

### How much does a quote request flow cost to build?

A quote flow on an existing Shopify store typically comes to between $1,500 and $3,000, depending on the form, the notifications, and whether quotes also go to a CRM. My rate card has the details.
