"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

interface Reading {
  paint: number | null; // seconds to first contentful paint
  weight: number; // KB over the wire (compressed)
  requests: number;
  script: number; // KB of JavaScript (compressed)
  cached: boolean;
}

// Budgets the bars are measured against: a page that fills a bar used all of it.
const BUDGET = { paint: 1.8, weight: 1000, requests: 60, script: 300 };

const kb = (bytes: number) => Math.round(bytes / 1024);

function read(): Reading {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const paint = performance.getEntriesByName("first-contentful-paint")[0];
  const entries: PerformanceResourceTiming[] = nav ? [nav, ...resources] : resources;
  // encodedBodySize is the compressed size even when the browser served it from cache.
  const size = (e: PerformanceResourceTiming) => e.encodedBodySize || e.transferSize || 0;
  const isScript = (e: PerformanceResourceTiming) => e.initiatorType === "script" || /\.m?js(\?|$)/.test(e.name);

  return {
    paint: paint ? paint.startTime / 1000 : null,
    weight: kb(entries.reduce((sum, e) => sum + size(e), 0)),
    requests: entries.length,
    script: kb(resources.filter(isScript).reduce((sum, e) => sum + size(e), 0)),
    cached: nav ? nav.transferSize === 0 : false,
  };
}

/** Counts a number up from zero once `target` is known. */
function useCountUp(target: number | null, decimals: number) {
  const [value, setValue] = useState<number | null>(null);
  useEffect(() => {
    if (target === null) return;
    // Reduced motion still goes through one frame, it just lands immediately.
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1200;
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return value === null ? "…" : value.toFixed(decimals);
}

interface MeterProps {
  label: string;
  target: number | null;
  decimals?: number;
  unit?: string;
  budget: number;
  budgetLabel: string;
  delay: number;
}

function Meter({ label, target, decimals = 0, unit, budget, budgetLabel, delay }: MeterProps) {
  const shown = useCountUp(target, decimals);
  const fill = target === null ? 0 : Math.min(1, target / budget);
  return (
    <div className="m">
      <span className="label">{label}</span>
      <b>
        {shown}
        {unit && <small>{unit}</small>}
      </b>
      <div className="bar" aria-hidden>
        <span style={{ "--fill": fill, "--d": delay } as CSSProperties} />
      </div>
      <p>{budgetLabel}</p>
    </div>
  );
}

/** "This page, measured": the visitor's own browser reports how this page loaded. */
export function SpeedMeter() {
  const [reading, setReading] = useState<Reading | null>(null);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => window.setTimeout(() => setReading(read()), 0);
    if (document.readyState === "complete") measure();
    else window.addEventListener("load", measure, { once: true });

    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => {
      window.removeEventListener("load", measure);
      io.disconnect();
    };
  }, []);

  const live = visible ? reading : null;

  return (
    <div ref={root}>
      <div className={`meter${live ? " live" : ""}`}>
        <Meter label="First paint" target={live?.paint ?? null} decimals={1} unit="s" budget={BUDGET.paint} budgetLabel={`Text on screen. Budget: ${BUDGET.paint}s.`} delay={0} />
        <Meter label="Page weight" target={live?.weight ?? null} unit="KB" budget={BUDGET.weight} budgetLabel="Everything this page needed, compressed." delay={100} />
        <Meter label="Requests" target={live?.requests ?? null} budget={BUDGET.requests} budgetLabel="Files the browser fetched." delay={200} />
        <Meter label="JavaScript" target={live?.script ?? null} unit="KB" budget={BUDGET.script} budgetLabel="Script shipped to your browser." delay={300} />
      </div>
      <div className="meter-note mono">
        <span>
          {reading
            ? reading.cached
              ? "Measured just now in your browser. Some files came from cache."
              : "Measured just now, in your browser, as this page loaded."
            : "These numbers are measured in your browser as the page loads."}
        </span>
        <span>Performance API · no third-party tools</span>
      </div>
    </div>
  );
}
