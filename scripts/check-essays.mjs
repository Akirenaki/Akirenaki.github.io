// Build-time checks on the essays. Warns (never fails), so a slip can't block a
// deploy, but nothing else in the build would notice these:
//   - an entry in src/data/writing.js has no src/essays/<slug>.md (the page would
//     show no text, and no PDF can be generated for it);
//   - an entry with no Markdown file also has no committed PDF in public/essays/
//     (the Download button would 404). Entries that do have Markdown get their
//     PDF from scripts/build-pdfs.mjs after the build, so none is needed;
//   - an essay's wordCount in writing.js no longer matches its Markdown.
// Runs as part of `npm run build` (see "prebuild" in package.json).
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { writing } from "../src/data/writing.js";
import { countEssayWords } from "../src/lib/essay-wordcount.js";

const here = (rel) => fileURLToPath(new URL(rel, import.meta.url));
let warnings = 0;
const warn = (msg) => {
  warnings += 1;
  console.warn(`essays: WARNING - ${msg}`);
};

for (const w of writing) {
  const mdPath = here(`../src/essays/${w.slug}.md`);
  if (!existsSync(mdPath)) {
    warn(`src/essays/${w.slug}.md is missing (no text will show on /writing/${w.slug}, and no PDF can be generated)`);
    if (!existsSync(here(`../public${w.pdf.path}`))) warn(`public${w.pdf.path} is missing too (PDF for "${w.slug}")`);
    continue;
  }
  const counted = countEssayWords(readFileSync(mdPath, "utf8"));
  if (counted !== w.wordCount) warn(`"${w.slug}": writing.js says ${w.wordCount} words, the Markdown counts ${counted}`);
}

if (warnings === 0) console.log(`essays: all ${writing.length} entries have text and a matching word count`);
