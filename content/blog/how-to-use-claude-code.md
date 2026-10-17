---
title: "How to use Claude Code properly: a field guide for 2026"
slug: "how-to-use-claude-code"
category: "tutorial"
status: "published"
publishedAt: "2026-10-17"
readingTime: 12
tags:
  - Claude Code
  - AI agents
  - Developer workflow
  - CLAUDE.md
  - Hooks
excerpt: "Use Claude Code like an engineer you manage: give it a check it can run, plan before it builds, keep its context clean, and put rules where they're enforced. A working developer's field guide."
---

# How to use Claude Code properly: a field guide for 2026

Use Claude Code like a capable engineer you're managing, not a chatbot you're prompting. Give it a check it can run, make it plan before it builds, keep its context clean, and put the rules that matter where they're enforced rather than merely requested. Nearly everything else in this guide is a version of those four ideas.

I rebuilt this website with Claude Code: every page, the motion, the structured data, and the SEO layer. I also use it on client Shopify stores and CRM builds. So this isn't a feature tour. It's what holds up on real work, checked against the official docs and current to Claude Code v2.1.302, released in October 2026.

## What is Claude Code, and what changed recently?

Claude Code is Anthropic's agentic coding tool. It runs in your terminal, in VS Code and JetBrains, in a desktop app, and in the browser. Unlike a chat window, it reads your files, runs commands, edits code, and works through a problem in a loop until it decides the work is done. That last part is the whole game: the quality of the result depends on how "done" gets decided.

A few changes from the last few months matter for how you work:

- **Auto mode is the default.** Since v2.1.283, interactive terminal and VS Code sessions start in auto mode, where a separate classifier model reviews actions and blocks risky ones instead of asking you about every file write.
- **Long sessions survive coffee breaks.** Idle compaction (v2.1.299) compacts a conversation over 200K tokens that sits idle for about 54 minutes, before the one-hour prompt cache expires, so your next message doesn't reprocess the whole history.
- **Mods.** Plugins can now ship mods (v2.1.299 onward) that hook into session events and the interface.
- **More ways to run work in parallel.** Agent view (`claude agents`, a research preview) watches background sessions from one screen, and dynamic workflows run many subagents from a script Claude writes.

Features will keep changing. The habits below won't.

## Why is verification the single most important habit?

Because Claude stops when the work looks done, and without a check it can run, "looks done" is the only signal it has. Anthropic's own [best practices guide](https://code.claude.com/docs/en/best-practices) puts this first, and their power-user tips call it the most impactful practice of all.

A check is anything that returns pass or fail in the conversation: a test suite, a type-checker, a build, a linter, or a screenshot compared against a design. My portfolio's CLAUDE.md opens with exactly one rule in capitals:

```markdown
## MANDATORY: Run After ANY File Modification
**ALWAYS run `npx tsc --noEmit` after editing, creating, or deleting ANY file.**
```

Type-checking catches broken code. It doesn't catch a page that compiles and looks wrong, so for anything visual I have Claude open the page in a real browser, take screenshots, compare them with the design, and read the console. On this site, that caught four bugs that type-checking and the production build both passed:

- The serif headline font silently fell back to a sans-serif. The font variables were defined on `body` while the design tokens read them from `:root`.
- The receipt animation's stamp sat on top of the totals on narrow screens.
- A data table scrolled sideways on phones and hid the two columns that mattered.
- A scroll-reveal script triggered React hydration warnings, because it marked elements before the page finished hydrating.

Once a check exists, decide how firmly it gates the end of a task. In one prompt, ask Claude to run it and iterate. Across a session, set it as a `/goal`, and a separate evaluator re-checks it after every turn. As a hard gate, a Stop hook runs your check as a script and won't let the turn end until it passes. And for a second opinion, run the bundled `/code-review`, which reviews the diff in a fresh subagent that didn't write the code.

Whatever you choose, ask for evidence rather than assurance: the command it ran and what came back, or the screenshot. Reading evidence is faster than re-running the check yourself.

## Should you plan before letting it write code?

For anything that touches more than one file, yes. Press `Shift+Tab` until the status bar shows plan mode, or start with `claude --permission-mode plan`. Claude reads and answers questions without changing anything. Ask it to explore the relevant code, then to write a plan, and press `Ctrl+G` to edit that plan in your own editor before approving it.

Skip planning when you could describe the change in one sentence. A typo, a log line, or a renamed variable doesn't need a plan. It just needs doing.

For a larger feature, flip the roles and have Claude interview you. Start with a short description, ask it to question you about edge cases and tradeoffs, and have it write the answers to a `SPEC.md`. Then start a fresh session to build from the spec. The new session has clean context and a written target, and a good spec names the files involved, says what's out of scope, and ends with a test that proves the feature works.

## What belongs in CLAUDE.md, and what doesn't?

CLAUDE.md is the file Claude reads at the start of every session. Run `/init` to generate a starter, then cut it down. The official guidance is to keep it under about 200 lines and to ask of every line: would removing this cause Claude to make a mistake? If not, delete it. A bloated CLAUDE.md is worse than a short one, because the rules that matter get lost and Claude starts ignoring them.

Put in commands Claude can't guess, conventions that differ from the defaults, testing instructions, and project gotchas that aren't obvious from the code. Leave out anything Claude can figure out by reading the code, standard language conventions, long tutorials, and anything that changes often. Run `/doctor` on a checked-in CLAUDE.md and Claude proposes cuts for content it can work out on its own.

Three more things worth knowing:

- **Files can live at several levels.** `~/.claude/CLAUDE.md` holds your personal preferences for every project, `./CLAUDE.md` holds the team's, and `./CLAUDE.local.md` holds your personal notes for one project. Rules in `.claude/rules/` can be scoped so they only load when Claude opens matching files.
- **Claude keeps its own notes.** Auto memory saves what it learns from your corrections to `~/.claude/projects/<project>/memory/`, sorted into four kinds: user, feedback, project, and reference. It loads the first 200 lines or 25KB each session. Run `/memory` to read, edit, or switch it off.
- **Emphasis is a scarce resource.** If one rule keeps getting skipped, mark that line IMPORTANT. If you mark ten lines, none of them stands out.

## Where should an instruction live?

This is the question that separates a setup that works from one that drifts. Claude Code has several places to put instructions, and each loads at a different time and costs a different amount of context. Pick what you need and see where it belongs:

{{embed:claude-code-extensions}}

The one distinction to remember: a line in CLAUDE.md is a request, and a hook is enforcement. "Never edit the .env file" in CLAUDE.md usually works. A `PreToolUse` hook that blocks the edit always works. If something must hold every time, make it a hook. This one type-checks after every edit, so the rule from my CLAUDE.md can't be skipped:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx tsc --noEmit" }]
      }
    ]
  }
}
```

You don't need to build all of this on day one. The official guidance is to add each piece when its trigger shows up: a convention Claude gets wrong twice goes in CLAUDE.md, a prompt you keep retyping becomes a skill, a side task that floods your conversation goes to a subagent, and the moment you want the same setup in a second repository, you package it as a plugin.

## How do you keep the context window from going stale?

Context is the resource everything else depends on. Every message, file read, and command output fills it, and as it fills, Claude starts forgetting earlier instructions and making more mistakes. Manage it on purpose:

- Run `/clear` between unrelated tasks. One session per job.
- Run `/compact` with a focus, like `/compact Focus on the checkout changes`, when a long session needs to continue.
- Press `Esc` to stop Claude mid-action without losing context, and `Esc` twice or `/rewind` to roll the conversation, the code, or both back to an earlier checkpoint.
- Ask quick side questions with `/btw`. The answer never enters the conversation history.
- Send investigations to a subagent: "use a subagent to find every place we call the payments API." It reads the files in its own context and returns only a summary.
- Name sessions with `/rename` and pick them up later with `claude --continue` or `claude --resume`.

The most useful rule of thumb from the official guide: if you've corrected Claude twice on the same thing, stop correcting. Run `/clear` and write a better first prompt that includes what you learned. A clean session with a sharper prompt beats a long one full of failed attempts.

One warning on rewinding: checkpoints only track edits made through Claude's file tools. Changes made by shell commands aren't captured. Checkpoints are an undo button, not a replacement for git.

## Which permission mode should you use?

Permission modes decide what Claude can do without asking you. Switch with `Shift+Tab`, or set one with `--permission-mode`:

| Mode | Runs without asking | Use it for |
|---|---|---|
| Manual (`default`) | Reads only | Sensitive work where you review every action |
| `acceptEdits` | Reads, file edits, and basic file commands | Iterating on code you're watching |
| `plan` | Reads, plus commands the classifier approves | Exploring before changing anything |
| `auto` | Everything, with a classifier checking risky actions | Long tasks without prompt fatigue |
| `dontAsk` | Only tools you pre-approved; everything else is denied | CI and unattended scripts |
| `bypassPermissions` | Everything | Isolated containers and VMs only |

Auto mode is a good default for most work. By default its classifier blocks downloading and running code like `curl | bash`, sending sensitive data to outside endpoints, production deploys and migrations, mass deletion of cloud storage, granting access permissions, modifying shared infrastructure, irreversibly deleting files that existed before the session, and force-pushing.

Two settings matter more than the mode. Deny rules block in every mode, including `bypassPermissions`, so put your secrets there. And `/sandbox` turns on OS-level isolation, which lets Claude work freely inside boundaries you set:

```json
{
  "permissions": {
    "deny": ["Read(./.env)", "Read(./.env.*)", "Read(./secrets/**)"]
  }
}
```

Never run `bypassPermissions` on the machine that holds your client credentials. The docs say containers and VMs only, and they mean it.

## How I use it on client Shopify and CRM work

Everything above is general. This is what I add when the code belongs to someone else.

**The live store is off limits.** Work happens on a duplicate theme or a development store, gets checked, and the client publishes. Claude never pushes to a live theme or a production CRM workflow, and auto mode backs that up by blocking production deploys.

**Client details stay out until the client says yes.** On this site, one case study belongs to a Sydney milliner who hasn't yet approved publishing their name or analytics. Instead of trusting myself to remember, I had Claude put a single switch in the code. While it's off, every page, the share copy, and even the receipt in my intro video say "a Sydney milliner" and show no conversion numbers. Making it a code-level switch means nothing slips out by accident.

**Verification finds the problems nobody reported.** While rebuilding this site, Claude's checks turned up two bugs that had been live for months:

- The security headers never ran. `middleware.ts` sat at the project root, but the app lives in `src/`, and Next.js only loads middleware from `src/` in that layout. A one-line `curl` of the live site showed no security policy header.
- Mistyped links showed a bare default page. The site and the CMS use separate root layouts, so unknown URLs never reached the designed 404 page. A catch-all route fixed it.

Neither showed up as an error. Both showed up because the work required evidence.

**One task at a time.** Parallel agents are powerful, and they also multiply cost. I run one task at a time with a visible list of what's next, and reach for subagents only when a side task would otherwise flood the main conversation.

If you'd rather have this kind of work done on your store or CRM than learn the tooling yourself, that's what my [services](/services) are for, and the [CRM case study](/projects/gohighlevel-n8n-crm-build) shows what a finished job looks like.

## What should you avoid?

The official guide names five failure patterns, and I've hit every one:

- **The kitchen-sink session.** One task, then an unrelated question, then back to the task. The fix is `/clear` between unrelated work.
- **Correcting over and over.** Each failed correction stays in context and makes the next attempt worse. After two, clear and rewrite the prompt.
- **The over-specified CLAUDE.md.** Rules get lost in the noise. Prune it, and turn anything that must always happen into a hook.
- **The trust-then-verify gap.** Plausible code that misses edge cases. If you can't verify it, don't ship it.
- **The endless investigation.** "Look into X" with no scope reads hundreds of files. Scope it, or give it to a subagent.

Two more from my own work. Don't let an AI reviewer turn into over-engineering: a reviewer asked to find gaps will always find some, so tell it to flag only what affects correctness or the requirements. And don't accept "done" as a status. Make every task end as done, partial, blocked, or waiting on you, with the evidence attached.

## Key takeaways

- Give Claude a check it can run, and ask for the evidence, not the claim.
- Plan anything that spans files. Skip planning for one-sentence changes.
- Keep CLAUDE.md under about 200 lines, and move anything that must always happen into a hook.
- Treat context as the scarce resource: `/clear` between tasks, subagents for investigations, and a fresh start after two failed corrections.
- Default to auto mode, put secrets behind deny rules, and keep `bypassPermissions` inside containers.
- On client work, never touch the live store, and keep client details behind a switch until they approve.

## FAQ

### Is Claude Code safe to use on client projects?

Yes, with guardrails. Work on a copy of the store or a development environment, keep secrets behind deny rules, use auto or Manual mode rather than bypassing permissions, and review the diff and its evidence before anything goes live. Auto mode blocks production deploys and force-pushes by default.

### How long should a CLAUDE.md file be?

Under about 200 lines, per the official guidance. Keep only what Claude would get wrong without it, move occasional reference material into skills, and run /doctor to find content Claude can work out from the code.

### What is the difference between a skill and a subagent?

A skill is reusable instructions or reference material that loads into your current conversation when needed. A subagent is a separate worker with its own context window that does a task and returns only a summary, which keeps your main conversation clean.

### Can Claude Code work on its own without me watching?

Yes, if it has a way to verify the result. Run it in auto mode, set the success check as a /goal or a Stop hook, and review the evidence when it finishes. Without a check, an unattended run stops when the work looks done, not when it is done.

### Do you need to be a developer to use Claude Code?

You can start without being one, but shipping safely takes a developer's judgment: knowing what to verify, reading a diff, and recognizing when a confident answer is wrong. It multiplies an engineer's skill rather than replacing it.
