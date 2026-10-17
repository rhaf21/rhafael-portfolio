"use client";

import { useState } from "react";

// Example products; a real finder reads these attributes from product metafields.
const PRODUCTS = [
  { name: "Harbour Pocket", firmness: "soft", positions: ["side"], sizes: ["Double", "King"], price: 640 },
  { name: "Elm Hybrid", firmness: "medium", positions: ["side", "back"], sizes: ["Single", "Double", "King"], price: 820 },
  { name: "Slate Ortho", firmness: "firm", positions: ["back", "stomach"], sizes: ["Double", "King"], price: 760 },
  { name: "Linen Foam", firmness: "medium", positions: ["back", "stomach"], sizes: ["Single", "Double"], price: 480 },
  { name: "Cove Latex", firmness: "soft", positions: ["side", "back"], sizes: ["King"], price: 1150 },
];

const SIZES = ["Single", "Double", "King"];
const BUDGETS = [600, 900, 1200];
const POSITIONS = ["side", "back", "stomach"];
const FIRMNESS = ["soft", "medium", "firm"];

interface ChoiceProps<T extends string | number> {
  label: string;
  options: T[];
  value: T;
  set: (value: T) => void;
}

function Choice<T extends string | number>({ label, options, value, set }: ChoiceProps<T>) {
  return (
    <div className="finder-q">
      <span>{label}</span>
      <div className="quiz-yn" role="group" aria-label={label}>
        {options.map((o) => (
          <button key={o} type="button" className={value === o ? "on" : undefined} aria-pressed={value === o} onClick={() => set(o)}>
            {typeof o === "number" ? `£${o}` : o}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Hard filters narrow the list and build the collection URL; soft preferences rank what's left. */
export function FinderDemo() {
  const [size, setSize] = useState("Double");
  const [budget, setBudget] = useState(900);
  const [position, setPosition] = useState("side");
  const [firmness, setFirmness] = useState("medium");

  const results = PRODUCTS.filter((p) => p.sizes.includes(size) && p.price <= budget)
    .map((p) => {
      const score = (p.positions.includes(position) ? 60 : 0) + (p.firmness === firmness ? 40 : 0);
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score || a.price - b.price);
  const url = `/collections/mattresses?filter.v.option.size=${size}&filter.v.price.lte=${budget}`;

  return (
    <div className="finder">
      <div className="finder-qs">
        <span className="picker-label">Must have (filters)</span>
        <Choice label="Size" options={SIZES} value={size} set={setSize} />
        <Choice label="Budget up to" options={BUDGETS} value={budget} set={setBudget} />
        <span className="picker-label">Prefer (scoring)</span>
        <Choice label="Sleeps on their" options={POSITIONS} value={position} set={setPosition} />
        <Choice label="Feel" options={FIRMNESS} value={firmness} set={setFirmness} />
      </div>
      <div className="finder-out" aria-live="polite">
        <span className="picker-label">Collection URL</span>
        <code className="finder-url">{url}</code>
        <span className="picker-label">Ranked results</span>
        {results.length === 0 ? (
          <p>Nothing matches every must-have. A good finder says so and suggests the nearest alternative.</p>
        ) : (
          <ol>
            {results.map((r) => (
              <li key={r.name}>
                <b>{r.name}</b>
                <span>
                  £{r.price} · {r.firmness}
                </span>
                <i style={{ width: `${Math.max(r.score, 6)}%` }} aria-label={`${r.score}% match`} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
