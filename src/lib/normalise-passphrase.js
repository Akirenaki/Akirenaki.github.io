// Passphrase normalisation for Ripples of Past Reverie.
//
// The same function runs in the browser (verifyPasscode in
// past-reverie-access.js) and in the terminal (scripts/past-reverie-setup.mjs),
// so that a passphrase shared through messaging apps, phone keyboards or a
// paste still opens the section despite formatting accidents. Only the result
// is ever hashed. It is lossy by design and is never displayed.
//
// Version 1:
//   1. NFKC: unifies composed and decomposed characters and folds
//      compatibility forms (non-breaking spaces, full-width letters, "…").
//   2. Upper case with toUpperCase(), never toLocaleUpperCase(), whose result
//      depends on the visitor's browser locale (Turkish "i" is the classic case).
//   3. Keep only letters and digits. This drops every space, tab, newline,
//      punctuation mark, symbol and invisible character (zero-width space,
//      byte-order mark, soft hyphen, bidi marks), so no separate steps are needed.
//
//   "The lantern outlasts the storm, doesn’t it?"  ->  "THELANTERNOUTLASTSTHESTORMDOESNTIT"
//
// Accents are kept ("CAFÉ" and "CAFE" differ). Changing any rule changes which
// strings produce a given verifier, so bump NORMALISATION_VERSION and
// regenerate the salt and verifier when you do.

export const NORMALISATION_VERSION = 1;

export function normalisePassphrase(input) {
  if (typeof input !== "string") return "";
  return input.normalize("NFKC").toUpperCase().replace(/[^\p{L}\p{N}]+/gu, "");
}
