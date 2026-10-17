import type { CSSProperties } from "react";
import { ENDS, STATUS_CLASS } from "@/data/proof";

/** The four ways a job ends. Each status chip stamps in as the row arrives. */
export function Ends() {
  return (
    <div className="ends" data-reveal>
      {ENDS.map((end, n) => (
        <div className="end" key={end.label} style={{ "--i": n } as CSSProperties}>
          <span className={`st ${STATUS_CLASS[end.status]}`}>{end.label}</span>
          <span className="q">{end.q}</span>
          <p>{end.p}</p>
        </div>
      ))}
    </div>
  );
}
