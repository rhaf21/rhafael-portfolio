"use client";

import { useState } from "react";

interface Answer {
  text: string;
  points: number; // 2 strong, 1 fine, 0 red flag
}

const QUESTIONS: Array<{ q: string; answers: Answer[] }> = [
  {
    q: "Whose account will you build in?",
    answers: [
      { text: "Yours, with my own user login", points: 2 },
      { text: "Mine, and I'll move it over later", points: 0 },
      { text: "Whichever is easier", points: 1 },
    ],
  },
  {
    q: "How will you know a workflow works?",
    answers: [
      { text: "I test it with real test contacts and show you the results", points: 2 },
      { text: "I check it looks right in the builder", points: 0 },
      { text: "You'll tell me if something breaks", points: 0 },
    ],
  },
  {
    q: "What happens if a follow-up never gets a reply?",
    answers: [
      { text: "Every sequence has a goal or exit, so it stops", points: 2 },
      { text: "It just keeps going", points: 0 },
      { text: "Depends on the workflow", points: 1 },
    ],
  },
  {
    q: "How do you price the work?",
    answers: [
      { text: "A fixed quote after a scoping call or audit", points: 2 },
      { text: "Hourly, with a rough estimate", points: 1 },
      { text: "We'll figure it out as we go", points: 0 },
    ],
  },
  {
    q: "What do I get at the end?",
    answers: [
      { text: "A walkthrough and notes on what each workflow does", points: 2 },
      { text: "Working workflows", points: 1 },
      { text: "Support if anything goes wrong, at my rate", points: 0 },
    ],
  },
  {
    q: "When would you say no to a request?",
    answers: [
      { text: "When native GoHighLevel can't do it reliably, with an alternative", points: 2 },
      { text: "Never, I can build anything", points: 0 },
      { text: "If it's outside the budget", points: 1 },
    ],
  },
];

/** Pick how a candidate answered six questions; see where they're strong and where the red flags are. */
export function InterviewScorecard() {
  const [picks, setPicks] = useState<Array<number | null>>(QUESTIONS.map(() => null));
  const pick = (q: number, a: number) => setPicks((p) => p.map((v, i) => (i === q ? a : v)));

  const scored = picks.flatMap((p, i) => (p === null ? [] : [QUESTIONS[i].answers[p].points]));
  const strong = scored.filter((pts) => pts === 2).length;
  const reds = scored.filter((pts) => pts === 0).length;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const verdict =
    reds >= 2
      ? { title: "Keep looking", body: `${plural(reds, "red flag")}. Each one is a cost you'd pay later.` }
      : scored.length < QUESTIONS.length
        ? {
            title: "Keep going",
            body:
              scored.length === 0
                ? "Choose how a candidate answered each question."
                : `${plural(strong, "strong answer")} and ${plural(reds, "red flag")} so far.`,
          }
        : reds === 0 && strong >= QUESTIONS.length - 1
          ? { title: "Strong candidate", body: "Clear ownership, real testing, and a fixed price. Ask to see a past build." }
          : { title: "Worth a test project", body: "No deal-breakers, but start with a small, paid, well-defined piece of work." };

  return (
    <div className="quiz scorecard">
      <div className="quiz-q">
        <span className="picker-label">The interview</span>
        {QUESTIONS.map((q, qi) => (
          <div className="score-q" key={q.q}>
            <b>{q.q}</b>
            <div className="score-opts" role="group" aria-label={q.q}>
              {q.answers.map((a, ai) => (
                <button
                  key={a.text}
                  type="button"
                  className={picks[qi] === ai ? `on p${a.points}` : undefined}
                  aria-pressed={picks[qi] === ai}
                  onClick={() => pick(qi, ai)}
                >
                  {a.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="quiz-a" aria-live="polite" key={verdict.title}>
        <div className="score-stick">
          <span className="picker-label">
            {scored.length} of {QUESTIONS.length} answered
          </span>
          <b>{verdict.title}</b>
          <p>{verdict.body}</p>
        </div>
      </div>
    </div>
  );
}
