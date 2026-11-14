// Run with `npm test`. The passphrase here is random per run and exists only in
// memory, so no credential is ever committed.
import assert from "node:assert/strict";
import { pbkdf2Sync, randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { PAST_REVERIE, RIPPLES_BY_ID } from "../data/past-reverie.js";
import { MAX_PASSPHRASE_LENGTH, isAccessConfigured, verifyPasscode } from "./past-reverie-access.js";

const passphrase = `${randomUUID()} ${randomUUID()}`;
const salt = randomBytes(16);
const access = {
  algorithm: "PBKDF2",
  hash: "SHA-256",
  iterations: 1000, // low only so the test is fast; the shipped value is checked below
  salt: salt.toString("base64"),
  verifier: pbkdf2Sync(passphrase, salt, 1000, 32, "sha256").toString("base64"),
};

describe("verifyPasscode", () => {
  it("accepts the right passphrase", async () => {
    assert.equal(await verifyPasscode(passphrase, access), true);
  });

  it("is case-sensitive and does not trim", async () => {
    assert.equal(await verifyPasscode(passphrase.toUpperCase(), access), false);
    assert.equal(await verifyPasscode(` ${passphrase}`, access), false);
    assert.equal(await verifyPasscode(`${passphrase} `, access), false);
  });

  it("rejects wrong, empty and over-long input", async () => {
    assert.equal(await verifyPasscode("wrong", access), false);
    assert.equal(await verifyPasscode("", access), false);
    assert.equal(await verifyPasscode("a".repeat(MAX_PASSPHRASE_LENGTH + 1), access), false);
  });

  it("reports missing Web Crypto", async () => {
    await assert.rejects(verifyPasscode(passphrase, access, null), { code: "unsupported" });
  });

  it("reports placeholder configuration", async () => {
    assert.equal(isAccessConfigured(PAST_REVERIE.access), false);
    await assert.rejects(verifyPasscode(passphrase, PAST_REVERIE.access), { code: "unconfigured" });
    assert.equal(isAccessConfigured(access), true);
  });
});

describe("past-reverie data", () => {
  it("keeps the agreed work factor and algorithm", () => {
    assert.equal(PAST_REVERIE.access.algorithm, "PBKDF2");
    assert.equal(PAST_REVERIE.access.hash, "SHA-256");
    assert.ok(PAST_REVERIE.access.iterations >= 600000);
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
