"use client";

import { useState } from "react";

interface Option {
  need: string;
  answer: string;
  loads: string;
  cost: string;
  example: string;
  docs: string;
}

// From the official comparison: https://code.claude.com/docs/en/features-overview
const OPTIONS: Option[] = [
  {
    need: "Claude should always know it",
    answer: "CLAUDE.md",
    loads: "Every session, in full",
    cost: "Paid on every request, so keep it under about 200 lines",
    example: "Build and test commands, a convention Claude got wrong twice, “never edit the live theme”.",
    docs: "https://code.claude.com/docs/en/memory",
  },
  {
    need: "It only matters for some files",
    answer: ".claude/rules/",
    loads: "Every session, or only when matching files are opened",
    cost: "Low when scoped with a paths field",
    example: "Liquid conventions that only load while Claude is editing .liquid files.",
    docs: "https://code.claude.com/docs/en/memory",
  },
  {
    need: "A long reference or a repeatable workflow",
    answer: "Skill",
    loads: "Description every session, full content when used",
    cost: "Low until invoked; zero for skills only you can trigger",
    example: "An /audit checklist for a CRM account, or the API style guide for a project.",
    docs: "https://code.claude.com/docs/en/skills",
  },
  {
    need: "It must happen every time, no exceptions",
    answer: "Hook",
    loads: "Runs outside the conversation on an event",
    cost: "Zero, unless the hook returns output",
    example: "Type-check after every edit, or block any write to .env.",
    docs: "https://code.claude.com/docs/en/hooks-guide",
  },
  {
    need: "Data or actions in another system",
    answer: "MCP server",
    loads: "Tool names at start, full schemas on demand",
    cost: "Low until a tool is used",
    example: "Reading contacts and pipelines from a CRM instead of pasting exports into chat.",
    docs: "https://code.claude.com/docs/en/mcp",
  },
  {
    need: "A side task that reads lots of files",
    answer: "Subagent",
    loads: "Its own fresh context when spawned",
    cost: "Isolated: only its summary comes back",
    example: "“Use a subagent to find every place we call the payments API.”",
    docs: "https://code.claude.com/docs/en/sub-agents",
  },
  {
    need: "The same setup in another repo",
    answer: "Plugin",
    loads: "Whatever it bundles: skills, hooks, subagents, MCP",
    cost: "The sum of its parts",
    example: "Packaging a team's review skill and lint hook so every repo gets them.",
    docs: "https://code.claude.com/docs/en/plugins/overview",
  },
];

/** "Where should this instruction live?": pick a need, get the Claude Code feature built for it. */
export function ExtensionPicker() {
  const [i, setI] = useState(0);
  const o = OPTIONS[i];

  return (
    <div className="picker">
      <div className="picker-q">
        <span className="picker-label">What do you need?</span>
        <div className="picker-opts" role="group" aria-label="What do you need?">
          {OPTIONS.map((opt, n) => (
            <button key={opt.answer} type="button" className={n === i ? "on" : undefined} aria-pressed={n === i} onClick={() => setI(n)}>
              {opt.need}
            </button>
          ))}
        </div>
      </div>
      <div className="picker-a" aria-live="polite" key={o.answer}>
        <span className="picker-label">Put it in</span>
        <b>{o.answer}</b>
        <dl>
          <dt>Loads</dt>
          <dd>{o.loads}</dd>
          <dt>Context cost</dt>
          <dd>{o.cost}</dd>
          <dt>For example</dt>
          <dd>{o.example}</dd>
        </dl>
        <a href={o.docs} target="_blank" rel="noopener">
          Official docs ↗
        </a>
      </div>
    </div>
  );
}
