"use client";

import { useState, type ReactNode } from "react";

export const STORY_SRC = "/story/intro-story.mp4";

interface StoryPosterProps {
  note?: string;
  /** Replaces the name lockup, e.g. with the story's opening line. */
  headline?: ReactNode;
}

/**
 * The 30-second story. A designed poster until someone presses play, so the
 * 4 MB video never loads unless it's wanted.
 */
export function StoryPoster({ note, headline }: StoryPosterProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video className="story-video" src={STORY_SRC} controls autoPlay playsInline preload="auto">
        The 30-second story about how I work.
      </video>
    );
  }

  return (
    <div>
      <button type="button" className="poster" onClick={() => setPlaying(true)} aria-label="Play the 30-second story">
        <span className="hud">
          <i />
          rhafael.dev
        </span>
        <span className="poster-mid">
          {headline ?? (
            <>
              <span className="pn">
                Rhafael
                <br />
                Corpuz
              </span>
              <span className="wire" />
              <span className="pn pn-sm">
                Work you can <em>check.</em>
              </span>
            </>
          )}
        </span>
        <span className="len">The 30-second story · 0:30</span>
        <span className="pp" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 4.5v15l12-7.5z" fill="#141416" />
          </svg>
        </span>
      </button>
      {note && <p className="poster-note">{note}</p>}
    </div>
  );
}
