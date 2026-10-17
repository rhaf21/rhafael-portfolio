import { AbsoluteFill } from "remotion";
import { colors, fonts } from "./brand";

// A 4:3 cover for Upwork portfolio items: the headline on the left, the shipping receipt on the right.
export type PortfolioCoverProps = {
  lane: string;
  title: string;
  accent: string;
  client: string;
  meta: string;
  items: string[];
  totals: [string, string][];
};

export const PortfolioCover: React.FC<PortfolioCoverProps> = ({ lane, title, accent, client, meta, items, totals }) => (
  <AbsoluteFill style={{ backgroundColor: colors.deep, color: colors.deepInk, fontFamily: fonts.sans }}>
    <div style={{ position: "absolute", left: 96, top: 84, display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.mono, fontSize: 26, letterSpacing: "0.12em", color: colors.deepMuted }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: colors.accentOnDeep }} />
      RHAFAEL.DEV · {lane.toUpperCase()}
    </div>
    <div style={{ position: "absolute", left: 96, top: 300, width: 760, fontFamily: fonts.display, fontSize: 104, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
      {title} <span style={{ fontStyle: "italic", color: colors.accentOnDeep }}>{accent}</span>
    </div>
    <svg width={1600} height={1200} style={{ position: "absolute", inset: 0 }}>
      <path d="M 96 1010 H 820 C 900 1010 900 900 980 900 H 1600" fill="none" stroke={colors.accentOnDeep} strokeWidth={5} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px rgba(224,122,74,0.55))" }} />
    </svg>
    <div
      style={{
        position: "absolute",
        right: 110,
        top: 170,
        width: 520,
        background: colors.surface,
        color: colors.ink,
        padding: "44px 40px 150px",
        fontFamily: fonts.mono,
        fontSize: 25,
        lineHeight: 1.75,
        transform: "rotate(-2deg)",
        boxShadow: "0 50px 90px -40px rgba(0,0,0,0.8)",
      }}
    >
      <div style={{ textAlign: "center", fontSize: 18, letterSpacing: "0.16em", color: colors.inkMuted }}>SHIPPING RECEIPT</div>
      <div style={{ textAlign: "center", fontFamily: fonts.display, fontSize: 52, lineHeight: 1.05, margin: "14px 0 4px" }}>{client}</div>
      <div style={{ textAlign: "center", fontSize: 18, letterSpacing: "0.1em", color: colors.inkMuted }}>{meta}</div>
      <div style={{ borderTop: `2px dashed #8f8e87`, margin: "22px 0" }} />
      {items.map((item) => (
        <div key={item} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
          <span>{item}</span>
          <span style={{ flex: 1, borderBottom: "2px dotted #8f8e87", transform: "translateY(-6px)" }} />
          <span>done</span>
        </div>
      ))}
      <div style={{ borderTop: `2px dashed #8f8e87`, margin: "22px 0" }} />
      {totals.map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontWeight: 500 }}>
          <span>{k}</span>
          <span style={{ color: colors.accent }}>{v}</span>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 44,
          transform: "translateX(-50%) rotate(-8deg)",
          border: `6px double ${colors.accent}`,
          color: colors.accent,
          fontSize: 34,
          letterSpacing: "0.14em",
          padding: "8px 22px",
          borderRadius: 10,
          opacity: 0.92,
        }}
      >
        SHIPPED
      </div>
    </div>
  </AbsoluteFill>
);
