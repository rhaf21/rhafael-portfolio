"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Watches every `[data-reveal]` element and adds `.in` when:
 *   1. They're already in the viewport on mount (immediate), or
 *   2. They scroll into view (via IntersectionObserver).
 *
 * Honors `data-delay` (ms) for staggered entrances. Re-arms on route change.
 * Falls back to revealing everything if `prefers-reduced-motion` is set.
 */
export function RevealEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)")
    );

    if (reduced) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const reveal = (el: HTMLElement) => {
      if (el.classList.contains("in")) return;
      const delay = Number(el.getAttribute("data-delay")) || 0;
      window.setTimeout(() => el.classList.add("in"), delay);
    };

    // 1) Reveal anything already inside the viewport immediately so the page
    //    isn't blank when JS attaches after hydration.
    const viewportH = window.innerHeight;
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportH && rect.bottom > 0) {
        reveal(el);
      }
    });

    // 2) Observe the rest for scroll-triggered reveals.
    const remaining = els.filter((el) => !el.classList.contains("in"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    remaining.forEach((el) => io.observe(el));

    // 3) Safety net — guarantee every reveal element shows within 2s even if
    //    IO silently fails (some embedded webviews / private modes).
    const safety = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.in)")
        .forEach((el) => el.classList.add("in"));
    }, 2000);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, [pathname]);

  return null;
}
