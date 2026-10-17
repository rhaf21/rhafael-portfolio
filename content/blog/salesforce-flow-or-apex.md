---
title: "Salesforce Flow or Apex? How to decide for record-triggered automation"
slug: "salesforce-flow-or-apex"
category: "insights"
status: "draft"
publishedAt: "2026-10-17"
readingTime: 6
tags:
  - Salesforce
  - Flow
  - Apex
  - Triggers
  - CRM automation
excerpt: "Decide by automation density, not by who's building it. Flow for low-density objects, Flow with invocable Apex in the middle, an Apex trigger framework at the top. One entry point per object, always."
---

# Salesforce Flow or Apex? How to decide for record-triggered automation

Decide by how busy the object is, not by who's building the automation. Salesforce's own decision guide calls it automation density: how many automations run on one save, how many records arrive per transaction, and how many other records each change touches. Use Record-Triggered Flow on low-density objects, Flow that calls invocable Apex in the middle, and an Apex trigger framework on high-density objects. Whichever you choose, give each object one entry point and never mix Flow and Apex triggers on it.

That's a shift from the old advice, which said admins use Flow and developers use Apex. I build Salesforce Flows, Apex classes, and triggers, and the density framing matches what goes wrong in real orgs: it's rarely the tool, it's ten automations on one object, all firing at once.

## What is automation density?

It's Salesforce's heuristic for picking the right implementation for an object, measured three ways in its [Record-Triggered Automation Decision Guide](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered):

| Density | Automations per save | Records per transaction | Downstream DML | Use |
|---|---|---|---|---|
| Low | Under 15 | UI edits or small loads, up to 200 | 0 to 1 | Record-Triggered Flow |
| Medium | 15 to 30 | Batches that need careful bulkification | 2 to 4 | Flow with invocable Apex |
| High | Over 30 | Bulk API loads, 2,000 to 10,000 or more | 5 or more | Apex trigger framework |

Weigh all three together, and plan for where the object is heading, not just where it is today. An object that gets bulk loads next quarter is a high-density object now.

Try it with an object from your own org:

{{embed:salesforce-density}}

## When is Flow the right choice?

On low-density objects, which is most of them. Flow is declarative, admins can maintain it, it bulkifies automatically, and it retries certain failures for you.

The single most useful rule in the guide: if the automation only needs to change fields on the record being saved, use a before-save flow. The change is written as part of the original save, so there's no second update and no risk of the record triggering itself again. It's the fastest declarative option Salesforce has.

Use after-save flows for simple work on other records, notifications, and scheduled paths. And gate every flow with entry conditions so it only runs when a field you care about actually changed. Comparing `$Record` with `$Record__Prior` is the way to check that.

## When should you write Apex?

On high-density objects, and whenever you need something Flow can't give you:

- **Bulk loads.** Apex gives you precise control over queries and collections when thousands of records arrive at once.
- **Complex data handling.** Maps and sets across many related records.
- **Transaction control.** Savepoints, rollbacks, and partial saves. Flow has none of these.
- **Validation across several fields** with `addError()`.
- **After-undelete logic**, which invocable Apex can't handle.

The pattern that keeps Apex maintainable is a single trigger per object that hands everything to a handler class. The trigger stays one line, the logic is testable on its own, and the order of operations is decided in code instead of left to the platform, which doesn't guarantee the order of multiple triggers on one object:

```apex
trigger ContractTrigger on Contract (after update) {
    ContractTriggerHandler.afterUpdate(Trigger.new, Trigger.oldMap);
}

public with sharing class ContractTriggerHandler {
    public static void afterUpdate(List<Contract> rows, Map<Id, Contract> oldMap) {
        List<Task> reminders = new List<Task>();
        for (Contract c : rows) {
            // Only act when the field we care about actually changed.
            if (c.EndDate != null && c.EndDate != oldMap.get(c.Id).EndDate) {
                reminders.add(new Task(
                    WhatId = c.Id,
                    OwnerId = c.OwnerId,
                    Subject = 'Renewal reminder',
                    ActivityDate = c.EndDate.addDays(-30)
                ));
            }
        }
        // One insert for the whole batch, never one per record inside the loop.
        if (!reminders.isEmpty()) {
            insert reminders;
        }
    }
}
```

Two habits in that snippet matter more than the syntax. It compares each record with its old value before doing anything, which the guide prefers to static flags for preventing recursion. And it writes once for the whole batch, because triggers receive records in chunks of up to 200, and a query or insert inside the loop will hit governor limits on the first bulk load.

## What does the hybrid pattern look like?

Flow orchestrates and Apex does the hard part. A record-triggered flow handles the routing, the decisions, and the notifications an admin can read, then calls an invocable Apex method for the calculation or the complex data work.

It's the right fit for medium-density objects, and it lets the Apex be reused from other places. The guide notes the cost of calling Apex from Flow is small and worth it at this level. Know the limits: invocable actions run only after-save, so the hybrid can't do before-save updates or after-undelete.

## What goes wrong most often?

- **Mixing Flow and Apex triggers on one object.** Salesforce's guide is direct about it: use one entry point per object. Split automation is hard to debug and impossible to order.
- **Mega-flows with no entry conditions.** A flow that runs on every save and decides internally whether to do anything costs you on every record. Entry conditions and before-save updates are the real performance levers, more than the number of flows.
- **Queries inside loops.** In Apex, a SOQL query inside a loop. In Flow, a Get Records element inside a loop. Both fail under bulk loads. Salesforce Code Analyzer can flag both.
- **Async work from triggers.** Scheduling jobs or starting batches from trigger context is an anti-pattern. For high-volume work that doesn't need to happen instantly, flag records in the trigger and process them with a scheduled flow or scheduled Apex.

## What if your org already mixes both?

Measure density first, then consolidate. On low-density objects, refactor Apex triggers into Flow. On medium-density objects, split mega-flows and move complex logic into invocable Apex. On high-density objects, move to an Apex trigger framework. Start with the busiest objects, usually Account, Lead, Opportunity, and Case.

## Key takeaways

- Choose by automation density: count, volume, and downstream changes.
- Low density: Record-Triggered Flow. Medium: Flow with invocable Apex. High: an Apex trigger framework.
- Use before-save flows for same-record field updates.
- One entry point per object; never mix Flow and Apex triggers on it.
- Run logic only when a field actually changed, and never query inside a loop.

If you want an org untangled rather than a guide, Salesforce Flows, Apex classes, and triggers are part of my [automation builds](/services#automation).

## FAQ

### Should I use Flow or Apex in Salesforce?

Use Record-Triggered Flow for low-density objects, Flow with invocable Apex for medium density, and an Apex trigger framework for high density. Density is how many automations run on one save, how many records arrive at once, and how many other records each change updates.

### Are Workflow Rules and Process Builder still worth using?

No for new work. Salesforce's current guidance treats Record-Triggered Flow and Apex triggers as the two pillars of record-triggered automation. Build anything new in one of those.

### Is Flow slower than Apex?

For most objects the difference doesn't matter. Before-save flows are the fastest declarative option. At very high volumes, Apex has the raw speed advantage and gives you control over queries and transactions.

### Can I have a flow and an Apex trigger on the same object?

You can, but you shouldn't. Salesforce recommends one entry point per object, because automation split across Flow and Apex is hard to maintain and has no guaranteed order.

### How do I stop a trigger from running recursively?

Compare each record with its prior values and only act when the field you care about changed. In Apex, compare Trigger.new with Trigger.oldMap. In Flow, use entry conditions that check for a change.
