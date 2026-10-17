// Renders review stills at each beat's key frame: node scripts/stills.mjs [CompositionId]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const serveUrl = await bundle({ entryPoint: path.join(root, "src", "index.ts") });
const ids = process.argv[2] ? [process.argv[2]] : ["IntroStory"];
const frames = process.argv[3] ? process.argv[3].split(",").map(Number) : [70, 235, 390, 560, 715, 860];

for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, inputProps: {} });
  for (const frame of frames) {
    const output = path.join(root, "out", "stills", `${id}-f${String(frame).padStart(3, "0")}.png`);
    await renderStill({ composition, serveUrl, output, frame, inputProps: {} });
    console.log(`wrote ${output}`);
  }
}
