import { AbsoluteFill } from "remotion";
import { colors, fonts } from "./brand";

// The 1200x630 share image for rhafael.dev: the promise on the left, a receipt on the right.
export const OgCard: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.deep, color: colors.deepInk, fontFamily: fonts.sans }}>
    <div style={{ position: "absolute", left: 72, top: 64, display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.mono, fontSize: 20, letterSpacing: "0.12em", color: colors.deepMuted }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: colors.accentOnDeep }} />
      RHAFAEL.DEV
    </div>
    <div style={{ position: "absolute", left: 72, top: 150, fontFamily: fonts.display, fontSize: 104, lineHeight: 0.95, letterSpacing: "-0.025em" }}>
      Work you
      <br />
      can <span style={{ fontStyle: "italic", color: colors.accentOnDeep }}>check.</span>
    </div>
    <div style={{ position: "absolute", left: 76, top: 400, width: 560, fontSize: 25, lineHeight: 1.4, color: colors.deepMuted }}>
      Shopify stores and the CRM automation behind them. GoHighLevel, Salesforce, n8n.
    </div>
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
      <div style={{ textAlign: "center", fontFamily: fonts.display, fontSize: 36, lineHeight: 1.1, margin: "8px 0 14px" }}>Your store</div>
      <div style={{ borderTop: "2px dashed #8f8e87", margin: "0 0 12px" }} />
      {["Change", "Before", "After", "Status"].map((k, i) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{k}</span>
          <span style={{ color: i === 2 ? colors.accent : colors.ink }}>{["checkout", "4 clicks", "2 clicks", "done"][i]}</span>
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
        SHIPPED
      </div>
    </div>
  </AbsoluteFill>
);
