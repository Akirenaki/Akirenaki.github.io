// Locks for Ripples of Past Reverie (data/past-reverie.js).
//
// A ripple may carry a `readFirst` field naming what the visitor must have
// done before it opens. Everything is referred to by id, never by its text:
//
//   readFirst: {
//     questions: ["ripple-02"],              // ripple ids or public question ids
//     essays:    ["gender-analysis-middle-way"], // slugs from data/writing.js
//     sites:     ["some-site"],              // keys of RIPPLE_SITES
//   }
//
// Every listed item must be done (AND). A ripple with no `readFirst`, or an
// empty one, is always open.
//
// "Done" means: a question was picked (its answer shown), an essay page was
// opened, or a site link was clicked. The last two are honour-system: the site
// can tell a page was visited, not that it was read, and cannot see another
// tab. Progress is a plain object of Sets, held in memory by
// HeimarmeneCompanion and never stored, so a reload starts again.
//
// Like the passphrase, this only decides what the interface shows. The ripples
// ship in the JavaScript bundle either way.
//
// Plain Node can import this file (the tests do), so it imports nothing.

const KINDS = ["question", "essay", "site"];
const FIELD = { question: "questions", essay: "essays", site: "sites" };
const FIELDS = Object.values(FIELD);

export function emptyProgress() {
  return { question: new Set(), essay: new Set(), site: new Set() };
}

// Returns the same object when nothing changes, so React can skip a re-render.
export function markRead(progress, kind, id) {
  if (!progress[kind] || progress[kind].has(id)) return progress;
  return { ...progress, [kind]: new Set(progress[kind]).add(id) };
}

// [{ kind, id }] in the order question, essay, site.
export function requirementsOf(ripple) {
  const readFirst = ripple?.readFirst ?? {};
  return KINDS.flatMap((kind) => (readFirst[FIELD[kind]] ?? []).map((id) => ({ kind, id })));
}

export function isRequirementDone(progress, { kind, id }) {
  return progress?.[kind]?.has(id) === true;
}

export function missingRequirements(ripple, progress) {
  return requirementsOf(ripple).filter((requirement) => !isRequirementDone(progress, requirement));
}

export function isRippleOpen(ripple, progress) {
  return missingRequirements(ripple, progress).length === 0;
}

// Checks the locks of a whole collection and returns a list of problems (empty
// when all is well). `essaySlugs` and `siteIds` are Sets. `publicQuestionIds`
// is optional: when given, a question requirement must be a ripple or one of
// those ids; when omitted, an id that is not a ripple is accepted unchecked
// (data/companion.js cannot be imported by plain Node, so the tests check it).
export function findLockProblems(ripples, { essaySlugs, siteIds, publicQuestionIds } = {}) {
  const problems = [];
  const rippleIds = new Set(ripples.map((ripple) => ripple.id));
  const edges = new Map(); // ripple id -> ripple ids it needs

  for (const ripple of ripples) {
    const where = `"${ripple.id}"`;
    const readFirst = ripple.readFirst;
    edges.set(ripple.id, []);
    if (readFirst === undefined) continue;
    if (readFirst === null || typeof readFirst !== "object" || Array.isArray(readFirst)) {
      problems.push(`${where}: readFirst must be an object`);
      continue;
    }
    for (const key of Object.keys(readFirst)) {
      if (!FIELDS.includes(key)) problems.push(`${where}: unknown readFirst field "${key}" (use ${FIELDS.join(", ")})`);
    }
    for (const kind of KINDS) {
      const list = readFirst[FIELD[kind]];
      if (list === undefined) continue;
      if (!Array.isArray(list)) {
        problems.push(`${where}: readFirst.${FIELD[kind]} must be an array`);
        continue;
      }
      if (new Set(list).size !== list.length) problems.push(`${where}: readFirst.${FIELD[kind]} has a duplicate`);
      for (const id of list) {
        if (typeof id !== "string" || id.length === 0) {
          problems.push(`${where}: readFirst.${FIELD[kind]} must hold non-empty strings`);
        } else if (kind === "question") {
          if (id === ripple.id) problems.push(`${where}: cannot require itself`);
          else if (rippleIds.has(id)) edges.get(ripple.id).push(id);
          else if (publicQuestionIds && !publicQuestionIds.has(id)) problems.push(`${where}: question "${id}" does not exist`);
        } else if (kind === "essay") {
          if (essaySlugs && !essaySlugs.has(id)) problems.push(`${where}: essay "${id}" is not in data/writing.js`);
        } else if (siteIds && !siteIds.has(id)) {
          problems.push(`${where}: site "${id}" is not in RIPPLE_SITES`);
        }
      }
    }
  }

  // A ripple that (indirectly) needs itself could never open.
  const state = new Map(); // id -> "visiting" | "done"
  const visit = (id, path) => {
    if (state.get(id) === "done") return;
    if (state.get(id) === "visiting") {
      problems.push(`locks form a cycle: ${[...path.slice(path.indexOf(id)), id].join(" -> ")}`);
      return;
    }
    state.set(id, "visiting");
    for (const next of edges.get(id) ?? []) visit(next, [...path, id]);
    state.set(id, "done");
  };
  for (const id of rippleIds) visit(id, []);

  return problems;
}

export function findSiteProblems(sites) {
  const problems = [];
  for (const [id, site] of Object.entries(sites)) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) problems.push(`site "${id}": id must be lower-case kebab-case`);
    if (typeof site?.label !== "string" || site.label.trim() === "") problems.push(`site "${id}": label is required`);
    if (!/^https:\/\/[^\s]+$/.test(site?.href ?? "")) problems.push(`site "${id}": href must be an https:// address`);
  }
  return problems;
}
