"use client";

import { useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";

const SECTIONS = ["/projects", "/services", "/blog", "/about", "/contact", "/side-projects"];

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
  }
  return row[b.length];
}

/** Why the link probably failed, and the nearest page that does exist. */
export function diagnose(path: string): { cause: string; closest: string } {
  const section = `/${path.split("/")[1] ?? ""}`.toLowerCase();
  if (SECTIONS.includes(section)) return { cause: "page moved", closest: section };
  const [nearest] = SECTIONS.map((s) => [s, distance(section, s)] as const).sort((a, b) => a[1] - b[1]);
  if (nearest[1] <= 3) return { cause: "typo", closest: nearest[0] };
  return { cause: "old link", closest: "/projects" };
}

/** The 404's job receipt: the link that failed, why, and the closest page, stamped VOID. */
export function MissingReceipt() {
  const path = usePathname() ?? "/";
  const [run, setRun] = useState(0);
  const { cause, closest } = diagnose(path);

  return (
    <div className="printer nf-printer">
      <div className="printer-stage error" role="img" aria-label={`Job receipt: ${path} was not found. Status blocked.`}>
        <div className="rig">
          <div className="slot" aria-hidden />
          <div className="feed" aria-hidden>
            <div key={run} className="slip front printing" style={{ "--t0": "300ms" } as CSSProperties}>
              <div className="s-head">JOB RECEIPT</div>
              <div className="s-client">Page not found</div>
              <div className="s-meta">ERROR 404 · RHAFAEL.DEV</div>
              <div className="s-cut" />
              <span>Requested</span>
              <span className="s-path">{path}</span>
              <div className="s-row">
                <span>Found</span>
                <span className="lead" />
                <span>nothing</span>
              </div>
              <div className="s-row">
                <span>Likely cause</span>
                <span className="lead" />
                <span>{cause}</span>
              </div>
              <div className="s-row">
                <span>Closest page</span>
                <span className="lead" />
                <span>{closest}</span>
              </div>
              <div className="s-cut" />
              <div className="s-tot">
                <span>Status</span>
                <span className="st blocked">blocked</span>
              </div>
              <span className="stamp">VOID</span>
            </div>
          </div>
          <div className="slit" aria-hidden />
        </div>
      </div>
      <button type="button" className="again" onClick={() => setRun((r) => r + 1)}>
        Print it again
      </button>
    </div>
  );
}

/** "Tell me where": an email with the broken path already filled in. */
export function ReportLink({ email }: { email: string }) {
  const path = usePathname() ?? "/";
  const subject = encodeURIComponent(`Broken link on rhafael.dev: ${path}`);
  const body = encodeURIComponent(`I followed a link to ${path} and got a 404.\n\nI found the link on: `);
  return (
    <p className="report mono">
      Found this link somewhere? <a href={`mailto:${email}?subject=${subject}&body=${body}`}>Tell me where</a> and
      I&rsquo;ll fix it.
    </p>
  );
}
