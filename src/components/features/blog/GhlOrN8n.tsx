"use client";

import { useState } from "react";

interface Question {
  q: string;
  side: "ghl" | "n8n";
  weight: number;
  why: string;
}

const QUESTIONS: Question[] = [
  { q: "Does your team need to see or edit it inside the CRM every day?", side: "ghl", weight: 2, why: "Your team works in GoHighLevel, so what they touch belongs there." },
  { q: "Is it a simple “when this happens, do that” step?", side: "ghl", weight: 2, why: "Linear trigger-then-action follow-ups are what GoHighLevel workflows do best." },
  { q: "Does it need data from a system GoHighLevel doesn't connect to?", side: "n8n", weight: 2, why: "n8n speaks almost any API and can merge data from several systems." },
  { q: "Does it calculate across many records or over time?", side: "n8n", weight: 2, why: "Averages, roll-ups, and comparisons across records are logic, and logic is n8n's job." },
  { q: "Does a failure need retries, alerts, or a clear error log?", side: "n8n", weight: 1, why: "n8n has error workflows and execution logs you can actually debug." },
];

/** "Where should this automation live?": five questions, one verdict with the reasons behind it. */
export function GhlOrN8n() {
  const [answers, setAnswers] = useState<boolean[]>(QUESTIONS.map(() => false));
  const set = (i: number, v: boolean) => setAnswers((a) => a.map((x, n) => (n === i ? v : x)));

  const score = { ghl: 0, n8n: 0 };
  QUESTIONS.forEach((q, i) => {
    if (answers[i]) score[q.side] += q.weight;
  });
  const reasons = QUESTIONS.filter((_, i) => answers[i]).map((q) => q.why);
  const verdict =
    score.ghl === 0 && score.n8n === 0
      ? { title: "Answer a question or two", body: "Tick what's true about the automation you're planning." }
      : score.ghl >= 2 && score.n8n >= 2
        ? { title: "Both, split cleanly", body: "Let GoHighLevel trigger it and show the result; let n8n do the work in between and write the answer back to a custom field." }
        : score.n8n > score.ghl
          ? { title: "n8n", body: "Build the logic in n8n and send only the result back to GoHighLevel, where your team will see it." }
          : { title: "GoHighLevel", body: "Keep it native. Adding n8n here would be one more system to watch for no real gain." };

  return (
    <div className="quiz">
      <div className="quiz-q">
        <span className="picker-label">Where should this automation live?</span>
        {QUESTIONS.map((q, i) => (
          <div className="quiz-row" key={q.q}>
            <span>{q.q}</span>
            <div className="quiz-yn" role="group" aria-label={q.q}>
              <button type="button" className={answers[i] ? "on" : undefined} aria-pressed={answers[i]} onClick={() => set(i, true)}>
                Yes
              </button>
              <button type="button" className={!answers[i] ? "on" : undefined} aria-pressed={!answers[i]} onClick={() => set(i, false)}>
                No
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="quiz-a" aria-live="polite" key={verdict.title}>
        <span className="picker-label">Verdict</span>
        <b>{verdict.title}</b>
        <p>{verdict.body}</p>
        {reasons.length > 0 && (
          <ul>
            {reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
