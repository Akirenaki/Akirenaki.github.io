// Run with `npm test`. Covers the lock logic in lib/past-reverie-locks.js and
// checks that every lock in data/past-reverie.js points at something real.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { PAST_REVERIE, RIPPLE_SITES } from "../data/past-reverie.js";
import { writing } from "../data/writing.js";
import {
  emptyProgress,
  findLockProblems,
  findSiteProblems,
  isRippleOpen,
  markRead,
  missingRequirements,
  requirementsOf,
} from "./past-reverie-locks.js";

const locked = {
  id: "ripple-x",
  readFirst: { questions: ["ripple-a"], essays: ["some-essay"], sites: ["some-site"] },
};

describe("lock logic", () => {
  it("opens a ripple with no lock, or an empty one", () => {
    assert.equal(isRippleOpen({ id: "a" }, emptyProgress()), true);
    assert.equal(isRippleOpen({ id: "a", readFirst: {} }, emptyProgress()), true);
    assert.equal(isRippleOpen({ id: "a", readFirst: { questions: [], essays: [], sites: [] } }, emptyProgress()), true);
  });

  it("lists requirements in the order question, essay, site", () => {
    assert.deepEqual(requirementsOf(locked), [
      { kind: "question", id: "ripple-a" },
      { kind: "essay", id: "some-essay" },
      { kind: "site", id: "some-site" },
    ]);
  });

  it("needs every requirement, and only opens once all are done", () => {
    let progress = emptyProgress();
    assert.equal(isRippleOpen(locked, progress), false);
    progress = markRead(progress, "question", "ripple-a");
    progress = markRead(progress, "essay", "some-essay");
    assert.equal(isRippleOpen(locked, progress), false);
    assert.deepEqual(missingRequirements(locked, progress), [{ kind: "site", id: "some-site" }]);
    progress = markRead(progress, "site", "some-site");
    assert.equal(isRippleOpen(locked, progress), true);
  });

  it("keeps kinds apart: an essay slug never satisfies a question id", () => {
    const progress = markRead(emptyProgress(), "essay", "ripple-a");
    assert.equal(isRippleOpen({ id: "b", readFirst: { questions: ["ripple-a"] } }, progress), false);
  });

  it("markRead leaves progress untouched when nothing changes, and never mutates", () => {
    const before = emptyProgress();
    const after = markRead(before, "essay", "some-essay");
    assert.equal(before.essay.size, 0);
    assert.equal(after.essay.has("some-essay"), true);
    assert.equal(markRead(after, "essay", "some-essay"), after);
    assert.equal(markRead(after, "bogus", "x"), after);
  });
});

describe("findLockProblems", () => {
  const ok = { essaySlugs: new Set(["some-essay"]), siteIds: new Set(["some-site"]) };
  const ripples = (...list) => list;

  it("accepts a valid lock", () => {
    assert.deepEqual(findLockProblems(ripples({ id: "ripple-a" }, locked), ok), []);
  });

  it("rejects unknown essays, sites and field names", () => {
    const problems = findLockProblems(
      ripples({ id: "r", readFirst: { essays: ["nope"], sites: ["nope"], essay: ["typo"] } }),
      ok,
    );
    assert.equal(problems.length, 3);
  });

  it("rejects self-reference, duplicates and non-arrays", () => {
    assert.equal(findLockProblems(ripples({ id: "r", readFirst: { questions: ["r"] } }), ok).length, 1);
    assert.equal(findLockProblems(ripples({ id: "r", readFirst: { essays: ["some-essay", "some-essay"] } }), ok).length, 1);
    assert.equal(findLockProblems(ripples({ id: "r", readFirst: { essays: "some-essay" } }), ok).length, 1);
  });

  it("rejects cycles between ripples", () => {
    const problems = findLockProblems(
      ripples({ id: "a", readFirst: { questions: ["b"] } }, { id: "b", readFirst: { questions: ["a"] } }),
      ok,
    );
    assert.equal(problems.length > 0, true);
    assert.match(problems.join(" "), /cycle/);
  });

  it("checks non-ripple question ids only when public ids are supplied", () => {
    const list = ripples({ id: "r", readFirst: { questions: ["about-focus"] } });
    assert.deepEqual(findLockProblems(list, ok), []);
    assert.equal(findLockProblems(list, { ...ok, publicQuestionIds: new Set(["about-study"]) }).length, 1);
    assert.deepEqual(findLockProblems(list, { ...ok, publicQuestionIds: new Set(["about-focus"]) }), []);
  });
});

describe("findSiteProblems", () => {
  it("accepts https sites and rejects the rest", () => {
    assert.deepEqual(findSiteProblems({ "some-site": { label: "Some site", href: "https://example.org/a" } }), []);
    assert.equal(findSiteProblems({ "some-site": { label: "Some site", href: "http://example.org" } }).length, 1);
    assert.equal(findSiteProblems({ "Bad Id": { label: "", href: "https://example.org" } }).length, 2);
  });
});

describe("past-reverie locks in the real data", () => {
  it("points every lock at a ripple, public question, essay or site that exists", () => {
    const publicSource = readFileSync(new URL("../data/companion.js", import.meta.url), "utf8");
    const publicIds = new Set([...publicSource.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]));
    const problems = findLockProblems(PAST_REVERIE.ripples, {
      essaySlugs: new Set(writing.map((w) => w.slug)),
      siteIds: new Set(Object.keys(RIPPLE_SITES)),
      publicQuestionIds: publicIds,
    });
    assert.deepEqual(problems, []);
  });

  it("can open every ripple once everything it asks for is done", () => {
    let progress = emptyProgress();
    for (const ripple of PAST_REVERIE.ripples) {
      for (const { kind, id } of requirementsOf(ripple)) progress = markRead(progress, kind, id);
    }
    for (const ripple of PAST_REVERIE.ripples) assert.equal(isRippleOpen(ripple, progress), true);
  });
});
