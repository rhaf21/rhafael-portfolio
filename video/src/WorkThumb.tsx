import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// A 4:3 Upwork portfolio thumbnail for a live site: the client and one line on
// top, the live storefront in a browser frame below, running off the bottom edge.
export type WorkThumbProps = {
  lane: string;
  client: string;
  line: string;
  url: string;
  shot: string;
};

export const WorkThumb: React.FC<WorkThumbProps> = ({ lane, client, line, url, shot }) => (
  <AbsoluteFill style={{ backgroundColor: colors.deep, color: colors.deepInk, fontFamily: fonts.sans }}>
    <div style={{ position: "absolute", left: 96, top: 84, display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.mono, fontSize: 26, letterSpacing: "0.12em", color: colors.deepMuted }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: colors.accentOnDeep }} />
      RHAFAEL.DEV · {lane.toUpperCase()}
    </div>
    <div style={{ position: "absolute", left: 96, top: 150, fontFamily: fonts.display, fontSize: 132, lineHeight: 1, letterSpacing: "-0.025em" }}>
      {client}
    </div>
    <div style={{ position: "absolute", left: 100, top: 310, width: 1300, fontSize: 36, lineHeight: 1.35, color: colors.deepMuted }}>{line}</div>
    <svg width={1600} height={1200} style={{ position: "absolute", inset: 0 }}>
      <path
        d="M 0 520 H 1340 C 1420 520 1420 470 1500 470 H 1600"
        fill="none"
        stroke={colors.accentOnDeep}
        strokeWidth={5}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 10px rgba(224,122,74,0.55))" }}
      />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 470,
        width: 1408,
        borderRadius: 22,
        overflow: "hidden",
        background: colors.surface,
        boxShadow: "0 60px 120px -40px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ height: 56, background: "#ecebe6", display: "flex", alignItems: "center", gap: 12, padding: "0 22px" }}>
        {["#e0675a", "#e7b552", "#69b56a"].map((c) => (
          <span key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ marginLeft: 18, padding: "8px 22px", borderRadius: 999, background: colors.surface, fontFamily: fonts.mono, fontSize: 20, color: colors.inkMuted }}>
          {url}
        </span>
      </div>
      {/* Captures include the browser scrollbar (15 of 1440px); widen past the frame to hide it. */}
      <Img src={staticFile(shot)} style={{ display: "block", width: `${(1440 / 1425) * 100}%` }} />
    </div>
  </AbsoluteFill>
);
