---
title: "The GoHighLevel audit checklist: 15 checks that find lost leads"
slug: "gohighlevel-audit-checklist"
category: "tutorial"
status: "draft"
publishedAt: "2026-10-17"
readingTime: 6
tags:
  - GoHighLevel
  - CRM audit
  - Workflows
  - Lead routing
  - CRM automation
excerpt: "Most GoHighLevel accounts leak in the same places: leads with no owner, contacts stuck in draft workflows, follow-ups that never stop. Fifteen checks, in the order that recovers the most."
---

# The GoHighLevel audit checklist: 15 checks that find lost leads

A GoHighLevel account usually leaks in the same five places: new leads with no owner, contacts stuck in workflows that were never published, follow-ups that never stop, duplicate fields that split your data, and pipelines full of deals that died months ago. Check those first. They cost the most, and none of them shows up as an error, because the account looks busy the whole time.

The fifteen checks below are the ones I run in a paid Systems Audit, in the order that recovers the most. Run them yourself with the interactive version further down, and you'll know where your account stands in about an hour.

## Why do GoHighLevel accounts leak without anyone noticing?

Because GoHighLevel fails quietly. A workflow that never fires doesn't send an alert. A lead with no owner just sits there. A duplicate field doesn't break anything; it just means half your data lives somewhere the reports don't look.

When I audited an Australian training provider's account, the numbers looked like this:

- **27 custom fields duplicated as mirror copies**, so the same fact lived in two places and reports read the wrong one.
- **About 244 contacts stranded in five draft workflows** that had never been published. They were in the CRM and, in practice, nowhere.
- **26 students stranded by a follow-up with a bug.** The document chase that should have collected their paperwork had broken, and they were stuck mid-application.
- **Every new inquiry arriving with no owner**, because round-robin assignment had never been set up.

Nobody had done anything wrong. Each problem was a reasonable shortcut taken by a busy team. That's why an audit counts things instead of asking people what they think is broken. The [full case study](/blog/gohighlevel-as-an-operating-system) shows what happened after.

## Score your account

Tick what's already true. The score weights each check by the damage a gap does, and the list on the right shows your three biggest gaps:

{{embed:ghl-audit-checklist}}

## Leads: does every inquiry reach a person?

**Every new lead gets an owner the moment it arrives.** Open your newest contacts and check the assigned user. If some are blank, find where they came from. A form, a calendar, or an integration without an assignment step is the usual cause. The fix is a workflow that assigns an owner on arrival, by round robin or by rule.

**Someone responds to new inquiries within an hour.** Look at the conversations from new leads in the last month and check how long the first reply took. Slow first replies lose more deals than any other gap on this list, and GoHighLevel can't fix them with automation alone. It can make sure the right person is notified immediately.

## Workflows: do the automations actually run, and stop?

**No contacts are sitting in draft or unpublished workflows.** Filter your workflow list for drafts and check which have contacts enrolled. Each one is a group of people waiting for a message that will never send. Publish it or move them somewhere live.

**Every follow-up sequence has a goal or an exit.** A sequence that chases a document, a payment, or a booking should stop when it gets one. If it doesn't, people who already did the thing keep getting reminders, and people who replied by email get treated as if they hadn't. Use a goal event or an exit condition for every chase.

**Re-entry is set on purpose.** Check each workflow's re-entry setting. Allowing re-entry on a nurture sequence can send the same series twice. Blocking it on a reminder can mean a second booking never gets one.

## Data: is each fact in one place, in the right format?

**No duplicate or mirror custom fields.** Export your custom field list and sort by name. "Course", "Course Name", and "Course (old)" usually mean three places holding one fact. Merge them into one field, update the forms and workflows that write to the others, then remove the extras.

**Money fields are numbers, not text.** A value stored as text can't be summed, averaged, or compared. Check every field that holds a price, a deposit, or a balance.

**Duplicate contacts are prevented or merged.** Search for a few frequent names and emails. If the same person appears twice, check your duplicate-contact settings and how each form and integration matches existing contacts.

## Pipelines: is the forecast real?

**Stale opportunities are closed.** Sort open opportunities by last activity. Anything untouched for months is inflating your pipeline value. Mark it lost with a reason, so the forecast reflects deals that can still close.

**Every stage is used and has an exit rule.** If nobody can say what moves a deal out of a stage, deals will pile up in it. Merge stages nobody uses, and write down the exit rule for the rest.

## Sending: do your messages arrive?

**Email sends from your own authenticated domain.** Sending from a dedicated domain with SPF, DKIM, and DMARC set up keeps your messages out of spam folders and protects your main domain's reputation.

**SMS registration is complete for the countries you text.** In the US, business texting needs A2P 10DLC registration, and unregistered traffic gets filtered or blocked. Check the registration status for every number you send from.

## Access: who can see what?

**Former staff and unused API keys are removed.** Review the user list and the connected integrations. Every login that shouldn't exist is a risk, and every forgotten API key is a door nobody is watching.

**Sensitive documents aren't stored in open notes or shared links.** Identity documents, certificates, and contracts belong somewhere access is controlled. On the training provider build, every new student gets a private, access-controlled folder automatically, instead of files in "anyone with the link" storage.

## Reporting: do the dashboards match reality?

**Dashboards track what the team actually acts on.** If the team keeps a spreadsheet next to GoHighLevel, the dashboard is missing something. Find out what, and either add it or remove the dashboard nobody trusts.

## What should you fix first?

In the order of the checklist. Lead ownership and response time come first because every other improvement depends on leads reaching a person. Workflows that never run or never stop come next, because they affect every contact that passes through them. Data and pipeline clean-up come third: they don't lose leads directly, but they make every report and decision less reliable.

## How does a full audit work?

My Systems Audit runs over five business days: access and a kickoff call on day one, the account's structure mapped and counted on day two, data flows traced on day three, a ranked fix list with a fixed quote on day four, and a walkthrough call on day five. You keep the report either way, and the fee comes off the build if you go ahead with the fixes. The details are on the [services page](/services#audit).

## Key takeaways

- GoHighLevel fails quietly, so audit by counting, not by asking.
- Check lead ownership and response time first; they lose the most.
- Look for contacts stranded in draft workflows and sequences without an exit.
- Merge duplicate fields and close stale opportunities so the reports are true.
- Authenticate your email domain and finish SMS registration before scaling sends.

## FAQ

### How long does a GoHighLevel audit take?

Running this checklist yourself takes about an hour for a small account. A full audit that maps every pipeline, field, and workflow, traces data between systems, and produces a ranked fix list takes about five business days.

### What is the most common problem in GoHighLevel accounts?

New leads without an owner, closely followed by contacts stranded in workflows that were never published. Both lose leads without producing an error, so they go unnoticed for months.

### How do I find contacts stuck in a GoHighLevel workflow?

Filter your workflow list for drafts and check each one's enrolled contacts. Then look for live workflows whose sequences have no goal or exit, because contacts can wait in those indefinitely.

### Should I delete duplicate custom fields?

Merge first, then delete. Move the data into one field, update every form and workflow that writes to the old ones, and only then remove the extras, so nothing that still depends on them breaks.

### Do I need an expert to audit GoHighLevel?

Not for this checklist. An expert audit adds the parts that need access and experience: tracing data between systems, finding workflow bugs, and pricing the fixes so you know the cost before deciding.
