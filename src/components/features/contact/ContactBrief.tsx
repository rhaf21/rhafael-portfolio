"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { CAL_URL } from "@/data/navigation";

const initialState: ContactFormState = { success: false, message: "" };

const NEEDS: Array<[string, string]> = [
  ["Fix something broken", "A store or CRM that's leaking sales or time"],
  ["Build something new", "A feature, flow, or integration"],
  ["Audit what I have", "A ranked fix list in five business days"],
  ["Ongoing help", "Monthly upkeep and small builds"],
  ["Not sure yet", "Let's work it out on the call"],
];
const PLATFORMS: Array<[string, string]> = [
  ["Shopify", "Themes, apps, checkout"],
  ["GoHighLevel", "Workflows, pipelines"],
  ["Salesforce", "Flows, Apex, triggers"],
  ["n8n, Zapier, or Make", "Automation glue"],
  ["Something else", "WordPress, Next.js, other"],
];
const BUDGETS = ["Under $500", "$500 to $1,500", "$1,500 to $3,000", "$3,000+", "Not sure"];
const WHENS = ["As soon as possible", "This month", "Just exploring"];
const STEPS = ["What you need", "Your platforms", "Budget and timing", "Your details"];

interface OptionProps {
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}

function Option({ label, sub, selected, onClick }: OptionProps) {
  return (
    <button type="button" className={`opt${selected ? " sel" : ""}`} aria-pressed={selected} onClick={onClick}>
      <span>{label}</span>
      {sub && <small>{sub}</small>}
    </button>
  );
}

/**
 * A four-step brief that ends in the same contact action as before: the
 * choices are folded into the subject and message, so the email arrives
 * already sorted.
 */
export function ContactBrief() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [when, setWhen] = useState("");

  const togglePlatform = (p: string) =>
    setPlatforms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const canNext = [need !== "", platforms.length > 0, budget !== "" && when !== "", true][step];
  const subject = `${need || "New enquiry"} · ${platforms.join(", ") || "platform not set"}`;
  const brief = [`Need: ${need}`, `Platforms: ${platforms.join(", ")}`, `Budget: ${budget}`, `Timing: ${when}`].join("\n");

  if (state.success) {
    return (
      <section className="widget done-w" role="status" aria-live="polite">
        <span className="stamp-ok">RECEIVED</span>
        <h2>Thanks. Your brief is in.</h2>
        <p>
          Pick a time for the 20-minute call now, and I&rsquo;ll look at your setup before we talk. Your answers come
          with you. Or wait for my reply within 24 hours.
        </p>
        {/* Only the brief's answers go in the link: name and email are typed on Cal.com, never put in a URL. */}
        <a className="btn btn-ink" href={`${CAL_URL}?notes=${encodeURIComponent(brief)}`} target="_blank" rel="noopener">
          Pick a time now <span className="arr">→</span>
        </a>
        <p>
          Meanwhile, the <Link href="/projects">work page</Link> shows what a finished job looks like.
        </p>
      </section>
    );
  }

  return (
    <section className="widget" aria-label="Project brief">
      <div className="w-top">
        <b>{STEPS[step]}</b>
        <span className="mono">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>
      <div className="w-bar" aria-hidden>
        {STEPS.map((s, n) => (
          <span key={s} className={n <= step ? "on" : undefined} />
        ))}
      </div>

      <form action={formAction} className="w-form">
        <input type="hidden" name="subject" value={subject} />
        {/* The answers also go separately, so the email can lay them out as a receipt. */}
        <input type="hidden" name="need" value={need} />
        <input type="hidden" name="platforms" value={platforms.join(", ")} />
        <input type="hidden" name="budget" value={budget} />
        <input type="hidden" name="timing" value={when} />

        <div className="w-step" hidden={step !== 0}>
          <p className="q">What do you need help with?</p>
          <div className="opts">
            {NEEDS.map(([label, sub]) => (
              <Option key={label} label={label} sub={sub} selected={need === label} onClick={() => setNeed(label)} />
            ))}
          </div>
        </div>

        <div className="w-step" hidden={step !== 1}>
          <p className="q">What are you working with?</p>
          <p className="hint">Pick all that apply.</p>
          <div className="opts">
            {PLATFORMS.map(([label, sub]) => (
              <Option
                key={label}
                label={label}
                sub={sub}
                selected={platforms.includes(label)}
                onClick={() => togglePlatform(label)}
              />
            ))}
          </div>
        </div>

        <div className="w-step" hidden={step !== 2}>
          <p className="q">Budget and timing</p>
          <span className="sub-q">Rough budget</span>
          <div className="opts opts-row">
            {BUDGETS.map((b) => (
              <Option key={b} label={b} selected={budget === b} onClick={() => setBudget(b)} />
            ))}
          </div>
          <span className="sub-q">When do you want to start?</span>
          <div className="opts opts-row">
            {WHENS.map((w) => (
              <Option key={w} label={w} selected={when === w} onClick={() => setWhen(w)} />
            ))}
          </div>
        </div>

        <div className="w-step" hidden={step !== 3}>
          <p className="q">Last step</p>
          <div className="w-receipt mono" aria-label="Your brief">
            <div>
              <span>Need</span>
              <span>{need}</span>
            </div>
            <div>
              <span>Platforms</span>
              <span>{platforms.join(", ")}</span>
            </div>
            <div>
              <span>Budget</span>
              <span>{budget}</span>
            </div>
            <div>
              <span>Timing</span>
              <span>{when}</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="c-name">Your name</label>
            <input id="c-name" name="name" type="text" autoComplete="name" minLength={2} maxLength={100} required defaultValue={state.values?.name ?? ""} />
            {state.errors?.name?.[0] && <p className="f-err">{state.errors.name[0]}</p>}
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" name="email" type="email" autoComplete="email" maxLength={254} required defaultValue={state.values?.email ?? ""} />
            {state.errors?.email?.[0] && <p className="f-err">{state.errors.email[0]}</p>}
          </div>
          <BriefNotes brief={brief} />
          {state.message && !state.success && (
            <p className="f-err" role="alert">
              {state.message}
            </p>
          )}
        </div>

        <div className="w-nav">
          {step > 0 ? (
            <button type="button" className="btn btn-text" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn btn-ink" disabled={!canNext} onClick={() => setStep(step + 1)}>
              Next <span className="arr">→</span>
            </button>
          ) : (
            <button type="submit" className="btn btn-ink" disabled={isPending}>
              {isPending ? "Sending…" : "Send the brief"} <span className="arr">→</span>
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

/** The free-text notes, sent together with the brief as one message. */
function BriefNotes({ brief }: { brief: string }) {
  const [notes, setNotes] = useState("");
  return (
    <div className="field">
      <label htmlFor="c-notes">Anything else? Links help.</label>
      <textarea
        id="c-notes"
        rows={4}
        maxLength={800}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Your store or CRM, what's going wrong, and anything you've tried."
      />
      <input type="hidden" name="notes" value={notes.trim()} />
      <input type="hidden" name="message" value={notes.trim() ? `${brief}\n\n${notes.trim()}` : brief} />
    </div>
  );
}
