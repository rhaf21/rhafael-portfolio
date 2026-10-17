// Builds the site icons from the 512px Remotion renders:
//   npx remotion still Favicon out/icon-512.png && npx remotion still AppleIcon out/apple-512.png
//   npx remotion still FaviconSmall out/icon-small-512.png
//   node scripts/icons.mjs
// Writes favicon.ico (16/32/48), icon-192.png, icon-512.png, and apple-icon.png to ../public.
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const site = path.join(root, "..");
// sharp is a dependency of the site, not of this video project.
const sharp = createRequire(path.join(site, "package.json"))("sharp");

const rounded = path.join(root, "out", "icon-512.png");
const square = path.join(root, "out", "apple-512.png");
// The heavier R, for sizes where the regular serif strokes would vanish.
const small = path.join(root, "out", "icon-small-512.png");
const out = (name) => path.join(site, "public", name);

const png = (src, size) => sharp(src).resize(size, size, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toBuffer();

// An .ico is a small directory of images; modern browsers accept PNG entries.
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + 16 * images.length;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const sizes = [16, 32, 48];
const icoImages = await Promise.all(sizes.map(async (size) => ({ size, data: await png(small, size) })));
await writeFile(out("favicon.ico"), ico(icoImages));
await writeFile(out("icon-192.png"), await png(rounded, 192));
await writeFile(out("icon-512.png"), await png(rounded, 512));
await writeFile(out("apple-icon.png"), await png(square, 180));
await writeFile(out("favicon.png"), await png(small, 96));
console.log("wrote favicon.ico, favicon.png, icon-192.png, icon-512.png, apple-icon.png");
