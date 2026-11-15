// GitHub Pages serves a file called 404.html, from the site root, for any
// address that matches no file. React Router prerenders the catch-all route at
// /404 (see react-router.config.js), which lands in build/client/404/index.html;
// this copies it to build/client/404.html.
//
// Runs after `react-router build` (see "build" in package.json). The page's
// asset links are absolute (base "/"), so the copy works from any address.
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const from = fileURLToPath(new URL("../build/client/404/index.html", import.meta.url));
const to = fileURLToPath(new URL("../build/client/404.html", import.meta.url));

if (!existsSync(from)) {
  console.error("404: build/client/404/index.html is missing. Did the prerender list lose \"/404\"?");
  process.exit(1);
}
copyFileSync(from, to);
console.log("404: wrote build/client/404.html");
