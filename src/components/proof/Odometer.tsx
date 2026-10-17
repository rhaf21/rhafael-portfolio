import type { CSSProperties } from "react";

interface OdometerProps {
  value: string;
  /** Delay in ms before the first digit starts rolling. */
  delay?: number;
}

/**
 * Rolls each digit of `value` into place. The real characters stay in the
 * DOM (crawlers and copy-paste read "0.92%"); the spinning column is a CSS
 * pseudo-element, and the resting position is the base style, so reduced
 * motion simply shows the final number.
 */
export function Odometer({ value, delay = 0 }: OdometerProps) {
  let digitIndex = 0;
  return (
    <span className="odo">
      {Array.from(value).map((ch, i) => {
        if (!/[0-9]/.test(ch)) return ch;
        const style = { "--v": Number(ch), "--d": delay + digitIndex++ * 70 } as CSSProperties;
        return (
          <span key={i} className="odo-d" style={style}>
            {ch}
          </span>
        );
      })}
    </span>
  );
}
