import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "../data/projects.js";
import { awards, certifications, testScores } from "../data/awards.js";
import { profile } from "../data/profile.js";
import {
  cvProjects,
  cvAwards,
  cvCertification,
  cvEducation,
  cvTestScores,
  formatCvDate,
} from "../data/cv.js";

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

test("CV project links include every available link from each project record", () => {
  for (const entry of cvProjects) {
    const project = projects.find((candidate) => candidate.slug === entry.slug);
    assert.deepEqual(
      entry.links.map(({ key, url }) => [key, url]),
      Object.entries(project.links).filter(([, url]) => url),
    );
  }
});

test("CV lists every award not opted out with cv: false, newest first", () => {
  const included = awards.filter((a) => a.cv !== false);
  assert.equal(cvAwards.length, included.length);
  const year = (a) => Number(a.date.match(/\d{4}/)[0]);
  const years = cvAwards.map(year);
  assert.deepEqual(years, [...years].sort((a, b) => b - a));
});

test("CV certification is selected by the single certification marked onCV", () => {
  assert.ok(certifications.every((certification) => typeof certification.onCV === "boolean"));
  const selected = certifications.filter((certification) => certification.onCV);
  assert.equal(selected.length, 1);
  assert.strictEqual(cvCertification, selected[0]);
  assert.equal(cvCertification.title, "AI Agent for Data Analysis");
});

test("CV education is sourced from profile education records", () => {
  assert.deepEqual(
    cvEducation,
    profile.education.map(({ institution, degree, dateLabel }) => ({
      institution,
      detail: degree,
      date: dateLabel,
    })),
  );
});

test("CV test scores include every score and derive the displayed values from awards data", () => {
  assert.deepEqual(
    cvTestScores,
    testScores.map((test) => ({
      name: test.name,
      score: `${test.value.toFixed(test.decimals)}/${test.max.toFixed(test.decimals)}`,
      date: formatCvDate(test.date),
    })),
  );
});
