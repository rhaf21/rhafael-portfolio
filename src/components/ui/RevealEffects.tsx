"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not(.in), [data-stagger]:not(.in)";

/**
 * Adds `.in` to every `[data-reveal]` / `[data-stagger]` element as it scrolls
 * into view. Hidden states in globals.css only apply under `html.rv`, which is
 * set here after anything already on screen has been marked `.in`, so the
 * server-rendered page never flashes and crawlers always see every word.
 *
 * Render it as the last child of each page, not in the layout: an effect in
 * the layout can run before the page's loading boundary hydrates, and adding
 * `.in` to an element React hasn't hydrated yet is a hydration mismatch.
 * Inside the page, it mounts in the same commit as the elements it watches.
 */
export function RevealEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    // On first load, whatever is already visible stays put. After a client-side
    // navigation html.rv is already set, so on-screen elements animate in.
    const armed = root.classList.contains("rv");
    const viewportH = window.innerHeight;
    if (!armed) {
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportH && rect.bottom > 0) el.classList.add("in");
      });
      root.classList.add("rv");
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    els.filter((el) => !el.classList.contains("in")).forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
