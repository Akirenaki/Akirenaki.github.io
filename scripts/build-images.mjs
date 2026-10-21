// Build-time image pipeline.
//
// Reads full-resolution originals from /assets-src (git-tracked, never
// deployed) and writes resized, web-ready pairs into /public/assets
// (git-ignored, regenerated on every `npm run dev` / `npm run build`):
//   - a .webp (primary, smaller)
//   - a .jpg fallback at the SAME basename the data files already expect,
//     for browsers/crawlers that don't take the <picture> webp source.
//
// Output width per source is chosen from its folder + filename, sized to
// roughly 2-3x its actual on-page display size (see the width map below) so
// the browser is never asked to downscale by a huge ratio in one step -
// that's what was producing the blocky/blurry look, independent of format.
//
// Assets that need real transparency (currently just the navbar logo, which
// is supplied on a white background) skip the flatten-to-white step. They go
// through `whiteToAlpha` below and are written as a .png + .webp pair, both
// with an alpha channel, instead of the usual .jpg + .webp.
//
// The favicons are derived from that same logo (see `buildFavicons` below),
// so they have no source file of their own.
//
// Re-runs are cheap: a file is only reprocessed if its source is newer than
// the existing output, so this can safely run before every dev/build.

import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = join(__dirname, "..", "assets-src");
const OUT_ROOT = join(__dirname, "..", "public", "assets");

const JPEG_QUALITY = 82;
const WEBP_QUALITY = 80;

// Target output widths, matched against each source file's path/name.
// First matching rule wins. Add new rules here rather than hardcoding
// widths elsewhere - this is the one place display-size assumptions live.
const WIDTH_RULES = [
  { test: (rel) => rel.startsWith("credentials/"), width: 480 }, // ~160px CSS, 3x for retina
  { test: (rel) => rel.startsWith("projects/") && /-hero\.[^.]+$/.test(rel), width: 1536 }, // case-study hero, max-w-3xl container
  { test: (rel) => rel.startsWith("projects/"), width: 1280 }, // project cards
  { test: (rel) => rel === `portrait${extname(rel)}`, width: 640 }, // Home.jsx max-w-[280px]
  { test: (rel) => rel === `og-image${extname(rel)}`, width: 1200 }, // link-preview card; keep in sync with og:image:width in src/lib/seo.js
  { test: (rel) => rel === `logo${extname(rel)}`, width: 256 }, // Nav.jsx renders it at ~34px, so ~7x headroom for retina and reuse
  { test: () => true, width: 1280 }, // fallback if something new shows up unclassified
];

function widthFor(relPath) {
  return WIDTH_RULES.find((rule) => rule.test(relPath)).width;
}

// Sources that must keep an alpha channel. Their basenames are matched here
// so the rest of the pipeline stays unchanged for everything else.
function needsAlpha(relPath) {
  return /^logo\.[^.]+$/.test(relPath);
}

// Anything this close to pure white is treated as background. The logo's
// white backdrop carries faint compression noise (values like 253-254); without
// a floor that noise would survive as near-invisible speckle in the alpha channel.
const WHITE_NOISE_FLOOR = 6;

// A pixel whose darkest channel sits at least this far below 255 counts as
// solid logo. The thinnest/lightest solid parts of the logo (the pale-blue orbit)
// are ~90 below white, so this keeps every stroke at full opacity.
const SOLID_DARKNESS = 90;

// Turns the white backdrop into transparency while keeping each stroke's own
// colour. Coverage (alpha) comes from how far a pixel is from white; anti-aliased
// edge pixels are then un-mixed from white so they become "stroke colour at
// partial opacity" rather than a pale pink fringe. The result composites back
// onto white almost exactly (max error ~5/255) and, unlike a plain
// colour-to-alpha pass (which also drops alpha on every light pink/blue pixel
// and so turns the logo muddy on dark), stays vivid on a dark backdrop.
async function whiteToAlpha(srcPath) {
  const { data, info } = await sharp(srcPath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const darkness = 255 - Math.min(r, g, b);
    if (darkness < WHITE_NOISE_FLOOR) continue; // leaves the pixel fully transparent
    const alpha = Math.min(1, darkness / SOLID_DARKNESS);
    out[o] = Math.min(255, Math.max(0, Math.round(255 + (r - 255) / alpha)));
    out[o + 1] = Math.min(255, Math.max(0, Math.round(255 + (g - 255) / alpha)));
    out[o + 2] = Math.min(255, Math.max(0, Math.round(255 + (b - 255) / alpha)));
    out[o + 3] = Math.round(alpha * 255);
  }

  const logo = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
  return trimToSquare(logo);
}

// The supplied logo has ~7% empty margin on every side. Cropping it away (and
// padding back to a square, since the glyph isn't perfectly square) means the
// logo fills whatever box it is displayed in, so it can read larger without
// making the navbar taller. Expects a PNG buffer with an alpha channel.
async function trimToSquare(pngBuffer) {
  const { data, info } = await sharp(pngBuffer)
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });
  const side = Math.max(info.width, info.height);
  const padX = side - info.width;
  const padY = side - info.height;
  // sharp applies extend() *after* resize() whatever order they are chained in,
  // so the padded square is rendered to a buffer here; otherwise later resizes
  // of this image would be padded afterwards and come out the wrong size.
  const squared = await sharp(data)
    .extend({
      top: Math.floor(padY / 2),
      bottom: Math.ceil(padY / 2),
      left: Math.floor(padX / 2),
      right: Math.ceil(padX / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  return sharp(squared);
}

async function collectImages(dir, baseDir = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectImages(full, baseDir)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function isStale(srcPath, outPaths) {
  const srcStat = await stat(srcPath);
  for (const outPath of outPaths) {
    try {
      const outStat = await stat(outPath);
      if (outStat.mtimeMs < srcStat.mtimeMs) return true;
    } catch {
      return true; // output missing
    }
  }
  return false;
}

async function processImage(srcPath) {
  const relPath = srcPath.slice(SRC_ROOT.length + 1).replaceAll("\\", "/");
  const relDir = dirname(relPath);
  const name = basename(relPath, extname(relPath));
  const outDir = join(OUT_ROOT, relDir === "." ? "" : relDir);
  const alpha = needsAlpha(relPath);
  // Opaque sources get a .jpg fallback; sources that need transparency get a .png.
  const fallbackOut = join(outDir, `${name}.${alpha ? "png" : "jpg"}`);
  const webpOut = join(outDir, `${name}.webp`);

  if (!(await isStale(srcPath, [fallbackOut, webpOut]))) {
    return { name: relPath, skipped: true };
  }

  await mkdir(outDir, { recursive: true });
  const width = widthFor(relPath);

  if (alpha) {
    const resized = (await whiteToAlpha(srcPath)).resize({ width, withoutEnlargement: true });
    const [pngInfo, webpInfo] = await Promise.all([
      resized.clone().png({ compressionLevel: 9 }).toFile(fallbackOut),
      resized.clone().webp({ quality: WEBP_QUALITY, alphaQuality: 100 }).toFile(webpOut),
    ]);
    return { name: relPath, skipped: false, fallbackExt: "png", fallbackInfo: pngInfo, webpInfo };
  }

  const pipeline = sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    // Every current source's alpha channel is fully opaque (no real
    // transparency in use) - flatten onto white so the JPEG fallback is
    // valid and stays smaller than a PNG would be. If a future asset needs
    // real transparency, give it its own rule outputting .png instead.
    .flatten({ background: "#ffffff" });

  const [jpgInfo, webpInfo] = await Promise.all([
    pipeline.clone().jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(fallbackOut),
    pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpOut),
  ]);

  return { name: relPath, skipped: false, fallbackExt: "jpg", fallbackInfo: jpgInfo, webpInfo };
}

// Browser-tab and home-screen icons, generated from the logo so there is a
// single source of truth.
//   favicon-48.png        transparent, glyph filling almost the whole canvas so
//                         it stays legible at 16px. 48 is a multiple of 48,
//                         which search engines ask for; browsers scale it down.
//   apple-touch-icon.png  iOS can't show transparency (it fills it with black),
//                         so this one sits on the site's paper colour, with a
//                         slightly deeper tone so the pale pink holds up there.
const PAPER = "#FAF3F7"; // --color-paper in src/index.css
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
//   favicon-192.png       same transparent glyph at 192px (4 x 48). Search engines
//                         accept any multiple of 48 and prefer the larger one when
//                         they can get it; it is also what Android/PWA expects.
//   favicon.ico           lives at the SITE ROOT (public/favicon.ico), not in
//                         /assets. Crawlers and browsers request /favicon.ico by
//                         convention when a page's <link rel="icon"> is missed or
//                         fails, and without this file that request returns a 404.
const FAVICONS = [
  { file: "favicon-48.png", size: 48, inset: 0.96, background: CLEAR, deepen: false },
  { file: "favicon-192.png", size: 192, inset: 0.96, background: CLEAR, deepen: false },
  { file: "apple-touch-icon.png", size: 180, inset: 0.68, background: PAPER, deepen: true },
];

// Sizes packed into favicon.ico. Same transparent, near-full-bleed treatment
// as favicon-48.png so the tab icon looks identical whichever file is used.
const ICO_SIZES = [16, 32, 48];
const ICO_OUT = join(__dirname, "..", "public", "favicon.ico");

// Renders the logo glyph centred on a size x size canvas, as a PNG buffer.
async function renderIcon(logo, { size, inset, background, deepen }) {
  const inner = Math.round(size * inset);
  let glyph = logo.clone().resize(inner, inner, { fit: "contain", background: CLEAR });
  if (deepen) glyph = glyph.modulate({ saturation: 1.3, brightness: 0.9 });

  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: await glyph.png().toBuffer(), gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// sharp can't write .ico, so this packs PNG frames into the ICO container by
// hand. Since Windows Vista an ICO entry may hold a PNG as-is, and every
// current browser reads it. Layout: 6-byte header, one 16-byte directory entry
// per image, then the image data.
function packIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(frames.length, 4);

  let offset = 6 + 16 * frames.length;
  const entries = frames.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8); // image size in bytes
    e.writeUInt32LE(offset, 12); // image offset
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...frames.map((f) => f.data)]);
}

async function buildFavicons(images) {
  const logoSrc = images.find((p) => /^logo\.[^.]+$/.test(p.slice(SRC_ROOT.length + 1)));
  if (!logoSrc) return [];

  const outPaths = [...FAVICONS.map((f) => join(OUT_ROOT, f.file)), ICO_OUT];
  if (!(await isStale(logoSrc, outPaths))) return [];

  await mkdir(OUT_ROOT, { recursive: true });
  const logo = await whiteToAlpha(logoSrc);

  const pngs = await Promise.all(
    FAVICONS.map(async (spec) => {
      const data = await renderIcon(logo, spec);
      await writeFile(join(OUT_ROOT, spec.file), data);
      return { name: spec.file, size: data.length };
    })
  );

  const frames = await Promise.all(
    ICO_SIZES.map(async (size) => ({
      size,
      data: await renderIcon(logo, { size, inset: 0.96, background: CLEAR, deepen: false }),
    }))
  );
  const ico = packIco(frames);
  await writeFile(ICO_OUT, ico);

  return [...pngs, { name: "favicon.ico", size: ico.length }];
}

async function main() {
  const images = await collectImages(SRC_ROOT);
  const results = await Promise.all(images.map(processImage));

  const processed = results.filter((r) => !r.skipped);
  const skipped = results.filter((r) => r.skipped);

  for (const r of processed) {
    const kb = (n) => `${(n / 1024).toFixed(0)}kb`;
    console.log(
      `  images: ${r.name} -> ${kb(r.fallbackInfo.size)} ${r.fallbackExt}, ${kb(r.webpInfo.size)} webp`
    );
  }
  console.log(
    `images: ${processed.length} processed, ${skipped.length} up to date`
  );

  const favicons = await buildFavicons(images);
  for (const f of favicons) {
    console.log(`  favicons: ${f.name} -> ${(f.size / 1024).toFixed(1)}kb`);
  }
}

main().catch((err) => {
  console.error("images: build failed:", err);
  process.exit(1);
});
