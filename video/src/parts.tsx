import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "./brand";

const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A line of type that rises out of a mask.
export const MaskLine: React.FC<{ start: number; children: ReactNode }> = ({ start, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - start, fps, config: { damping: 200, stiffness: 110, mass: 0.9 } });
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
      <div style={{ transform: `translateY(${(1 - p) * 112}%)` }}>{children}</div>
    </div>
  );
};

export const FadeUp: React.FC<{ start: number; style?: CSSProperties; children: ReactNode }> = ({
  start,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 24], [0, 1], { ...clamp, easing: expoOut });
  return <div style={{ ...style, opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>{children}</div>;
};

// Digits roll like an odometer instead of jumping.
export const Odometer: React.FC<{ digits: string[]; start: number; duration: number; size: number }> = ({
  digits,
  start,
  duration,
  size,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: expoOut });
  const offset = p * (digits.length - 1) * size;
  return (
    <span style={{ display: "inline-block", height: size, overflow: "hidden", verticalAlign: "top" }}>
      <span style={{ display: "flex", flexDirection: "column", transform: `translateY(${-offset}px)` }}>
        {digits.map((d, i) => (
          <span key={i} style={{ height: size, lineHeight: `${size}px` }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};

// Types a line of code on, one character at a time.
export const TypeLine: React.FC<{ start: number; text: string; tag: string; u: number }> = ({ start, text, tag, u }) => {
  const frame = useCurrentFrame();
  const chars = Math.floor(interpolate(frame, [start, start + 24], [0, text.length], clamp));
  return (
    <div style={{ fontFamily: fonts.mono, fontSize: 30 * u, lineHeight: 1.9, color: colors.deepMuted, whiteSpace: "pre" }}>
      <span style={{ color: colors.accentOnDeep }}>{tag}</span>
      {"  "}
      {text.slice(0, chars)}
    </div>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
    }}
  />
);

// Fine film grain, reseeded every frame.
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(random(`grain-${frame}`) * 1000);
  const id = `grain-${frame}`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.14 }}>
      <svg width="100%" height="100%">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Hud: React.FC<{ u: number }> = ({ u }) => (
  <div
    style={{
      position: "absolute",
      left: 48 * u,
      top: 42 * u,
      display: "flex",
      alignItems: "center",
      gap: 12 * u,
      fontFamily: fonts.mono,
      fontSize: 22 * u,
      letterSpacing: "0.12em",
      color: colors.deepMuted,
    }}
  >
    <span style={{ width: 10 * u, height: 10 * u, borderRadius: "50%", background: colors.accentOnDeep }} />
    rhafael.dev
  </div>
);
