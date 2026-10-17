// Composes the intro story's score from the same frame timeline as the video,
// so every chord change, swell, and sound effect lands on its cut.
// Output: public/music/score.wav (48 kHz, 16-bit stereo, 30 s). Original, so no licensing.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SR = 48000;
const DUR = 30;
const N = SR * DUR;
const FPS = 30;
const L = new Float32Array(N);
const R = new Float32Array(N);

const sec = (frame) => frame / FPS;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Deterministic noise, so every render of the score is identical.
let seed = 20261017;
function rand() {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function put(i, v, pan) {
  if (i < 0 || i >= N) return;
  const a = ((pan + 1) * Math.PI) / 4;
  L[i] += v * Math.cos(a);
  R[i] += v * Math.sin(a);
}

const coef = (hz) => 1 - Math.exp((-2 * Math.PI * hz) / SR);

// A pitched voice with attack, sustain, and exponential release; optional glide and low-pass.
function tone({ t0, dur, freq, glideTo = freq, gain, attack = 0.005, release = 0.2, wave = "sine", pan = 0, lpf = 0, detune = 0 }) {
  const i0 = Math.floor(t0 * SR);
  const total = Math.floor((dur + release * 5) * SR);
  let phase = rand();
  let y = 0;
  const k = lpf ? coef(lpf) : 1;
  const ratio = Math.pow(2, detune / 1200);
  for (let n = 0; n < total; n++) {
    const t = n / SR;
    const f = (freq + (glideTo - freq) * Math.min(1, t / Math.max(dur, 1e-6))) * ratio;
    phase += f / SR;
    phase -= Math.floor(phase);
    let x;
    if (wave === "saw") x = 2 * phase - 1;
    else if (wave === "tri") x = 1 - 4 * Math.abs(phase - 0.5);
    else x = Math.sin(2 * Math.PI * phase);
    let amp = t < attack ? t / attack : 1;
    if (t > dur) amp *= Math.exp(-(t - dur) / release);
    if (amp < 1e-4 && t > dur) break;
    y += k * (x - y);
    put(i0 + n, y * amp * gain, pan);
  }
}

// Filtered noise: optional band (high-pass and low-pass), a cutoff sweep, and a gain curve.
function noise({ t0, dur, gain, hp = 0, lp = 0, lpTo = lp, curve = "decay", decay = 0.05, pan = 0 }) {
  const i0 = Math.floor(t0 * SR);
  const total = Math.floor(dur * SR);
  let lo = 0;
  let hpLo = 0;
  const kh = hp ? coef(hp) : 0;
  for (let n = 0; n < total; n++) {
    const t = n / SR;
    const p = t / dur;
    let x = rand() * 2 - 1;
    if (lp) {
      lo += coef(lp + (lpTo - lp) * p) * (x - lo);
      x = lo;
    }
    if (hp) {
      hpLo += kh * (x - hpLo);
      x -= hpLo;
    }
    let amp;
    if (curve === "rise") amp = p * p;
    else if (curve === "fall") amp = (1 - p) * (1 - p);
    else amp = Math.exp(-t / decay);
    put(i0 + n, x * amp * gain, pan);
  }
}

// cubic-bezier easing, matching the video's odometer curve.
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t -= (sx(t) - x) / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}
const expoOut = bezier(0.16, 1, 0.3, 1);

// ---- Harmony: one chord per scene, opening up as the story builds ----
const CHORDS = [
  { t0: 0, t1: 4, notes: [50, 57, 61, 64, 66], lpf: 650 }, // Dmaj9 · hook
  { t0: 4, t1: 9, notes: [47, 54, 57, 61, 62], lpf: 850 }, // Bm9 · origin
  { t0: 9, t1: 14, notes: [43, 50, 54, 57, 59], lpf: 1050 }, // Gmaj9 · growth
  { t0: 14, t1: 17, notes: [40, 47, 54, 55, 62], lpf: 1300 }, // Em9 · proof
  { t0: 17, t1: 20, notes: [45, 52, 57, 59, 61], lpf: 1500 }, // A add9 · proof lifts
  { t0: 20, t1: 22.5, notes: [43, 50, 54, 59, 62], lpf: 1500 }, // Gmaj7 · method
  { t0: 22.5, t1: 25, notes: [45, 52, 57, 62, 64], lpf: 1700 }, // Asus · tension before the reveal
  { t0: 25, t1: 30, notes: [38, 50, 57, 61, 64, 66], lpf: 1900 }, // Dmaj9 · resolve on your name
];

for (const c of CHORDS) {
  c.notes.forEach((m, i) => {
    const pan = (i / (c.notes.length - 1)) * 1.2 - 0.6;
    for (const det of [-7, 7]) {
      tone({ t0: c.t0, dur: c.t1 - c.t0, freq: mtof(m), gain: 0.032, attack: 0.6, release: 0.5, wave: "saw", pan, lpf: c.lpf, detune: det });
    }
  });
}
const chordAt = (t) => CHORDS.find((c) => t >= c.t0 && t < c.t1) ?? CHORDS[CHORDS.length - 1];

// ---- Rhythm on the 120 BPM grid (a beat every 0.5 s, every 15 frames) ----
for (let t = 4; t < 25; t += 0.25) {
  const c = chordAt(t);
  const low = Math.min(...c.notes);
  const rootNote = low > 45 ? low - 12 : low;
  const onBeat = Math.abs(t * 2 - Math.round(t * 2)) < 1e-6;
  tone({ t0: t, dur: 0.02, freq: mtof(rootNote), gain: onBeat ? 0.13 : 0.08, attack: 0.004, release: 0.17, wave: "tri", lpf: 900 });
  if (!onBeat) noise({ t0: t, dur: 0.06, gain: 0.022, hp: 7000, decay: 0.03, pan: 0.25 });
  if (t >= 14 && t < 25 && !onBeat) noise({ t0: t + 0.125, dur: 0.05, gain: 0.012, hp: 8000, decay: 0.02, pan: -0.25 });
  if (t >= 9 && onBeat) tone({ t0: t, dur: 0.11, freq: 120, glideTo: 46, gain: t >= 14 ? 0.26 : 0.17, attack: 0.002, release: 0.14 });
}

// ---- Transitions: swell in, boom on landing, whoosh through the glide ----
const CUTS = [120, 270, 420, 600, 750].map(sec);
for (const T of CUTS) {
  noise({ t0: T - 0.75, dur: 0.75, gain: 0.07, lp: 300, lpTo: 6000, curve: "rise" });
  noise({ t0: T, dur: 1.05, gain: 0.08, lp: 5000, lpTo: 350, curve: "fall", pan: 0.15 });
  tone({ t0: T, dur: 0.05, freq: 62, glideTo: 42, gain: 0.24, attack: 0.004, release: 0.5 });
}

// ---- Scene sound effects, on their frames ----
// Origin: typing under the three Liquid lines.
for (const [a, b] of [[162, 186], [186, 210], [210, 234]]) {
  for (let t = sec(a); t < sec(b); t += 0.06 + rand() * 0.035) {
    noise({ t0: t, dur: 0.03, gain: 0.03, hp: 2500, decay: 0.008, pan: rand() * 0.4 - 0.2 });
  }
}
// Growth: a pluck as each node lights, rising.
[[306, 78], [324, 81], [342, 86]].forEach(([f, m], i) => {
  tone({ t0: sec(f), dur: 0.01, freq: mtof(m), gain: 0.14, attack: 0.002, release: 0.45, wave: "tri", pan: -0.4 + i * 0.4 });
  tone({ t0: sec(f), dur: 0.01, freq: mtof(m + 12), gain: 0.04, attack: 0.002, release: 0.25, pan: -0.4 + i * 0.4 });
});
// Proof: a tick each time an odometer digit turns over.
function odometerTicks(start, duration, digits) {
  const ticks = [];
  let last = 0;
  for (let f = start; f <= start + duration; f += 0.25) {
    const pos = expoOut(Math.min(1, (f - start) / duration)) * (digits - 1);
    const shown = Math.floor(pos + 0.5);
    if (shown > last) {
      ticks.push(sec(f));
      last = shown;
    }
  }
  return ticks;
}
for (const t of [...odometerTicks(432, 42, 3), ...odometerTicks(468, 42, 3), ...odometerTicks(468, 42, 7)]) {
  noise({ t0: t, dur: 0.03, gain: 0.07, hp: 1800, decay: 0.006 });
  tone({ t0: t, dur: 0.005, freq: 2100, gain: 0.03, attack: 0.001, release: 0.012 });
}
// Method: printer motor and a chatter on each print step, then the stamp.
tone({ t0: sec(615), dur: sec(663) - sec(615), freq: 98, gain: 0.018, attack: 0.05, release: 0.05, wave: "saw", lpf: 400 });
for (let k = 1; k <= 10; k++) {
  const t = sec(615 + 4.8 * k);
  noise({ t0: t, dur: 0.04, gain: 0.05, hp: 1500, lp: 4200, decay: 0.012, pan: 0.1 });
}
tone({ t0: sec(669), dur: 0.16, freq: 140, glideTo: 45, gain: 0.42, attack: 0.002, release: 0.3 });
noise({ t0: sec(669), dur: 0.05, gain: 0.12, hp: 800, lp: 3000, decay: 0.015 });
// You: a chime when the ember dot pops, and a soft bell as the music resolves.
tone({ t0: sec(783), dur: 0.01, freq: mtof(86), gain: 0.12, attack: 0.002, release: 0.8, wave: "tri", pan: 0.2 });
tone({ t0: sec(783), dur: 0.01, freq: mtof(93), gain: 0.04, attack: 0.002, release: 0.5, pan: 0.2 });
for (const [f, m] of [[750, 74], [750, 78], [870, 81]]) {
  tone({ t0: sec(f), dur: 0.01, freq: mtof(m), gain: 0.06, attack: 0.003, release: 1.4, pan: m === 78 ? -0.3 : 0.3 });
}

// ---- Space: a small Schroeder reverb on the whole mix ----
function reverb(input, delaysMs, feedback, mix) {
  const out = new Float32Array(N);
  for (const ms of delaysMs) {
    const d = Math.floor((ms / 1000) * SR);
    const buf = new Float32Array(d);
    let idx = 0;
    for (let i = 0; i < N; i++) {
      const y = buf[idx];
      buf[idx] = input[i] + y * feedback;
      out[i] += y / delaysMs.length;
      idx = (idx + 1) % d;
    }
  }
  for (const ms of [5, 1.7]) {
    const d = Math.floor((ms / 1000) * SR);
    const buf = new Float32Array(d);
    let idx = 0;
    for (let i = 0; i < N; i++) {
      const x = out[i];
      const y = buf[idx];
      const v = -0.7 * x + y;
      buf[idx] = x + 0.7 * v;
      out[i] = v;
      idx = (idx + 1) % d;
    }
  }
  for (let i = 0; i < N; i++) input[i] = input[i] * (1 - mix) + out[i] * mix * 1.6;
}
reverb(L, [29.7, 37.1, 41.1, 43.7], 0.8, 0.22);
reverb(R, [31.3, 35.9, 40.3, 45.1], 0.8, 0.22);

// ---- Master: remove DC, soft-clip, fade the last half second, normalise to -1 dBFS ----
let peak = 0;
let sumSq = 0;
for (const ch of [L, R]) {
  let lo = 0;
  const k = coef(25);
  for (let i = 0; i < N; i++) {
    lo += k * (ch[i] - lo);
    let x = Math.tanh((ch[i] - lo) * 1.15);
    const tail = (N - i) / SR;
    if (tail < 0.5) x *= tail / 0.5;
    ch[i] = x;
    peak = Math.max(peak, Math.abs(x));
  }
}
const scale = 0.89 / peak;
for (const ch of [L, R]) for (let i = 0; i < N; i++) { ch[i] *= scale; sumSq += ch[i] * ch[i]; }

// ---- Write a 16-bit PCM WAV ----
const dataBytes = N * 2 * 2;
const buf = Buffer.alloc(44 + dataBytes);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + dataBytes, 4); buf.write("WAVE", 8);
buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write("data", 36); buf.writeUInt32LE(dataBytes, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
}
const out = path.join(root, "public", "music", "score.wav");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, buf);
const rmsDb = 10 * Math.log10(sumSq / (2 * N));
console.log(`wrote ${out}: ${DUR}s, peak -1.0 dBFS, RMS ${rmsDb.toFixed(1)} dBFS`);
