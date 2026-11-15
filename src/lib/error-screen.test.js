import { test } from "node:test";
import assert from "node:assert/strict";
import { ERROR_SCREEN, fillFlavour, pickFragment } from "../data/error-screen.js";

test("fillFlavour puts the requested address into the line", () => {
  assert.equal(fillFlavour("Lost at {path} today.", "/nope"), "Lost at /nope today.");
});

test("fillFlavour drops the token cleanly when there is no address", () => {
  assert.equal(fillFlavour("Whatever lived at {path} is gone.", ""), "Whatever lived at is gone.");
  assert.equal(fillFlavour("Nothing here.", ""), "Nothing here.");
});

test("pickFragment never repeats the current line when it can avoid it", () => {
  for (let current = 0; current < 4; current += 1) {
    for (const roll of [0, 0.24, 0.26, 0.5, 0.74, 0.99]) {
      assert.notEqual(pickFragment(4, current, () => roll), current);
    }
  }
});

test("pickFragment copes with one line or none", () => {
  assert.equal(pickFragment(1, 0), 0);
  assert.equal(pickFragment(0, -1), 0);
});

test("every screen has the fields the component reads, and at least one flavour line", () => {
  for (const key of ["notFound", "error"]) {
    const screen = ERROR_SCREEN[key];
    for (const field of ["code", "heading", "body"]) {
      assert.ok(screen[field]?.trim(), `${key}.${field} is empty`);
    }
    assert.ok(screen.cta?.label?.trim(), `${key}.cta.label is empty`);
    assert.ok(screen.flavour.length >= 1, `${key}.flavour needs at least one line`);
    for (const line of screen.flavour) assert.ok(line.trim(), `${key} has an empty flavour line`);
  }
  assert.ok(ERROR_SCREEN.notFound.cta.to, "notFound.cta.to is missing");
  assert.ok(ERROR_SCREEN.anotherLabel.trim());
});
