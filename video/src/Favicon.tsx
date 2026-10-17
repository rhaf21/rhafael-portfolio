import { AbsoluteFill } from "remotion";
import { colors, fonts } from "./brand";

// The site mark: the wordmark's "R" and ember dot on the deep tile. Rendered at
// 512px; scripts/icons.mjs scales it to the favicon and touch-icon sizes.
// `heavy` thickens the R so it survives being shrunk to a 16px browser tab.
export const Favicon: React.FC<{ rounded: boolean; heavy?: boolean }> = ({ rounded, heavy = false }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div
      style={{
        width: 512,
        height: 512,
        borderRadius: rounded ? 116 : 0,
        background: colors.deep,
        position: "relative",
        overflow: "hidden",
        boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.06)",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 92,
          top: 18,
          fontFamily: fonts.display,
          fontSize: 470,
          lineHeight: 1,
          color: colors.deepInk,
          letterSpacing: "-0.02em",
          WebkitTextStroke: heavy ? `16px ${colors.deepInk}` : undefined,
        }}
      >
        R
      </span>
      <span
        style={{
          position: "absolute",
          left: 374,
          top: 352,
          width: heavy ? 76 : 64,
          height: heavy ? 76 : 64,
          borderRadius: "50%",
          background: colors.accentOnDeep,
          boxShadow: "0 0 28px rgba(224,122,74,0.6)",
        }}
      />
    </div>
  </AbsoluteFill>
);
