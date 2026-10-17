import { AbsoluteFill } from "remotion";
import { colors, fonts } from "./brand";

// The 1080x1350 cover for the story video on LinkedIn: the hook up top, the
// proof as a receipt, the name at the foot. No play icon; LinkedIn adds its own
// in the centre, so the receipt starts below it.
export const VideoThumb: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.deep, color: colors.deepInk, fontFamily: fonts.sans }}>
    <div style={{ position: "absolute", left: 90, top: 96, display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.mono, fontSize: 26, letterSpacing: "0.12em", color: colors.deepMuted }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: colors.accentOnDeep }} />
      THE 30-SECOND VERSION
    </div>
    <div style={{ position: "absolute", left: 84, top: 170, fontFamily: fonts.display, fontSize: 168, lineHeight: 0.92, letterSpacing: "-0.03em" }}>
      Good stores
      <br />
      still <span style={{ fontStyle: "italic", color: colors.accentOnDeep }}>lose sales.</span>
    </div>
    <div style={{ position: "absolute", left: 90, top: 520, width: 640, fontSize: 34, lineHeight: 1.35, color: colors.deepMuted }}>
      Usually somewhere no one checks. Here&rsquo;s how I find it.
    </div>
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
      <path
        d="M 0 1130 H 420 C 480 1130 480 1060 540 1060 H 1080"
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
        right: 96,
        top: 740,
        width: 470,
        background: colors.surface,
        color: colors.ink,
        padding: "30px 34px 128px",
        fontFamily: fonts.mono,
        fontSize: 24,
        lineHeight: 1.7,
        transform: "rotate(-3deg)",
        boxShadow: "0 50px 90px -30px rgba(0,0,0,0.85)",
      }}
    >
      <div style={{ textAlign: "center", fontSize: 17, letterSpacing: "0.16em", color: colors.inkMuted }}>SHIPPING RECEIPT</div>
      <div style={{ textAlign: "center", fontFamily: fonts.display, fontSize: 46, lineHeight: 1.1, margin: "8px 0 16px" }}>Your store</div>
      <div style={{ borderTop: "2px dashed #8f8e87", margin: "0 0 14px" }} />
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
          right: 34,
          bottom: 26,
          border: `6px double ${colors.accent}`,
          color: colors.accent,
          fontSize: 32,
          letterSpacing: "0.14em",
          padding: "8px 20px",
          borderRadius: 10,
          transform: "rotate(-10deg)",
        }}
      >
        SHIPPED
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, bottom: 110, display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontFamily: fonts.display, fontSize: 52 }}>Rhafael Corpuz</span>
      <span style={{ fontFamily: fonts.mono, fontSize: 24, letterSpacing: "0.06em", color: colors.deepMuted }}>Shopify + CRM automation · rhafael.dev</span>
    </div>
  </AbsoluteFill>
);
