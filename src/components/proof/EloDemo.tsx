"use client";

import { useState } from "react";

interface Player {
  name: string;
  r: number;
}

const START: Player[] = [
  { name: "Priya", r: 1512 },
  { name: "Marco", r: 1497 },
  { name: "Jonah", r: 1488 },
  { name: "Sam", r: 1430 },
];
const K = 24;

/** A toy version of BoardGameTally's Elo-style ratings: beat a stronger player and you climb further. */
export function EloDemo() {
  const [players, setPlayers] = useState(START);
  const [winner, setWinner] = useState("Sam");
  const [deltas, setDeltas] = useState<Record<string, number>>({});
  const [games, setGames] = useState(0);

  const record = () => {
    const win = players.find((p) => p.name === winner)!;
    const next: Record<string, number> = Object.fromEntries(players.map((p) => [p.name, 0]));
    for (const p of players) {
      if (p.name === winner) continue;
      const expected = 1 / (1 + Math.pow(10, (p.r - win.r) / 400));
      const change = Math.round(K * (1 - expected));
      next[winner] += change;
      next[p.name] -= change;
    }
    setPlayers(players.map((p) => ({ ...p, r: p.r + next[p.name] })));
    setDeltas(next);
    setGames((g) => g + 1);
  };

  const sorted = [...players].sort((a, b) => b.r - a.r);
  const gained = deltas[winner] ?? 0;

  return (
    <div className="try">
      <div className="try-h">
        <h3>Record a game</h3>
        <span>Catan · 4 players</span>
      </div>
      <span className="lbl">Who won?</span>
      <div className="pick" role="group" aria-label="Pick the winner">
        {players.map((p) => (
          <button
            key={p.name}
            type="button"
            className={p.name === winner ? "sel" : undefined}
            aria-pressed={p.name === winner}
            onClick={() => setWinner(p.name)}
          >
            {p.name}
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-ink" onClick={record}>
        Record the game
      </button>
      <div className="elo" aria-live="polite" key={games}>
        {sorted.map((p, i) => {
          const d = deltas[p.name] ?? 0;
          return (
            <div className={`tr${games > 0 && d > 0 ? " won" : ""}`} key={p.name} style={{ "--i": i } as React.CSSProperties}>
              <i>{i + 1}</i>
              <span>{p.name}</span>
              <span className="r">{p.r.toLocaleString("en-GB")}</span>
              <span className={`delta ${d > 0 ? "up" : d < 0 ? "down" : "none"}`}>
                {games === 0 ? "·" : d > 0 ? `+${d}` : String(d)}
              </span>
            </div>
          );
        })}
      </div>
      <span className="elo-note">
        {games === 0
          ? "Sam is the underdog. Pick Sam and see how far an upset moves the table."
          : `${winner} gained ${gained} points. The weaker the winner, the bigger the swing.`}
      </span>
    </div>
  );
}
