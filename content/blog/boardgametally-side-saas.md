---
title: "BoardGameTally: a side-project SaaS that pays its own hosting"
slug: "boardgametally-side-saas"
category: "case-study"
status: "published"
publishedAt: "2026-05-13"
readingTime: 9
tags:
  - SaaS
  - Multi-tenant
  - Next.js
  - MongoDB
  - Ably
  - Side projects
excerpt: "Two years of running a hobby SaaS for tracking board game scores. Multi-tenant subdomains, Elo rankings, and the boring engineering trade-offs that kept it cheap to run."
relatedProjects:
  - "boardgametally"
featuredImage: "/assets/blog/boardgametally-hero.png"
---

# BoardGameTally: a side-project SaaS that pays its own hosting

A friend invited me to "Board Game Night" in early 2024. We played four games over five hours. By the end of the night nobody could remember who'd won the second one, and someone — I think it was me — was insisting they'd had a 2-0 lead in Catan when in fact they'd come third.

That argument cost me one weekend of side-project time. BoardGameTally was born the following Monday.

Two years later it has a handful of paying-attention users, hundreds of game nights logged, real-time score sync across phones and laptops, and a multi-tenant architecture I'm still proud of. It pays its own Vercel and MongoDB bills out of a small Stripe trickle. It is the smallest, most stubborn product I've ever shipped — and exactly the project that taught me when to add complexity and when to absolutely not.

This is what I built, what I scrapped, and what I'd do differently.

## The shape of the problem

BoardGameTally tracks the score for board games across game nights. That sounds trivial — it isn't. Three things make it interesting:

1. **Games aren't uniform.** Settlers has rounds and victory points. Wingspan has phase tracking. Codenames has teams. You can't shove every game into the same schema without making any of them feel right.
2. **Score entry is mobile, fast, and often parallel.** Two people enter scores at the end of a game while three others reset the board. A round of multi-device editing without conflicts.
3. **Rankings should mean something.** A group of friends plays the same six games over two years. They want to know who's actually best at Spirit Island, not who shows up most often.

The fun version of this product is collaborative, real-time, and ranked. The dull version is a Google Sheet.

## Multi-tenant from day one

The first architectural decision I want to defend: **custom subdomains per organization**.

Each group of friends gets their own subdomain — `friday-night.boardgametally.com`, `the-dragons.boardgametally.com` — with its own members, games, and history. New organizations sign up at the root, pick a slug, and they're issued a subdomain in under a second.

This is wildly over-engineered for the user base I had in mind. I built it anyway because:

- **Routing-level tenancy.** Middleware reads the subdomain and injects an `orgId` into every request. There's no `?org=` query param, no header to forget. URL shape is the contract.
- **Cookie isolation.** Auth cookies are scoped to the subdomain. Two friends in two different groups can sign in on the same laptop without colliding.
- **Sharing feels right.** "Send your group this link" works because the link contains the org. No tenant picker, no "switch organization" dropdown.

Implementation is a 30-line `middleware.ts` in Next.js that does the subdomain → `orgId` lookup, plus a database guard on every read/write. The wildcard DNS is one record at the registrar. Vercel issues SSL automatically.

The lesson: **multi-tenant is a routing decision, not a database decision.** Lots of advice on the internet treats multi-tenancy as a "do I have one DB per tenant or a shared DB with a tenant column?" question. Both are valid. Neither is the hard part. The hard part is making sure every code path can answer "which tenant am I serving?" without thinking. Subdomains solve that better than any pattern I've tried.

## Real-time without overspending

When you enter a score on the phone, the laptop on the table updates instantly. That's the moment that sells the product, and it's the moment that almost ate my margin.

I tried three things in order:

**Polling.** A fetch every 3 seconds while the page is open. It worked. It was awful. On a slow night with three open tabs, MongoDB Atlas usage spiked enough to notice. I left it for a week and moved on.

**WebSockets, self-hosted.** I stood up a tiny Fastify server with `ws` and a Redis pub/sub. It worked and it was free. But the second I closed my laptop for the night the connection dropped, and reconnection logic in a Next.js app deployed to Vercel is a forest of edge cases I didn't want to maintain on a side project.

**Ably.** Paid, but the free tier — 3 million messages a month, 100 concurrent — is comically generous for a hobby SaaS. You publish to a channel scoped to the game session, every connected client subscribes, done. Reconnection is handled. There's a presence API that tells you who else is on the score-entry screen so you don't double-submit. I switched in an afternoon.

The decision tree I'd give anyone in the same spot:

| Signal | Pick |
|---|---|
| You don't have product-market fit yet | Polling. Don't even think about WS until people care. |
| You have one box, low traffic, full control | Self-hosted WS with Redis. |
| You're on serverless and want sleep | Ably or Pusher. Pay the few cents per active user. |
| You're at scale and Ably's price is now scary | Self-hosted WS, dedicated infra. |

I'm currently three steps ahead of where I needed to be. Worth it for the no-3am-pages factor.

## Elo, tuned for the messy real world

Elo ratings were a hard week. The math is simple — your rating goes up when you beat someone higher-rated than you, down when you lose to someone lower — but the tuning for boardgames is fiddly.

Problems I had to solve:

- **More than two players.** Classic Elo is 1v1. With four players, "first place" beat three others — three pairwise Elo updates per game.
- **Game-specific volatility.** A win in Codenames means less than a win in Twilight Imperium (10 hours, four people, one mistake costs you). I weighted Elo deltas by game "weight," a 1–5 number scraped from BoardGameGeek.
- **Cold start.** A new player against four veterans can't carry a tiny K-factor. New players get an inflated K for their first ten games to converge faster.

I also added a **floor**: nobody drops below a configurable rating. Otherwise a friend who lost five Wingspan games in a row threatened to quit the app. (He was right. He'd never have played enough to catch up.)

The mistake I'd undo: I shipped global rankings before per-game rankings. People care about "who's best at Spirit Island," not "who has the highest overall Elo across our weird sample of 12 games." Per-game leaderboards landed three months later than they should have.

## Schema design that survived two years

The data model is dumber than I expected to need. Three core collections:

- `organizations` — name, slug (the subdomain), settings (theme, default game weight)
- `members` — user × org, with roles
- `gameNights` — date, org, attendees (member array)
- `playRecords` — gameNight × game × member × score × rank

That's it. Rankings, Elo, leaderboards, weekly digests — all derived views computed at read time and cached briefly. I resisted the temptation to denormalize until the cache hit rate told me to.

The denormalization that did pay off: a `memberStats` document per member-per-org with their current Elo, game counts, last-played-at. It's rebuilt on every play submit (cheap) and saves a thousand-document aggregation on every leaderboard read. Worth the write-amplification ten times over.

The denormalization I tried and rolled back: pre-computed per-week leaderboards. They were stale within minutes, the cron job to rebuild them was annoying to debug, and the read pattern wasn't there. The slow query I was scared of was 80ms and run once a week per org. Building a system to dodge it cost me a weekend.

The lesson is the obvious one: **measure before you denormalize**, and don't optimize the query you're scared of until the data tells you it's actually a problem.

## What it costs to run

The whole stack:

- **Vercel Hobby** — free. The traffic doesn't justify Pro.
- **MongoDB Atlas M0** — free, 512MB. Currently at 38MB.
- **Ably free tier** — 3M messages/month. Currently using ~120k.
- **Cloudflare for the apex domain + wildcard DNS** — free.
- **Stripe** — pay-as-you-go fees on the small recurring trickle.

The Stripe trickle covers my domain renewal with margin. That's the bar I set: it pays its own bills. Once it crossed it I stopped trying to grow it and started enjoying it.

## What I'd do differently

Three things, in order of regret:

1. **Per-game rankings first, global rankings never.** I should have shipped "best at this specific game" on day one and skipped global Elo entirely. Global rankings are vanity; per-game leaderboards drive return visits.
2. **No social login on day one.** I added Google and GitHub OAuth because every SaaS template included it. Two years in, 100% of users sign in with email-and-password. The OAuth code is dead weight I now have to maintain.
3. **Build the export before you need it.** A friend asked me for a CSV of his two-year game history. I wrote it that afternoon. I should have built it on day one — the moment your product is worth using, somebody will want their data out of it.

## What's next

I'm not trying to turn it into a real business. The fun of it is that it's the right size: small enough to fix on a Sunday, big enough to be the source of truth for our group's two-year argument about who's best at Wingspan. (Me. It's clearly me. The data says so.)

If you're sitting on a side-project idea that you keep telling yourself "isn't big enough," consider that it doesn't have to be. The smallest product I've ever shipped is the one I've maintained the longest and learned the most from. Build the thing that scratches your itch. Charge whatever covers the hosting. Stop there.
