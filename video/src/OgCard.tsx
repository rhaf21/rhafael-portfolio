import { AbsoluteFill } from "remotion";
import { colors, fonts } from "./brand";

export type OgCardProps = {
  /** Headline: the first line, then a second line whose `em` part is italic and ember. */
  line1: string;
  line2: string;
  em: string;
  /** Headline size in px; long lines need less than the home card's 104. */
  size?: number;
  sub: string;
  receipt: { title: string; rows: Array<[string, string]>; accentRow: number; stamp: string };
};

/** The home page card, also the default for every page without its own. */
export const HOME_OG: OgCardProps = {
  line1: "Work you",
  line2: "can ",
  em: "check.",
  sub: "Shopify stores and the CRM automation behind them. GoHighLevel, Salesforce, n8n.",
  receipt: {
    title: "Your store",
    rows: [
      ["Change", "checkout"],
      ["Before", "4 clicks"],
      ["After", "2 clicks"],
      ["Status", "done"],
    ],
    accentRow: 2,
    stamp: "SHIPPED",
  },
};

// The 1200x630 share image for rhafael.dev: the promise on the left, a receipt on the right.
export const OgCard: React.FC<OgCardProps> = ({ line1, line2, em, size = 104, sub, receipt }) => (
  <AbsoluteFill style={{ backgroundColor: colors.deep, color: colors.deepInk, fontFamily: fonts.sans }}>
    <div style={{ position: "absolute", left: 72, top: 64, display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.mono, fontSize: 20, letterSpacing: "0.12em", color: colors.deepMuted }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: colors.accentOnDeep }} />
      RHAFAEL.DEV
    </div>
    <div style={{ position: "absolute", left: 72, top: 150, width: 640, fontFamily: fonts.display, fontSize: size, lineHeight: 0.95, letterSpacing: "-0.025em" }}>
      {line1}
      <br />
      {line2}
      <span style={{ fontStyle: "italic", color: colors.accentOnDeep }}>{em}</span>
    </div>
    <div style={{ position: "absolute", left: 76, top: 400, width: 560, fontSize: 25, lineHeight: 1.4, color: colors.deepMuted }}>{sub}</div>
    <div style={{ position: "absolute", left: 76, bottom: 66, fontFamily: fonts.display, fontSize: 34 }}>Rhafael Corpuz</div>
    <svg width={1200} height={630} style={{ position: "absolute", inset: 0 }}>
      <path d="M 0 598 H 660 C 720 598 720 540 780 540 H 1200" fill="none" stroke={colors.accentOnDeep} strokeWidth={4} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(224,122,74,0.55))" }} />
    </svg>
    <div
      style={{
        position: "absolute",
        right: 80,
        top: 70,
        width: 360,
        background: colors.surface,
        color: colors.ink,
        padding: "30px 28px 96px",
        fontFamily: fonts.mono,
        fontSize: 17,
        lineHeight: 1.8,
        transform: "rotate(-2deg)",
        boxShadow: "0 40px 70px -30px rgba(0,0,0,0.8)",
      }}
    >
      <div style={{ textAlign: "center", fontSize: 13, letterSpacing: "0.16em", color: colors.inkMuted }}>SHIPPING RECEIPT</div>
      <div style={{ textAlign: "center", fontFamily: fonts.display, fontSize: 36, lineHeight: 1.1, margin: "8px 0 14px" }}>{receipt.title}</div>
      <div style={{ borderTop: "2px dashed #8f8e87", margin: "0 0 12px" }} />
      {receipt.rows.map(([k, v], i) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>{k}</span>
          <span style={{ color: i === receipt.accentRow ? colors.accent : colors.ink }}>{v}</span>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          right: 28,
          bottom: 26,
          border: `5px double ${colors.accent}`,
          color: colors.accent,
          fontSize: 24,
          letterSpacing: "0.14em",
          padding: "6px 16px",
          borderRadius: 8,
          transform: "rotate(-10deg)",
        }}
      >
        {receipt.stamp}
      </div>
    </div>
  </AbsoluteFill>
);
