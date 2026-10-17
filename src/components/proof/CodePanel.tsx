"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { CodeExcerpt } from "@/data/proof";

/**
 * "Under the hood": real-shaped code with numbered notes. Every excerpt is
 * rendered (inactive ones are `hidden`), so all of them are in the HTML.
 * Wrap it in a server-rendered `data-reveal` element to type the lines in.
 */
export function CodePanel({ excerpts }: { excerpts: CodeExcerpt[] }) {
  const [active, setActive] = useState(0);
  const [switched, setSwitched] = useState(false);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (i: number) => {
    setActive(i);
    setSwitched(true);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + excerpts.length) % excerpts.length;
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className={`code-panel hood${switched ? " retype" : ""}`}>
      <div className="hood-tabs" role="tablist" aria-label="Code excerpts" onKeyDown={onKey}>
        {excerpts.map((ex, i) => (
          <button
            key={ex.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`hood-tab-${ex.key}`}
            aria-selected={i === active}
            aria-controls={`hood-panel-${ex.key}`}
            tabIndex={i === active ? 0 : -1}
            className={i === active ? "on" : undefined}
            onClick={() => select(i)}
          >
            {ex.label}
          </button>
        ))}
      </div>
      {excerpts.map((ex, i) => (
        <div
          key={ex.key}
          className="hood-body"
          role="tabpanel"
          id={`hood-panel-${ex.key}`}
          aria-labelledby={`hood-tab-${ex.key}`}
          hidden={i !== active}
        >
          <pre className="code" tabIndex={0}>
            <code>
              {ex.lines.map(([kind, text, marker], n) => (
                <span key={n} className={`ln${marker ? " hit" : ""}`} style={{ "--i": n } as CSSProperties}>
                  <span className="n" aria-hidden>
                    {n + 1}
                  </span>
                  <span className="mk" aria-hidden>
                    {marker ?? ""}
                  </span>
                  <span className={kind === "c" ? "cm" : undefined}>{text || " "}</span>
                  {/* Out of the grid flow, but keeps line breaks when the code is copied. */}
                  <span className="sr-only">{"\n"}</span>
                </span>
              ))}
            </code>
          </pre>
          <div className="notes">
            <span className="file">{ex.file}</span>
            {ex.flow && (
              <div className="flow" aria-label="Workflow">
                {ex.flow.map((step, s) => (
                  <span key={step} className="flow-step">
                    {s > 0 && <span className="fa" aria-hidden>{s === ex.flow!.length - 1 ? "/" : "→"}</span>}
                    <span className={`fn${s === 2 ? " hot" : ""}`}>{step}</span>
                  </span>
                ))}
              </div>
            )}
            {ex.notes.map(([k, t]) => (
              <div className="note" key={k}>
                <i>{k}</i>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="panel-foot mono">Simplified for reading. Client names and data removed.</div>
    </div>
  );
}
