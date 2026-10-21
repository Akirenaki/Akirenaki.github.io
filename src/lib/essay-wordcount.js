// Word count for an essay's Markdown source, by the rule documented in
// src/data/writing.js: the body of the piece, headings included; the title
// (the leading H1), the reference list and any URLs excluded; whitespace-
// separated tokens containing a letter or a digit.
//
// Plain JavaScript with no imports, so Node scripts (scripts/check-essays.mjs)
// and the browser build can both load it.

// The reference list starts at the first heading with one of these names.
// "Saran" is the reading list at the end of the Indonesian response.
const REFERENCES_HEADING = /^#{1,6}[ \t]*\**[ \t]*(?:[IVXL]+\.[ \t]*)?(?:References?(?: list)?|Daftar (?:pustaka|referensi)|Saran)\b/im;

export function countEssayWords(markdown) {
  let text = markdown.replace(/^\uFEFF/, "");
  text = text.replace(/^\s*#[ \t].*\n/, ""); // leading H1 = title
  const cut = text.search(REFERENCES_HEADING);
  if (cut >= 0) text = text.slice(0, cut);
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // links keep their text, lose their URL
    .replace(/[\\*_#>`]/g, " ")
    .split(/\s+/)
    .filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}
