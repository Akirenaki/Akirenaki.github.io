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
// Re-runs are cheap: a file is only reprocessed if its source is newer than
// the existing output, so this can safely run before every dev/build.

import { readdir, mkdir, stat } from "node:fs/promises";
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
  { test: () => true, width: 1280 }, // fallback if something new shows up unclassified
];

function widthFor(relPath) {
  return WIDTH_RULES.find((rule) => rule.test(relPath)).width;
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
  const jpgOut = join(outDir, `${name}.jpg`);
  const webpOut = join(outDir, `${name}.webp`);

  if (!(await isStale(srcPath, [jpgOut, webpOut]))) {
    return { name: relPath, skipped: true };
  }

  await mkdir(outDir, { recursive: true });
  const width = widthFor(relPath);

  const pipeline = sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    // Every current source's alpha channel is fully opaque (no real
    // transparency in use) - flatten onto white so the JPEG fallback is
    // valid and stays smaller than a PNG would be. If a future asset needs
    // real transparency, give it its own rule outputting .png instead.
    .flatten({ background: "#ffffff" });

  const [jpgInfo, webpInfo] = await Promise.all([
    pipeline.clone().jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(jpgOut),
    pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpOut),
  ]);

  return { name: relPath, skipped: false, jpgInfo, webpInfo };
}

async function main() {
  const images = await collectImages(SRC_ROOT);
  const results = await Promise.all(images.map(processImage));

  const processed = results.filter((r) => !r.skipped);
  const skipped = results.filter((r) => r.skipped);

  for (const r of processed) {
    const kb = (n) => `${(n / 1024).toFixed(0)}kb`;
    console.log(
      `  images: ${r.name} -> ${kb(r.jpgInfo.size)} jpg, ${kb(r.webpInfo.size)} webp`
    );
  }
  console.log(
    `images: ${processed.length} processed, ${skipped.length} up to date`
  );
}

main().catch((err) => {
  console.error("images: build failed:", err);
  process.exit(1);
});
