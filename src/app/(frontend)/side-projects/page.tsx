import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { Caveat } from "next/font/google";
import Link from "next/link";
import type { CSSProperties } from "react";
import { RevealEffects } from "@/components/ui/RevealEffects";
import { EloDemo } from "@/components/proof/EloDemo";
import "@/styles/side.css";

export const metadata: Metadata = pageMeta({
  title: "Side projects: BoardGameTally",
  description:
    "BoardGameTally is a free, patron-funded app for board game groups: live scoring, standings and seasons, Elo-style ratings, and game nights. Built and run by Rhafael Corpuz.",
  path: "/side-projects",
});

const hand = Caveat({ subsets: ["latin"], weight: ["500"], display: "swap" });

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;
const i = (n: number) => ({ "--i": n }) as CSSProperties;

const CHAPTERS: Array<[string, string, string]> = [
  ["The notebook", "Paper kept getting lost", "Sheets went missing, and midnight scribbles became a code nobody could read a month later."],
  ["The spreadsheet", "The formulas got heavy", "It felt like the answer for about three weeks. Then someone had to fix the formulas every time a game scored differently."],
  ["The app", "So I built this", "A league table your group can argue about, a record nobody has to keep, and ten seconds at the table to log a game."],
];

const LEARNED: Array<[string, string, string]> = [
  ["M3 5h22v18H3zM3 11h22", "Multi-tenant from day one", "Every group gets its own subdomain and its own data, served by one Next.js app on MongoDB."],
  ["M4 14h5l3-7 4 14 3-7h5", "Real-time at the table", "Scores sync live with Ably, so everyone sees the same table while the game is still on."],
  ["M5 22l6-7 5 4 7-10", "Ratings people trust", "Optional Elo-style ratings, seasons that keep their winner, and badges, even the unflattering ones."],
  ["M8 3h12v22H8zM12 21h4", "Shipping a mobile app", "An Android app for scoring at the table, finishing a closed test on Google Play."],
  ["M14 24s-9-5.5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-9 12-9 12z", "Free, funded in the open", "Every feature for every group, with no tiers. Patrons cover the running costs, and the costs page shows where the money goes."],
];

const FEATURES: Array<[string, string]> = [
  ["Live scoring", "Keep score as you play, with undo for every change."],
  ["Standings and seasons", "This month, this season, or all time. Past seasons keep their winner."],
  ["Elo-style ratings", "Optional ratings that move with who you beat."],
  ["Game nights", "Invites, replies, calendar links, and photos from the night."],
  ["Group chat", "Photos, GIFs, and @mentions next to your games."],
  ["Badges and rivalries", "Who keeps it close, and when a rivalry changes hands."],
  ["Player profiles", "Rank, rating history, win rate, and most-played game."],
  ["Your records", "No limits on players, games, or history, and yours to export."],
];

const BGT = "https://boardgametally.com";

export default function SideProjectsPage() {
  return (
    <div className="side">
      <section className="wrap top side-top">
        <div className="top-copy">
          <span className="label fade-up">Side projects</span>
          <h1 className="h1">
            <span className="ml">
              <span style={d(80)}>Built</span>
            </span>
            <span className="ml">
              <span style={d(200)}>
                <em>off the clock.</em>
              </span>
            </span>
          </h1>
          <p className="lede fade-up" style={d(380)}>
            Client work is Shopify and automation. This is what I build because I want it to exist, for the people I
            play board games with every weekend.
          </p>
        </div>
      </section>

      <section className="wrap">
        <div className="feature fade-up" style={d(500)}>
          <div className="f-copy">
            <span className="label">My own product</span>
            <h2 className="f-name">BoardGameTally</h2>
            <span className="f-tag">Settle who is actually any good.</span>
            <p>
              BoardGameTally keeps a board game group&rsquo;s scores, standings, and game nights in one place. Every
              group gets its own address, records games in seconds at the table, and gets a league table worth arguing
              about.
            </p>
            <div className="pills">
              <span>Free for every group</span>
              <span>Kept running by patrons</span>
              <span>yourgroup.boardgametally.com</span>
              <span>Android app in closed testing</span>
            </div>
            <div className="cta">
              <a className="btn btn-ink" href={BGT} target="_blank" rel="noopener">
                Visit boardgametally.com <span className="arr">↗</span>
              </a>
            </div>
          </div>
          <div
            className="morph"
            role="img"
            aria-label="A paper score sheet becomes a broken spreadsheet, then the BoardGameTally leaderboard"
          >
            <div className="m-steps" aria-hidden>
              <span>Started as a notebook</span>
              <span>Became a spreadsheet</span>
              <span>Then BoardGameTally</span>
            </div>
            <div className={`layer paper ${hand.className}`} aria-hidden>
              <div className="t">
                <span>Priya</span>
                <span>IIII II</span>
              </div>
              <div className="t">
                <span>Marco</span>
                <span>IIII I</span>
              </div>
              <div className="t">
                <span>Jonah</span>
                <span className="x">IIII</span>
              </div>
              <div className="t">
                <span>Sam ?</span>
                <span>III</span>
              </div>
              <div className="q">who had the blue pen??</div>
            </div>
            <div className="layer l2 sheet" aria-hidden>
              {["", "A Player", "B Wins", "C Games", "D Win %"].map((h, n) => (
                <span className="hd" key={`h${n}`}>
                  {h}
                </span>
              ))}
              {[
                ["1", "Priya", "7", "12", "58%"],
                ["2", "Marco", "6", "12", "50%"],
                ["3", "Jonah", "4", "11", "#REF!"],
                ["4", "Sam", "3", "#VALUE!", "25%"],
              ].map((row) =>
                row.map((cell, n) => (
                  <span key={`${row[0]}-${n}`} className={n === 0 ? "hd" : cell.startsWith("#") ? "err" : undefined}>
                    {cell}
                  </span>
                ))
              )}
            </div>
            <div className="layer l3 app" aria-hidden>
              <div className="app-h">
                <span>Friday Night Meeples · this season</span>
                <b>live</b>
              </div>
              {[
                ["Priya", 62],
                ["Marco", 58],
                ["Jonah", 47],
                ["Sam", 45],
              ].map(([name, pts], n) => (
                <div className={`app-row${n === 0 ? " first" : ""}`} key={name}>
                  <i>{n + 1}</i>
                  <span>{name}</span>
                  <span className="pts">{pts}</span>
                </div>
              ))}
              <span className="app-sub">yourgroup.boardgametally.com</span>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Why it exists</span>
            <h2 className="h2">It started with a notebook.</h2>
          </div>
          <p>We played every weekend and wanted to know who was actually any good.</p>
        </div>
        <div className="bgt-chapters" data-stagger>
          {CHAPTERS.map(([n, h, p], k) => (
            <div className="bgt-ch" key={n} style={i(k)}>
              <span className="n">{n}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
        <p className="pull" data-reveal>
          &ldquo;Game nights should feel like <span>game nights</span>, not admin work.&rdquo;
        </p>
        <p className="pull-cap mono">Every decision in the app comes back to that sentence.</p>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">Try it</span>
            <h2 className="h2">Pick a winner. Watch the ratings move.</h2>
          </div>
          <p>A toy version of the Elo-style ratings in BoardGameTally. Beat a stronger player and you climb further.</p>
        </div>
        <div className="play">
          <div data-reveal>
            <EloDemo />
          </div>
          <div className="learn" data-stagger>
            {LEARNED.map(([path, b, p], k) => (
              <div className="lr" key={b} style={i(k)}>
                <svg viewBox="0 0 28 28" fill="none" aria-hidden>
                  <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h3>{b}</h3>
                  <p>{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top" data-reveal>
          <div>
            <span className="label">What&rsquo;s inside</span>
            <h2 className="h2">Everything a game group argues about.</h2>
          </div>
        </div>
        <div className="feats" data-stagger>
          {FEATURES.map(([b, s], k) => (
            <div className="ft" key={b} style={i(k)}>
              <h3>{b}</h3>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <div className="closer" data-reveal>
          <h2 className="h2">
            Run a game group? <em>Start one free.</em>
          </h2>
          <div className="cta">
            <a className="btn btn-ink" href={BGT} target="_blank" rel="noopener">
              boardgametally.com <span className="arr">↗</span>
            </a>
            <Link className="btn btn-line" href="/contact">
              Or book a call about your store
            </Link>
          </div>
        </div>
      </section>
      <RevealEffects />
    </div>
  );
}
