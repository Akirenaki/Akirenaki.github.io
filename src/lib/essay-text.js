// Turns src/essays/<slug>.md into HTML for the entry page, at build time.
//
// Each essay is a Markdown file exported from its Google Doc (File > Download >
// Markdown) and saved under the entry's slug. The site never edits the words;
// it only tidies the export's markup:
//   - the leading H1 is dropped, because the page already shows the title;
//   - headings lose the redundant **bold** the export wraps them in;
//   - links to other sites open in a new tab;
//   - runs of Arabic are wrapped in <span lang="ar" dir="rtl"> so they get a
//     right-to-left run, an Arabic font and no synthetic italics.
//
// This module uses import.meta.glob, so it is for the Vite build only (the
// entry page). Node scripts must not import it; they use essay-wordcount.js.
import { Marked } from "marked";

const sources = import.meta.glob("../essays/*.md", { query: "?raw", import: "default", eager: true });

const bySlug = new Map(
  Object.entries(sources).map(([path, raw]) => [path.match(/([^/]+)\.md$/)[1], raw]),
);

const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const marked = new Marked({
  gfm: true,
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const attrs = title ? ` title="${escapeAttr(title)}"` : "";
      const external = /^https?:\/\//i.test(href);
      return `<a href="${escapeAttr(href)}"${attrs}${external ? ' target="_blank" rel="noreferrer"' : ""}>${text}</a>`;
    },
  },
});

const ARABIC = "\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF";
const ARABIC_RUN = new RegExp(`[${ARABIC}]+(?:[ \\t]+[${ARABIC}]+)*`, "g");

// Only text between tags is touched, never attributes.
function wrapArabic(html) {
  return html
    .split(/(<[^>]*>)/)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(ARABIC_RUN, (run) => `<span lang="ar" dir="rtl">${run}</span>`)))
    .join("");
}

function tidyMarkdown(raw) {
  return raw
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .replace(/^\s*#[ \t].*\n/, "") // title: the page renders it from writing.js
    .replace(/^(#{1,6})[ \t]+\*\*(.+?)\*\*[ \t]*$/gm, "$1 $2"); // "## **Heading**" -> "## Heading"
}

const cache = new Map();

// HTML for an entry's text, or null when no src/essays/<slug>.md exists.
export function essayHtml(slug) {
  if (!bySlug.has(slug)) return null;
  if (!cache.has(slug)) cache.set(slug, wrapArabic(marked.parse(tidyMarkdown(bySlug.get(slug)))));
  return cache.get(slug);
}
