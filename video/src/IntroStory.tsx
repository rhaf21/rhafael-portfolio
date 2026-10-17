import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { colors, fonts } from "./brand";
import { FadeUp, Grain, Hud, MaskLine, Odometer, TypeLine, Vignette } from "./parts";
import { BEAT_COUNT, BEAT_STARTS, CAMERA_MOVE, DURATION } from "./timeline";

export type IntroStoryProps = {
  // Path under public/, for example "music/bed.mp3". Leave empty to render silent.
  musicSrc?: string;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cameraEase = Easing.bezier(0.7, 0, 0.18, 1.06);

// Vertical position of the wire inside each beat, as a share of the height.
const WIRE_Y = [0.6, 0.71, 0.62, 0.78, 0.8, 0.49];

type Layout = { W: number; H: number; u: number; pad: number; cw: number };

function useLayout(): Layout {
  const { width: W, height: H } = useVideoConfig();
  const u = Math.min(W / 1080, H / 1350);
  const cw = 900 * u;
  const pad = Math.max(0.08 * W, (W - cw) / 2);
  return { W, H, u, pad, cw };
}

function cameraX(frame: number, W: number): number {
  let x = 0;
  for (let b = 1; b < BEAT_COUNT; b++) {
    const start = BEAT_STARTS[b];
    x -= interpolate(frame, [start, start + CAMERA_MOVE], [0, 1], { ...clamp, easing: cameraEase }) * W;
  }
  return x;
}

function cameraMoving(frame: number): boolean {
  return BEAT_STARTS.slice(1).some((s) => frame >= s - 1 && frame <= s + CAMERA_MOVE);
}

// One continuous wire across the whole strip. Each beat runs level, then
// curves into the next beat's height across the cut.
function buildWire({ W, H, u, pad }: Layout) {
  const c = 0.14 * W;
  const ys = WIRE_Y.map((y) => y * H);
  const parts: string[] = [`M ${pad} ${ys[0]}`];
  const checkpoints: string[] = [];
  for (let b = 0; b < BEAT_COUNT - 1; b++) {
    const edge = (b + 1) * W;
    parts.push(`H ${edge - c}`);
    parts.push(`C ${edge} ${ys[b]} ${edge} ${ys[b + 1]} ${edge + c} ${ys[b + 1]}`);
    checkpoints.push(parts.join(" "));
  }
  parts.push(`H ${(BEAT_COUNT - 1) * W + pad + 470 * u}`);
  const d = parts.join(" ");
  checkpoints.push(d);
  return { d, lengths: checkpoints.map((p) => getLength(p)), total: getLength(d) };
}

// How much of the wire is drawn: it leads the camera into each next beat.
function wireLength(frame: number, lengths: number[]): number {
  const windows: [number, number][] = [
    [30, 128],
    [135, 278],
    [285, 428],
    [435, 608],
    [615, 758],
    [770, 812],
  ];
  let drawn = 0;
  windows.forEach(([a, b], i) => {
    const from = i === 0 ? 0 : lengths[i - 1];
    const to = lengths[i];
    if (frame >= a) drawn = interpolate(frame, [a, b], [from, to], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  });
  return drawn;
}

export const IntroStory: React.FC<IntroStoryProps> = ({ musicSrc }) => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const world = <World layout={layout} />;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.deep, color: colors.deepInk, overflow: "hidden" }}>
      {cameraMoving(frame) ? (
        <CameraMotionBlur shutterAngle={200} samples={8}>
          {world}
        </CameraMotionBlur>
      ) : (
        world
      )}
      <Vignette />
      <Grain />
      <Hud u={layout.u} />
      {musicSrc ? (
        <Audio
          src={staticFile(musicSrc)}
          volume={(f) => interpolate(f, [0, 4, DURATION - 30, DURATION - 1], [0, 1, 1, 0], clamp)}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const World: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { W, H, u, pad } = layout;
  const wire = useMemo(() => buildWire(layout), [layout]);
  const drawn = wireLength(frame, wire.lengths);
  const evolved = evolvePath(Math.max(0.0001, drawn / wire.total), wire.d);
  const tip = getPointAtLength(wire.d, Math.max(0, drawn));
  const showTip = tip !== null && drawn > 1 && drawn < wire.total - 1;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: W * BEAT_COUNT,
        height: H,
        transform: `translateX(${cameraX(frame, W)}px)`,
      }}
    >
      <svg width={W * BEAT_COUNT} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={wire.d} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3 * u} />
        <path
          d={wire.d}
          fill="none"
          stroke={colors.accentOnDeep}
          strokeWidth={4 * u}
          strokeLinecap="round"
          strokeDasharray={evolved.strokeDasharray}
          strokeDashoffset={evolved.strokeDashoffset}
          style={{ filter: `drop-shadow(0 0 ${6 * u}px rgba(224,122,74,0.55))` }}
        />
        {showTip && tip ? (
          <circle
            cx={tip.x}
            cy={tip.y}
            r={7 * u}
            fill={colors.accentOnDeep}
            style={{ filter: `drop-shadow(0 0 ${10 * u}px rgba(224,122,74,0.9))` }}
          />
        ) : null}
      </svg>
      <Hook layout={layout} />
      <Origin layout={layout} />
      <Growth layout={layout} />
      <Proof layout={layout} />
      <Method layout={layout} />
      <You layout={layout} />
    </div>
  );
};

const display = (size: number, u: number): CSSProperties => ({
  fontFamily: fonts.display,
  fontWeight: 400,
  fontSize: size * u,
  lineHeight: 0.98,
  letterSpacing: "-0.02em",
});

const label = (u: number): CSSProperties => ({
  fontFamily: fonts.mono,
  fontSize: 22 * u,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: colors.deepMuted,
});

const em: CSSProperties = { fontStyle: "italic", color: colors.accentOnDeep };

const beatBox = (index: number, { W, H }: Layout): CSSProperties => ({
  position: "absolute",
  left: index * W,
  top: 0,
  width: W,
  height: H,
});

const Hook: React.FC<{ layout: Layout }> = ({ layout }) => {
  const { H, u, pad } = layout;
  return (
    <div style={beatBox(0, layout)}>
      <div style={{ position: "absolute", left: pad, top: 0.36 * H, ...display(104, u) }}>
        <MaskLine start={6}>Good stores</MaskLine>
        <MaskLine start={10}>
          still <span style={em}>lose sales.</span>
        </MaskLine>
      </div>
      <FadeUp start={24} style={{ position: "absolute", left: pad, top: 0.36 * H + 236 * u, ...label(u) }}>
        Usually somewhere no one checks
      </FadeUp>
    </div>
  );
};

const Origin: React.FC<{ layout: Layout }> = ({ layout }) => {
  const { H, u, pad } = layout;
  return (
    <div style={beatBox(1, layout)}>
      <div style={{ position: "absolute", left: pad, top: 0.28 * H, ...display(84, u) }}>
        <MaskLine start={141}>I started finding where,</MaskLine>
        <MaskLine start={144}>one Liquid theme</MaskLine>
        <MaskLine start={147}>at a time.</MaskLine>
      </div>
      <div style={{ position: "absolute", left: pad, top: 0.53 * H }}>
        <TypeLine start={162} tag="liquid" text="{% for product in collection.products %}" u={u} />
        <TypeLine start={186} tag="liquid" text="{% render 'card', product: product %}" u={u} />
        <TypeLine start={210} tag="liquid" text="{% endfor %}" u={u} />
      </div>
    </div>
  );
};

const Growth: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { H, u, pad, cw } = layout;
  const nodes = [
    { at: 306, x: 0.1, name: "Shopify" },
    { at: 324, x: 0.5, name: "n8n" },
    { at: 342, x: 0.85, name: "GoHighLevel\nSalesforce" },
  ];
  return (
    <div style={beatBox(2, layout)}>
      <div style={{ position: "absolute", left: pad, top: 0.28 * H, ...display(84, u) }}>
        <MaskLine start={291}>Then I followed</MaskLine>
        <MaskLine start={294}>the order</MaskLine>
        <MaskLine start={297}>
          <span style={em}>past checkout.</span>
        </MaskLine>
      </div>
      {nodes.map((n) => {
        const s = spring({ frame: frame - n.at, fps, config: { damping: 14, stiffness: 160 } });
        const lit = frame >= n.at;
        const x = pad + n.x * cw;
        const y = WIRE_Y[2] * H;
        return (
          <div key={n.name}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 30 * u,
                height: 30 * u,
                borderRadius: "50%",
                transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * s})`,
                background: lit ? colors.accentOnDeep : colors.deep,
                border: `${3 * u}px solid ${lit ? colors.accentOnDeep : "rgba(255,255,255,0.25)"}`,
                boxShadow: lit ? `0 0 0 ${12 * u * s}px rgba(224,122,74,0.18)` : "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x,
                top: y + 40 * u,
                transform: "translateX(-50%)",
                whiteSpace: "pre-line",
                textAlign: "center",
                lineHeight: 1.5,
                opacity: s,
                ...label(u),
                letterSpacing: "0.06em",
              }}
            >
              {n.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Proof: React.FC<{ layout: Layout }> = ({ layout }) => {
  const { H, u, pad } = layout;
  const size = 220 * u;
  return (
    <div style={beatBox(3, layout)}>
      <div style={{ position: "absolute", left: pad, top: 0.24 * H }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 30 * u, fontFamily: fonts.display, fontSize: size, lineHeight: 1 }}>
          <FadeUp start={426} style={{ fontSize: 150 * u, lineHeight: 1, color: colors.deepMuted, textDecoration: "line-through", textDecorationColor: colors.accentOnDeep, textDecorationThickness: 5 * u, paddingBottom: 16 * u }}>
            4
          </FadeUp>
          <FadeUp start={429} style={{ fontFamily: fonts.mono, fontSize: 56 * u, lineHeight: 1, color: colors.deepMuted, paddingBottom: 46 * u }}>
            →
          </FadeUp>
          <Odometer digits={["4", "3", "2"]} start={432} duration={42} size={size} />
        </div>
        <FadeUp start={444} style={{ ...label(u), marginTop: 14 * u }}>
          Clicks to pay · a Sydney milliner
        </FadeUp>
      </div>
      <FadeUp start={462} style={{ position: "absolute", left: pad, top: 0.52 * H }}>
        <div style={{ display: "flex", fontFamily: fonts.display, fontSize: size, lineHeight: 1 }}>
          <Odometer digits={["0", "1", "2"]} start={468} duration={42} size={size} />
          <Odometer digits={["0", "1", "2", "3", "4", "5", "6"]} start={468} duration={42} size={size} />
        </div>
        <div style={{ ...label(u), marginTop: 14 * u }}>Stranded students, unblocked</div>
      </FadeUp>
    </div>
  );
};

const Method: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { H, u, pad } = layout;
  const printed = Math.floor(interpolate(frame, [615, 663], [0, 1], clamp) * 10) / 10;
  const stamp = spring({ frame: frame - 669, fps, config: { damping: 9, stiffness: 190 } });
  const row: CSSProperties = { display: "flex", justifyContent: "space-between" };
  return (
    <div style={beatBox(4, layout)}>
      <div style={{ position: "absolute", left: pad, top: 0.22 * H, ...display(84, u) }}>
        <MaskLine start={621}>Every change ships</MaskLine>
        <MaskLine start={624}>
          with a <span style={em}>receipt.</span>
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: pad, top: 0.4 * H, width: 540 * u, height: 12 * u, borderRadius: 999, background: "rgba(255,255,255,0.18)", zIndex: 2 }} />
      <div style={{ position: "absolute", left: pad + 30 * u, top: 0.4 * H + 6 * u, width: 480 * u, height: 470 * u, overflow: "hidden" }}>
        <div
          style={{
            position: "relative",
            background: colors.surface,
            color: colors.ink,
            padding: `${32 * u}px ${30 * u}px ${130 * u}px`,
            fontFamily: fonts.mono,
            fontSize: 24 * u,
            lineHeight: 1.85,
            transform: `translateY(${(printed - 1) * 100}%)`,
          }}
        >
          <div style={{ fontFamily: fonts.display, fontSize: 40 * u, textAlign: "center", marginBottom: 6 * u }}>Receipt</div>
          <div style={row}><span>before</span><span>4 clicks</span></div>
          <div style={row}><span>after</span><span style={{ color: colors.accent }}>2 clicks</span></div>
          {/* The milliner's analytics stay out until they clear publishing them. */}
          <div style={row}><span>fixes</span><span style={{ color: colors.accent }}>4 of 4</span></div>
          <div style={row}><span>checks</span><span>passed</span></div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 36 * u,
              border: `${5 * u}px double ${colors.accent}`,
              color: colors.accent,
              fontSize: 32 * u,
              letterSpacing: "0.14em",
              padding: `${8 * u}px ${20 * u}px`,
              borderRadius: 8 * u,
              opacity: frame >= 669 ? 0.92 : 0,
              transform: `translateX(-50%) rotate(-8deg) scale(${2.2 - 1.2 * stamp})`,
            }}
          >
            SHIPPED
          </div>
        </div>
      </div>
    </div>
  );
};

const You: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { H, u, pad } = layout;
  const dot = spring({ frame: frame - 783, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={beatBox(5, layout)}>
      <div style={{ position: "absolute", left: pad, top: 0.26 * H, ...display(150, u), lineHeight: 0.92 }}>
        <MaskLine start={753}>Rhafael</MaskLine>
        <MaskLine start={757}>
          Corpuz
          <span
            style={{
              display: "inline-block",
              width: 22 * u,
              height: 22 * u,
              borderRadius: "50%",
              background: colors.accentOnDeep,
              marginLeft: 12 * u,
              transform: `scale(${dot})`,
            }}
          />
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: pad, top: 0.53 * H, ...display(72, u) }}>
        <MaskLine start={768}>
          Work you can <span style={em}>check.</span>
        </MaskLine>
      </div>
      <FadeUp start={786} style={{ position: "absolute", left: pad, top: 0.66 * H }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: 84 * u,
            padding: `0 ${40 * u}px`,
            borderRadius: 999,
            background: colors.accentOnDeep,
            color: colors.deep,
            fontFamily: fonts.sans,
            fontWeight: 500,
            fontSize: 32 * u,
          }}
        >
          Book a 20-min call
        </div>
      </FadeUp>
      <FadeUp start={795} style={{ position: "absolute", left: pad, top: 0.75 * H, ...label(u) }}>
        Shopify · GoHighLevel · Salesforce · n8n
      </FadeUp>
    </div>
  );
};
