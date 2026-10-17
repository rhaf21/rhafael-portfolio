"use client";

import {
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type PointerEvent,
} from "react";
import type { Receipt } from "@/data/proof";
import { Odometer } from "./Odometer";

interface SlipProps {
  receipt: Receipt;
  className: string;
  style?: CSSProperties;
  onAnimationEnd?: (e: AnimationEvent<HTMLDivElement>) => void;
}

function Slip({ receipt, className, style, onAnimationEnd }: SlipProps) {
  return (
    <div className={className} style={style} onAnimationEnd={onAnimationEnd}>
      <div className="s-head">SHIPPING RECEIPT</div>
      <div className="s-client">{receipt.client}</div>
      <div className="s-meta">{receipt.meta}</div>
      <div className="s-cut" />
      {receipt.items.map(([item, state], i) => (
        <div className="s-row" key={item} style={{ "--i": i } as CSSProperties}>
          <span>{item}</span>
          <span className="lead" />
          <span>{state}</span>
        </div>
      ))}
      <div className="s-cut" />
      {receipt.totals.map(([k, v]) => (
        <div className="s-tot" key={k}>
          <span>{k}</span>
          <b>
            <Odometer value={v} delay={1250} />
          </b>
        </div>
      ))}
      <span className="stamp">{receipt.stamp}</span>
    </div>
  );
}

/**
 * The home hero: receipts feed out of a printer slot one client at a time.
 * Each tab's progress bar is the timer; when its CSS animation ends the next
 * receipt prints, and hovering or focusing the printer pauses it.
 */
export function ReceiptPrinter({ receipts }: { receipts: Receipt[] }) {
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const [torn, setTorn] = useState<{ receipt: Receipt; run: number } | null>(
    null,
  );
  const [auto, setAuto] = useState(true);
  const stage = useRef<HTMLDivElement>(null);

  const show = (next: number, manual: boolean) => {
    if (manual) setAuto(false);
    if (next === index && manual) return;
    setTorn({ receipt: receipts[index], run });
    setIndex(next);
    setRun((r) => r + 1);
  };

  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stage.current.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    stage.current.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
  };
  const untilt = () => {
    stage.current?.style.setProperty("--rx", "0deg");
    stage.current?.style.setProperty("--ry", "0deg");
  };

  const current = receipts[index];
  const summary = current.totals.map(([k, v]) => `${k} ${v}`).join(", ");

  return (
    <div className="printer">
      <div
        ref={stage}
        className="printer-stage"
        onPointerMove={tilt}
        onPointerLeave={untilt}
        role="img"
        aria-label={`Shipping receipt for ${current.client}: ${summary}`}
      >
        <div className="rig">
          <div className="pile" aria-hidden>
            <div className="slip pile-1">
              <div className="s-head">SHIPPING RECEIPT</div>
              <div className="s-client">
                {receipts[(index + 1) % receipts.length].client}
              </div>
            </div>
            <div className="slip pile-2">
              <div className="s-head">SHIPPING RECEIPT</div>
              <div className="s-client">
                {receipts[(index + 2) % receipts.length].client}
              </div>
            </div>
          </div>
          <div className="feed" aria-hidden>
            {torn && (
              <Slip
                key={`torn-${torn.run}`}
                receipt={torn.receipt}
                className="slip front torn"
                onAnimationEnd={(e) => {
                  // Child animations bubble up; only the tear itself clears the slip.
                  if (e.target === e.currentTarget) setTorn(null);
                }}
              />
            )}
            {/* After the first receipt, wait for the previous one to tear off. */}
            <Slip
              key={`run-${run}`}
              receipt={current}
              className="slip front printing"
              style={{ "--t0": run > 0 ? "320ms" : "0ms" } as CSSProperties}
            />
          </div>
          <div className="slot" aria-hidden />
          <div className="slit" aria-hidden />
        </div>
      </div>
      <div className="pager" role="group" aria-label="Receipts">
        {receipts.map((r, i) => (
          <button
            key={r.tab}
            type="button"
            className={i === index ? "on" : undefined}
            aria-pressed={i === index}
            onClick={() => show(i, true)}
          >
            {r.tab}
            {i === index && auto && (
              <span
                key={run}
                className="tick"
                aria-hidden
                onAnimationEnd={() =>
                  show((index + 1) % receipts.length, false)
                }
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
