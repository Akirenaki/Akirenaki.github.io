// Generates the downloadable PDF of every essay that has a Markdown file in
// src/essays/, by printing its prerendered page with headless Chromium. The
// PDF is therefore made from the same text as the page, so the two cannot
// disagree.
//
// Runs after `react-router build` (see "build" in package.json) and writes to
// build/client/<pdf.path>, e.g. build/client/essays/<slug>.pdf. That is the
// deploy folder, not public/, so a generated PDF replaces any file of the same
// name committed under public/essays/ in the published site without touching
// the repo. An entry with no Markdown file is skipped and keeps its committed PDF.
//
// What gets printed is the entry page itself with its @media print styles
// (src/index.css and the print: classes in pages/WritingEntry.jsx): title,
// author line, essay text, references and a source line, without the site
// chrome.
//
// Needs a Chromium that Playwright can drive:
//   npx playwright install chromium            (once, on your machine)
//   npx playwright install --with-deps chromium  (the deploy workflow does this)
//
// Environment:
//   CI=true             a failure here fails the build (so a deploy can't ship
//                       without its PDFs); locally it only warns and skips
//   SKIP_PDFS=1         skip this step entirely
//   PDF_CHROMIUM_PATH   use this Chromium/Chrome executable instead of
//                       Playwright's own download
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writing } from "../src/data/writing.js";
import { pageUrl } from "../src/lib/seo.js";

const ROOT = fileURLToPath(new URL("../build/client/", import.meta.url));
const ESSAYS = fileURLToPath(new URL("../src/essays/", import.meta.url));
const strict = Boolean(process.env.CI);

if (process.env.SKIP_PDFS) {
  console.log("pdfs: SKIP_PDFS is set, skipping");
  process.exit(0);
}

function giveUp(message) {
  if (strict) {
    console.error(`pdfs: ERROR - ${message}`);
    process.exit(1);
  }
  console.warn(`pdfs: WARNING - ${message}\npdfs: skipped; the site will use the PDFs committed under public/essays/ (if any).`);
  process.exit(0);
}

if (!existsSync(path.join(ROOT, "index.html"))) giveUp("build/client/ not found; run `react-router build` first");

const targets = writing.filter((w) => existsSync(path.join(ESSAYS, `${w.slug}.md`)));
const skipped = writing.filter((w) => !targets.includes(w));
if (targets.length === 0) giveUp("no essays have a Markdown file in src/essays/");

// ---- a minimal static server for build/client ------------------------------

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

async function fileFor(urlPath) {
  let rel;
  try {
    rel = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }
  let file = path.join(ROOT, path.normalize(rel));
  if (!file.startsWith(ROOT)) return null; // never serve outside build/client
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    await stat(file);
    return file;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const file = await fileFor(req.url ?? "/");
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain" }).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

// ---- print each essay ------------------------------------------------------

const footer = (url) => `
  <div style="width:100%; box-sizing:border-box; padding:0 22mm; display:flex; justify-content:space-between;
              font-family:sans-serif; font-size:8px; color:#5B5468;">
    <span>${url}</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`;

let browser;
try {
  const { chromium } = await import("playwright");
  browser = await chromium.launch({ executablePath: process.env.PDF_CHROMIUM_PATH || undefined });
} catch (err) {
  server.close();
  giveUp(`could not start Chromium (${err.message.split("\n")[0]}). Install it with \`npx playwright install chromium\`.`);
}

let failed = 0;
try {
  for (const w of targets) {
    try {
      // JavaScript is off on purpose: the prerendered HTML already holds the whole
      // page, and this keeps the build from running the site's scripts (the
      // visitor counter, the animated background) or registering as a visit.
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      const url = `${origin}/writing/${w.slug}/`;
      const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
      if (!response?.ok()) throw new Error(`${url} answered ${response?.status()}`);
      await page.waitForTimeout(500); // web fonts finishing their swap
      await page.emulateMedia({ media: "print" });

      const out = path.join(ROOT, w.pdf.path.replace(/^\//, ""));
      await mkdir(path.dirname(out), { recursive: true });
      const pdf = await page.pdf({
        format: "A4",
        margin: { top: "22mm", right: "22mm", bottom: "24mm", left: "22mm" },
        displayHeaderFooter: true,
        headerTemplate: "<span></span>",
        footerTemplate: footer(pageUrl(`/writing/${w.slug}`).replace(/^https?:\/\//, "")),
        printBackground: false,
        tagged: true, // accessible structure for screen readers
        outline: true, // bookmarks from the headings
      });
      if (pdf.length < 5_000) throw new Error(`output is only ${pdf.length} bytes`);
      await writeFile(out, pdf);
      console.log(`pdfs: ${w.pdf.path} (${Math.round(pdf.length / 1024)} KB)`);
      await context.close();
    } catch (err) {
      failed += 1;
      console.error(`pdfs: ERROR - "${w.slug}": ${err.message}`);
    }
  }
} finally {
  await browser.close();
  server.close();
}

for (const w of skipped) console.log(`pdfs: "${w.slug}" has no src/essays/${w.slug}.md; keeping its committed PDF`);
if (failed > 0) {
  console.error(`pdfs: ${failed} of ${targets.length} PDFs failed`);
  if (strict) process.exit(1);
}
