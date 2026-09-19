// Writes public/sitemap.xml from the same sources the prerenderer uses, so a
// new project in src/data/projects.js shows up in the sitemap automatically
// and the hand-maintained list can't drift out of date. Runs as part of
// `npm run build` (see "prebuild" in package.json).
//
// Deliberately <loc> only: Google ignores <changefreq> and <priority>, and it
// only trusts <lastmod> when it's accurate per page, which a blanket build
// date wouldn't be. /print is left out on purpose (it's noindex).
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { projects } from "../src/data/projects.js";
import { pageUrl } from "../src/lib/seo.js";

const paths = ["/", "/work", "/about", "/contact", ...projects.map((p) => `/work/${p.slug}`)];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${pageUrl(p)}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync(fileURLToPath(new URL("../public/sitemap.xml", import.meta.url)), xml);
console.log(`sitemap: wrote ${paths.length} URLs`);
