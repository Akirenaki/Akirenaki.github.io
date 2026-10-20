// Pure filter logic for /writing, kept apart from the page so it can be tested
// without a browser. Mirrors the rules on /work: inside one facet the selected
// tags combine with OR, across facets they combine with AND, and an empty facet
// restricts nothing. "Character" is one facet made of two groups (fictional and
// real), so picking any character counts as picking that one facet.
import { FACETS, TAGS_BY_ID } from "../data/writing-taxonomy.js";
import { writing, tagIdsInFacet } from "../data/writing.js";

export const EMPTY_SELECTION = Object.fromEntries(FACETS.map((f) => [f.key, []]));

// URL -> selection. Unknown parameters, unknown ids and ids filed under a
// different facet are dropped, so a stale or hand-edited link degrades to "no
// filter" instead of an empty page. Repeated parameters: ?topic=a&topic=b
export function selectionFromParams(params) {
  return Object.fromEntries(
    FACETS.map((facet) => {
      const ids = params
        .getAll(facet.key)
        .filter((id, i, all) => TAGS_BY_ID.get(id)?.facet === facet.key && all.indexOf(id) === i);
      return [facet.key, ids];
    }),
  );
}

// Selection -> URL parameters, in facet order then tag order, so one set of
// choices always produces one URL.
export function paramsFromSelection(selection) {
  const params = new URLSearchParams();
  for (const facet of FACETS) {
    const chosen = selection[facet.key] ?? [];
    for (const tag of facet.groups.flatMap((g) => g.tags)) {
      if (chosen.includes(tag.id)) params.append(facet.key, tag.id);
    }
  }
  return params;
}

export const selectionCount = (selection) => FACETS.reduce((n, f) => n + (selection[f.key]?.length ?? 0), 0);

const matchesFacet = (entry, facet, selection) =>
  (selection[facet.key]?.length ?? 0) === 0 || tagIdsInFacet(entry, facet).some((id) => selection[facet.key].includes(id));

// skipKey leaves one facet out, which is how an option's count is worked out:
// "how many entries would this show if clicked, given the OTHER facets".
export const matches = (entry, selection, skipKey) =>
  FACETS.every((facet) => facet.key === skipKey || matchesFacet(entry, facet, selection));

export const countFor = (facet, tagId, selection) =>
  writing.filter((w) => matches(w, selection, facet.key) && tagIdsInFacet(w, facet).includes(tagId)).length;

// Only tags at least one entry uses are offered; empty groups and facets drop
// out, so the filter never lists something that can't match.
export function usedFilterTree() {
  const used = new Set(writing.flatMap((w) => FACETS.flatMap((f) => tagIdsInFacet(w, f))));
  return FACETS.map((facet) => ({
    ...facet,
    groups: facet.groups
      .map((group) => ({ ...group, tags: group.tags.filter((t) => used.has(t.id)) }))
      .filter((group) => group.tags.length > 0),
  })).filter((facet) => facet.groups.length > 0);
}
