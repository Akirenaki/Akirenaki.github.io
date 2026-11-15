// Run with `npm test`. Every phrase here is a made-up decoy, never a real passphrase.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NORMALISATION_VERSION, normalisePassphrase } from "./normalise-passphrase.js";

const DECOY = "The lantern outlasts the storm, doesn't it?";
const DECOY_NORMALISED = "THELANTERNOUTLASTSTHESTORMDOESNTIT";

describe("normalisePassphrase", () => {
  it("is on version 1", () => {
    assert.equal(NORMALISATION_VERSION, 1);
  });

  it("keeps only upper-case letters and digits", () => {
    assert.equal(normalisePassphrase(DECOY), DECOY_NORMALISED);
    assert.equal(normalisePassphrase("I remember you're pacifist"), "IREMEMBERYOUREPACIFIST");
  });

  it("maps every formatting accident to the same result", () => {
    const variants = [
      "the lantern outlasts the storm, doesn\u2019t it?", // curly apostrophe
      "The  lantern outlasts\tthe storm,doesn't it?\n", // double space, tab, missing space, newline
      "The\u00a0lantern\u00a0outlasts the storm, doesn't it?", // non-breaking spaces
      "The\u3000lantern outlasts the storm, doesn't it?", // ideographic space
      "THE LANTERN OUTLASTS THE STORM DOESNT IT", // all caps, no punctuation
      "The lantern\u200b outlasts the storm, doesn't it?", // zero-width space
      "\ufeffThe lantern outlasts the storm, doesn't it?", // byte-order mark
      "The lan\u00adtern outlasts the storm, doesn't it?", // soft hyphen
      "\u201cThe lantern outlasts the storm\u2026 doesn\u2019t it?\u201d", // curly quotes, ellipsis
      "\uff34he lantern outlasts the storm, doesn't it?", // full-width T
      "The lantern outlasts the storm \u2014 doesn't it", // em dash
    ];
    for (const variant of variants) {
      assert.equal(normalisePassphrase(variant), DECOY_NORMALISED, JSON.stringify(variant));
    }
  });

  it("does not turn a different word into the same result", () => {
    assert.notEqual(normalisePassphrase("The lantern outlasts the storms, doesn't it?"), DECOY_NORMALISED);
    assert.notEqual(normalisePassphrase("The lantern outlasts the storm, does it?"), DECOY_NORMALISED);
  });

  it("unifies composed and decomposed accents but does not fold them", () => {
    assert.equal(normalisePassphrase("caf\u00e9"), normalisePassphrase("cafe\u0301"));
    assert.equal(normalisePassphrase("caf\u00e9"), "CAF\u00c9");
    assert.notEqual(normalisePassphrase("caf\u00e9"), normalisePassphrase("cafe"));
  });

  it("folds compatibility digits and ligatures", () => {
    assert.equal(normalisePassphrase("Ketik 2\u00b2 \u2460"), "KETIK221");
    assert.equal(normalisePassphrase("\ufb01nal"), "FINAL");
  });

  it("does not depend on the locale", () => {
    assert.equal(normalisePassphrase("title"), "TITLE");
  });

  it("returns an empty string when nothing is left, or for non-strings", () => {
    assert.equal(normalisePassphrase(""), "");
    assert.equal(normalisePassphrase("!!! ... \u200b \n"), "");
    assert.equal(normalisePassphrase("\u{1F319}"), "");
    assert.equal(normalisePassphrase(undefined), "");
    assert.equal(normalisePassphrase(null), "");
    assert.equal(normalisePassphrase(42), "");
  });

  it("is idempotent", () => {
    for (const input of [DECOY, "caf\u00e9 na\u00efve", "a1 b2 c3", ""]) {
      const once = normalisePassphrase(input);
      assert.equal(normalisePassphrase(once), once);
    }
  });
});
