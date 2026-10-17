import { AbsoluteFill } from "remotion";
import { colors, fonts } from "./brand";

// The 1584x396 LinkedIn cover. The profile photo covers the lower left (about
// x 40 to 360 on desktop), so the copy starts at x 470 and the left is only wire.
export const LinkedInBanner: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.deep, color: colors.deepInk, fontFamily: fonts.sans }}>
    <svg width={1584} height={396} style={{ position: "absolute", inset: 0 }}>
      <path
        d="M 0 352 H 1090 C 1140 352 1140 300 1190 300 H 1584"
        fill="none"
        stroke={colors.accentOnDeep}
        strokeWidth={4}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 8px rgba(224,122,74,0.55))" }}
      />
    </svg>
    <div style={{ position: "absolute", left: 470, top: 62, display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.mono, fontSize: 18, letterSpacing: "0.12em", color: colors.deepMuted }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: colors.accentOnDeep }} />
      SHOPIFY + CRM AUTOMATION
    </div>
    <div style={{ position: "absolute", left: 466, top: 98, fontFamily: fonts.display, fontSize: 84, lineHeight: 1, letterSpacing: "-0.025em", whiteSpace: "nowrap" }}>
      Work you can <span style={{ fontStyle: "italic", color: colors.accentOnDeep }}>check.</span>
    </div>
    <div style={{ position: "absolute", left: 470, top: 206, width: 600, fontSize: 23, lineHeight: 1.4, color: colors.deepMuted }}>
      Shopify stores and the CRM automation behind them. GoHighLevel, Salesforce, n8n.
    </div>
    <div style={{ position: "absolute", left: 470, top: 296, fontFamily: fonts.mono, fontSize: 20, letterSpacing: "0.06em", color: colors.deepInk }}>rhafael.dev</div>
    <div
      style={{
        position: "absolute",
        right: 84,
        top: 44,
        width: 300,
        background: colors.surface,
        color: colors.ink,
        padding: "20px 22px 74px",
        fontFamily: fonts.mono,
        fontSize: 15,
        lineHeight: 1.75,
        transform: "rotate(-2deg)",
        boxShadow: "0 30px 60px -24px rgba(0,0,0,0.85)",
      }}
    >
      <div style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.16em", color: colors.inkMuted }}>SHIPPING RECEIPT</div>
      <div style={{ textAlign: "center", fontFamily: fonts.display, fontSize: 28, lineHeight: 1.1, margin: "4px 0 10px" }}>Your store</div>
      <div style={{ borderTop: "2px dashed #8f8e87", margin: "0 0 8px" }} />
      {[
        ["Change", "checkout"],
        ["Before", "4 clicks"],
        ["After", "2 clicks"],
        ["Status", "done"],
      ].map(([k, v], i) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{k}</span>
          <span style={{ color: i === 2 ? colors.accent : colors.ink }}>{v}</span>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          right: 22,
          bottom: 20,
          border: `4px double ${colors.accent}`,
          color: colors.accent,
          fontSize: 19,
          letterSpacing: "0.14em",
          padding: "4px 12px",
          borderRadius: 7,
          transform: "rotate(-10deg)",
        }}
      >
        SHIPPED
      </div>
    </div>
  </AbsoluteFill>
);
