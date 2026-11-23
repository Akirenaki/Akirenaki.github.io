import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "../data/projects.js";
import { awards } from "../data/awards.js";
import { cvProjects, cvAwards } from "../data/cv.js";

test("CV lists every flagship and standard project, and no mini project", () => {
  const expected = projects.filter((p) => p.scale !== "mini").map((p) => p.slug).sort();
  assert.deepEqual(cvProjects.map((p) => p.slug).sort(), expected);
  for (const entry of cvProjects) {
    const project = projects.find((p) => p.slug === entry.slug);
    assert.notEqual(project.scale, "mini", `${entry.slug} is a mini project`);
    assert.ok(entry.bullets.length > 0, `${entry.slug} has no bullets`);
  }
});

test("CV prints flagship projects before standard ones", () => {
  const scales = cvProjects.map((e) => projects.find((p) => p.slug === e.slug).scale);
  assert.deepEqual(scales, [...scales].sort((a, b) => (a === "flagship" ? 0 : 1) - (b === "flagship" ? 0 : 1)));
});

test("CV lists every award not opted out with cv: false, newest first", () => {
  const included = awards.filter((a) => a.cv !== false);
  assert.equal(cvAwards.length, included.length);
  const year = (a) => Number(a.date.match(/\d{4}/)[0]);
  const years = cvAwards.map(year);
  assert.deepEqual(years, [...years].sort((a, b) => b - a));
});
