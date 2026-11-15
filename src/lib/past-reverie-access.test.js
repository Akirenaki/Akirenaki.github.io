// Run with `npm test`. The passphrase here is a made-up decoy that exists only
// in this file, so no real credential is ever committed.
import assert from "node:assert/strict";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { PAST_REVERIE, RIPPLES_BY_ID } from "../data/past-reverie.js";
import { NORMALISATION_VERSION, normalisePassphrase } from "./normalise-passphrase.js";
import {
  MAX_PASSPHRASE_LENGTH,
  MAX_RAW_INPUT_LENGTH,
  isAccessConfigured,
  verifyPasscode,
} from "./past-reverie-access.js";

const passphrase = "The lantern outlasts the storm, doesn't it?";
const salt = randomBytes(16);
const access = {
  algorithm: "PBKDF2",
  hash: "SHA-256",
  iterations: 1000, // low only so the test is fast; the shipped value is checked below
  salt: salt.toString("base64"),
  // Derived the way scripts/past-reverie-setup.mjs does: from the normalised form.
  verifier: pbkdf2Sync(normalisePassphrase(passphrase), salt, 1000, 32, "sha256").toString("base64"),
  normalisation: NORMALISATION_VERSION,
};
const placeholder = { ...access, salt: "REPLACE_ME", verifier: "REPLACE_ME" };

describe("verifyPasscode", () => {
  it("accepts the right passphrase", async () => {
    assert.equal(await verifyPasscode(passphrase, access), true);
  });

  it("ignores case, spacing, punctuation and invisible characters", async () => {
    const messy = [
      "the lantern outlasts the storm, doesn\u2019t it?",
      "THE LANTERN OUTLASTS THE STORM DOESNT IT",
      "  The  lantern outlasts\tthe storm,doesn't it?\n",
      "The\u00a0lantern\u00a0outlasts the storm, doesn't it?",
      "The lantern\u200b outlasts the storm, doesn't it?",
      "\ufeff\u201cThe lantern outlasts the storm\u2026 doesn\u2019t it?\u201d",
    ];
    for (const attempt of messy) {
      assert.equal(await verifyPasscode(attempt, access), true, JSON.stringify(attempt));
    }
  });

  it("still rejects a different word", async () => {
    assert.equal(await verifyPasscode("The lantern outlasts the storms, doesn't it?", access), false);
    assert.equal(await verifyPasscode("wrong", access), false);
  });

  it("rejects empty, punctuation-only and over-long input", async () => {
    assert.equal(await verifyPasscode("", access), false);
    assert.equal(await verifyPasscode("!!! ... \u200b", access), false);
    assert.equal(await verifyPasscode("a".repeat(MAX_PASSPHRASE_LENGTH + 1), access), false);
    assert.equal(await verifyPasscode(`${passphrase}${" ".repeat(MAX_RAW_INPUT_LENGTH)}`, access), false);
  });

  it("reports missing Web Crypto", async () => {
    await assert.rejects(verifyPasscode(passphrase, access, null), { code: "unsupported" });
  });

  it("reports placeholder configuration and unknown normalisation versions", async () => {
    assert.equal(isAccessConfigured(placeholder), false);
    await assert.rejects(verifyPasscode(passphrase, placeholder), { code: "unconfigured" });
    assert.equal(isAccessConfigured({ ...access, normalisation: NORMALISATION_VERSION + 1 }), false);
    assert.equal(isAccessConfigured({ ...access, normalisation: undefined }), false);
    assert.equal(isAccessConfigured(access), true);
  });
});

describe("past-reverie data", () => {
  it("keeps the agreed work factor, algorithm and normalisation version", () => {
    assert.equal(PAST_REVERIE.access.algorithm, "PBKDF2");
    assert.equal(PAST_REVERIE.access.hash, "SHA-256");
    assert.ok(PAST_REVERIE.access.iterations >= 600000);
    assert.equal(PAST_REVERIE.access.normalisation, NORMALISATION_VERSION);
  });

  it("has unique kebab-case ids that never collide with the public questions", () => {
    const publicSource = readFileSync(new URL("../data/companion.js", import.meta.url), "utf8");
    const publicIds = new Set([...publicSource.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]));
    const ids = PAST_REVERIE.ripples.map((r) => r.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(RIPPLES_BY_ID.size, ids.length);
    for (const id of ids) {
      assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/);
      assert.equal(publicIds.has(id), false, `${id} collides with a public question`);
    }
  });

  it("keeps ripples independent and in the { text, links } answer shape", () => {
    for (const ripple of PAST_REVERIE.ripples) {
      assert.equal("related" in ripple, false);
      const answer = ripple.answer();
      assert.equal(typeof answer.text, "string");
      assert.ok(Array.isArray(answer.links));
    }
  });
});
