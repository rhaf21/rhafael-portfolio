import Link from "next/link";
import type { CSSProperties } from "react";
import { EXAMPLES, RATES } from "@/data/proof";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Rate card plus worked examples. The dotted leaders draw in as it scrolls into view. */
export function Pricing() {
  return (
    <div className="pricing">
      <div className="rate" data-reveal>
        <h3>Rate card</h3>
        {RATES.map((rate, n) => (
          <div className="item" key={rate.name} style={i(n)}>
            <Link className="item-row" href={rate.href}>
              <b>{rate.name}</b>
              <span className="lead" />
              <span className="p">{rate.price}</span>
            </Link>
            <p>{rate.note}</p>
          </div>
        ))}
      </div>
      <div className="examples" data-stagger>
        <span className="label" style={i(0)}>
          Worked examples
        </span>
        {EXAMPLES.map((ex, n) => (
          <div className="ex" key={ex.t} style={i(n + 1)}>
            <span className="t">{ex.t}</span>
            <span className="r">{ex.r}</span>
            <p>{ex.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
