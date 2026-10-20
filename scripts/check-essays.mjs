// Warns (never fails) when an entry in src/data/writing.js points at a PDF that
// isn't in public/essays/ yet. The entry's Open/Download buttons and the embed
// would 404 on the live site, and nothing else in the build would notice.
// Runs as part of `npm run build` (see "prebuild" in package.json).
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { writing } from "../src/data/writing.js";

const missing = writing.filter((w) => !existsSync(fileURLToPath(new URL(`../public${w.pdf.path}`, import.meta.url))));

if (missing.length === 0) {
  console.log(`essays: all ${writing.length} PDFs present`);
} else {
  console.warn(`essays: WARNING - ${missing.length} of ${writing.length} PDFs missing from public/essays/:`);
  for (const w of missing) console.warn(`  public${w.pdf.path}`);
}
