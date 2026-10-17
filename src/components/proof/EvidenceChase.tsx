"use client";

import { useEffect, useRef, useState } from "react";

const DOCUMENTS = ["Photo ID", "Qualification certificates", "Employment evidence", "Signed declaration"];

/**
 * The CRM case study's evidence chase: press play and one example student's
 * file fills up while the email beside it lists only what's still missing,
 * then stops once the file is complete.
 */
export function EvidenceChase() {
  const [got, setGot] = useState(DOCUMENTS.length);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const play = () => {
    window.clearInterval(timer.current);
    setGot(1);
    setPlaying(true);
    timer.current = window.setInterval(() => {
      setGot((n) => {
        if (n + 1 >= DOCUMENTS.length) {
          window.clearInterval(timer.current);
          setPlaying(false);
        }
        return Math.min(n + 1, DOCUMENTS.length);
      });
    }, 1500);
  };

  const left = DOCUMENTS.length - got;
  const complete = left === 0;
  const subject = complete ? "Your file is complete" : left === 1 ? "One document left" : `${left} documents left`;

  return (
    <div className="chase">
      <div className="file-panel">
        <div className="panel-h">
          <b>Student file</b>
          <button type="button" className="ctrl" onClick={play} disabled={playing}>
            {playing ? "Playing" : complete ? "Replay" : "Play"}
          </button>
        </div>
        <div
          className="file-meter"
          role="progressbar"
          aria-label="Documents received"
          aria-valuemin={0}
          aria-valuemax={DOCUMENTS.length}
          aria-valuenow={got}
        >
          <span style={{ width: `${(got / DOCUMENTS.length) * 100}%` }} />
        </div>
        {DOCUMENTS.map((name, i) => (
          <div className={`doc${i < got ? " got" : ""}`} key={name}>
            <span className="cb" aria-hidden />
            <span>{name}</span>
            <span className="stx">{i < got ? "received" : "waiting"}</span>
          </div>
        ))}
      </div>
      <div className="mail" aria-live="polite">
        <div className="mail-h">
          <span>
            To: <b>Sam (example student)</b>
          </span>
          <span>
            Subject: <b>{subject}</b>
          </span>
        </div>
        {complete ? (
          <>
            <div className="done-b">File complete. The chase has stopped.</div>
            <p>No more reminders go out, and the opportunity moves on by itself.</p>
          </>
        ) : (
          <>
            <p>Hi Sam, thanks for what you&rsquo;ve sent so far. Here&rsquo;s what&rsquo;s still missing:</p>
            <ul>
              {DOCUMENTS.slice(got).map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
