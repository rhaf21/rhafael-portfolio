---
title: "Automation that earns its keep: n8n, Zapier, and knowing when to write code"
slug: "automation-that-earns-its-keep"
category: "insights"
status: "published"
publishedAt: "2026-05-25"
readingTime: 8
tags:
  - Automation
  - n8n
  - Zapier
  - Make
  - Webhooks
  - AI agents
excerpt: "Most business automation isn't an AI problem, it's a plumbing problem. Here's how I decide between Zapier, Make, n8n, and writing the code myself, and why the boring version usually wins."
---

# Automation that earns its keep: n8n, Zapier, and knowing when to write code

Most of the automation work I get hired for starts the same way. Someone on the team is spending two hours every morning moving data between tools by hand. A new Shopify order needs to land in a spreadsheet, ping a Slack channel, create a task, and email the customer something the default receipt doesn't say. Nobody decided this should be manual. It just grew that way, one tool at a time, until a person became the integration layer.

That person is almost never the bottleneck people think they are. The bottleneck is that the tools don't talk to each other, and somewhere along the line copy-paste became the protocol.

This is the unglamorous middle of software. It isn't a machine-learning problem and it usually isn't even a hard engineering problem. It's plumbing. And the difference between automation that sticks and automation that quietly breaks two weeks later is almost entirely about picking the right level of tool for the job.

Here's how I actually decide.

## The first question is never "which tool"

Before I open n8n or Zapier, I map the workflow by hand. Trigger, steps, branches, the data that moves between them, and the failure cases. Most of the value is in this map, not the tool. A bad automation is usually a process that nobody fully understood, now running faster.

Three things I'm looking for:

1. **What's the trigger, and is it reliable?** A webhook from Shopify is solid. "Someone remembers to tag the row" is not a trigger, it's a wish.
2. **How many systems does this touch, and do they have real APIs?** Two well-documented APIs is an afternoon. One of them being a 2009 SOAP endpoint with no sandbox is a project.
3. **What happens when a step fails at 2am?** Silent failure is the default in most no-code tools, and silent failure in a billing workflow is how you lose a client's trust in one weekend.

If I can't answer those three, no tool will save the automation. If I can, the tool choice mostly falls out of it.

## The ladder: Zapier, Make, n8n, code

I think of automation platforms as a ladder. You climb only as high as the job demands, because every rung up trades ease for control.

**Zapier** is the top of the ladder: the fastest to ship, the most expensive to run at volume, and the least flexible when logic gets weird. It's the right call when a non-technical team needs to own the automation after I leave, when the workflow is genuinely linear (this, then this, then this), and when the volume is low enough that per-task pricing doesn't sting. I've shipped client automations in Zapier in an afternoon that would have been a week of "real" work, and the client could maintain them without me. That last part is the whole point.

**Make** (formerly Integromat) is one rung down. The visual scenario builder handles branching, iteration, and data transformation that Zapier makes painful. When a workflow needs to loop over line items, route on conditions, and reshape JSON before it hits the next system, Make is usually where I land. It's cheaper at volume and the operations model is more honest about what's actually happening.

**n8n** is where I go when the workflow needs to run on infrastructure I control. Self-hosted, open-source, no per-task pricing, and a Code node when the visual blocks run out. I reach for it when there's sensitive data that shouldn't transit a third party, when volume would make Zapier or Make absurd, or when the client wants to own the whole thing forever with no vendor lock-in. The trade is that someone now owns a server. That's a real cost, and I say so up front.

**Code** is the bottom of the ladder and sometimes the only honest answer. A webhook handler in a Next.js route, a scheduled function, a small queue. I write it when the logic is too gnarly for any visual tool, when it lives inside an app I'm already maintaining, or when I need real tests around something that touches money. It's the most work to build and the most durable to run.

| Signal | Where I land |
|---|---|
| Non-technical team must own it after handoff | Zapier |
| Linear, low volume, two friendly APIs | Zapier |
| Branching, looping, JSON reshaping | Make |
| High volume, sensitive data, no vendor lock-in | n8n (self-hosted) |
| Lives inside an app I already maintain | Code (webhook + queue) |
| Touches billing and needs real tests | Code |

The mistake I see most often is starting at the wrong end. Teams reach for code when a Zap would do, or wire a fragile Zap when the logic clearly wanted n8n. The ladder isn't about prestige. It's about matching durability to stakes.

## AI agents are a step, not the whole pipeline

Everyone wants the automation to be "AI" now. Most of the time the AI is one step in an otherwise boring pipeline, and that's exactly where it belongs.

A pattern I've used repeatedly: a webhook fires, the workflow gathers context from a couple of systems, hands a tightly scoped prompt to a model (drafting a reply, classifying an inbound message, summarising a ticket), and then a deterministic step decides what to do with the output. The model drafts. It does not send. A human approves anything that goes to a customer, or a hard rule gates it.

The reason is simple: a language model is a probabilistic step in a system that mostly needs to be deterministic. It's brilliant at the fuzzy middle (turn this messy email into a structured intent) and dangerous at the edges (decide whether to issue a refund). Good automation uses it for the former and never the latter without a guardrail.

The other thing I've learned: log the prompt and the response, every time. When an AI step does something strange, and it will, you want the exact input and output sitting in a table, not a vague memory of "it usually works."

## The boring parts that decide whether it survives

The flashy demo is the trigger firing and the happy path completing. The thing that decides whether an automation is still running in six months is everything around that.

- **Idempotency.** Webhooks get delivered twice. If your "create order" step runs twice, you've now got a duplicate and an angry customer. Every write step needs a dedupe key. This is the single most common bug I'm hired to fix in someone else's automation.
- **Visible failure.** Every workflow I ship has a failure path that pings a channel a human actually reads. Silent retries that eventually give up are worse than a loud error, because the loud error gets fixed and the silent one becomes a slow leak.
- **A kill switch.** One toggle that stops the whole thing. When something goes wrong at scale, "pause it now, debug later" beats "frantically delete steps in production."
- **Rate limits and backoff.** The third-party API will throttle you on the busiest day, which is exactly the day the automation matters most. Respect the limits or get blocked when it counts.

None of this is exciting. All of it is the difference between an automation that earns its keep and one that becomes a liability nobody wants to touch.

## What "earns its keep" actually means

I have one bar for whether an automation was worth building: does it save more than it costs to run and maintain? That includes my time, the platform fees, and the cognitive overhead of one more thing that can break.

A two-hour daily task automated reliably is roughly five hours a week back, every week, forever. That's enormous, and it's the easy win. But I've also talked clients out of automating things, because the task happened twice a month and took ten minutes, and the automation would have been a fragile dependency that cost more attention than it ever saved. The most valuable advice in this space is sometimes "leave that one manual."

Automate the workflows that are frequent, well-understood, and high-stakes when they go wrong. Leave the rare, fuzzy, low-stakes ones to a human. Then make the ones you do build loud when they fail and impossible to run twice.

That's the whole craft. It isn't glamorous. It just quietly gives people their mornings back, which is the only metric that ever mattered.
