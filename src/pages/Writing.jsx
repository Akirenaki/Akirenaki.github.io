import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { SECTIONS, writing, entriesInSection } from "../data/writing";
import { WritingCard } from "../components/WritingCard";
import { TagLabel } from "../components/TagLabel";
import {
  EMPTY_SELECTION,
  countFor,
  matches,
  paramsFromSelection,
  selectionCount,
  selectionFromParams,
  usedFilterTree,
} from "../lib/writing-filter";
import { buildMeta } from "../lib/seo";

export function meta() {
  return buildMeta({
    title: "Writing",
    description:
      "Essays by Renee Astraea on philosophy of mind, Madhyamaka, evidence and science, and literature. Each piece has a summary and the full text as a PDF.",
    path: "/writing",
  });
}

// Built once from the data: which tags are in use, grouped by facet.
const TREE = usedFilterTree();

export function Writing() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The prerendered HTML is the unfiltered list. If the first client render
  // already applied ?topic=... the two would disagree, so the URL is read only
  // after hydration; until then everything shows.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const selected = useMemo(() => (hydrated ? selectionFromParams(params) : EMPTY_SELECTION), [hydrated, params]);

  const activeCount = selectionCount(selected);
  const visible = writing.filter((w) => matches(w, selected));
  const visibleSlugs = new Set(visible.map((w) => w.slug));

  // The URL is the state. replace keeps the Back button from stepping through
  // every click; preventScrollReset keeps the page where it is.
  const commit = (next) => setParams(paramsFromSelection(next), { replace: true, preventScrollReset: true });
  const toggle = (facetKey, id) => {
    const current = selected[facetKey];
    commit({ ...selected, [facetKey]: current.includes(id) ? current.filter((x) => x !== id) : [...current, id] });
  };

  const renderChips = (facet, group) =>
    group.tags.map((tag) => {
      const active = selected[facet.key].includes(tag.id);
      const count = countFor(facet, tag.id, selected);
      const disabled = count === 0 && !active;
      return (
        <button
          key={tag.id}
          type="button"
          onClick={() => toggle(facet.key, tag.id)}
          disabled={disabled}
          aria-pressed={active}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            active
              ? "border-accent-deep bg-accent-deep text-paper"
              : disabled
                ? "cursor-not-allowed border-blush/50 text-ink-soft/40"
                : "border-blush text-ink-soft hover:border-accent-deep hover:text-accent-deep"
          }`}
        >
          <TagLabel tag={tag} /> <span className="text-xs opacity-70">{count}</span>
        </button>
      );
    });

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-medium text-ink">Writing</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Essays on evidence, minds and meaning. Each entry gives the argument in brief; open it for the full text as a
          PDF.
        </p>

        {TREE.length > 0 && (
          <div className="mt-8 border-y border-blush/70 py-5" role="group" aria-label="Filter writing">
            {/* Below md the filters fold behind this button; from md up the button
                is hidden and the panel is always shown. */}
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              aria-controls="writing-filters"
              className="flex items-center gap-2 text-sm text-accent-deep hover:underline md:hidden"
            >
              <span aria-hidden="true" className={`transition-transform ${filtersOpen ? "rotate-90" : ""}`}>
                ›
              </span>
              Filter by subject, topic or character
              {activeCount > 0 && (
                <span className="rounded-full bg-accent-deep px-2 py-0.5 text-xs text-paper">{activeCount}</span>
              )}
            </button>

            <div
              id="writing-filters"
              className={`${filtersOpen ? "mt-4 flex" : "hidden"} flex-col gap-3 md:mt-0 md:flex`}
            >
              {TREE.map((facet) => {
                const nested = facet.groups.length > 1;
                return (
                  <fieldset key={facet.key} className="grid gap-2 md:grid-cols-[6rem_1fr] md:items-baseline">
                    <legend className="contents">
                      <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">{facet.label}</span>
                    </legend>
                    <div className="flex flex-col gap-3">
                      {facet.groups.map((group) => (
                        <div
                          key={group.key}
                          role={nested ? "group" : undefined}
                          aria-label={nested ? `${facet.label}: ${group.label}` : undefined}
                          className="flex flex-wrap items-center gap-2"
                        >
                          {nested && <span className="w-full text-xs text-ink-soft md:w-16">{group.label}</span>}
                          {renderChips(facet, group)}
                        </div>
                      ))}
                    </div>
                  </fieldset>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-ink-soft">
              <p role="status" aria-live="polite">
                Showing {visible.length} of {writing.length} {writing.length === 1 ? "piece" : "pieces"}
              </p>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => commit(EMPTY_SELECTION)}
                  className="text-accent-deep underline-offset-2 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-12">
          {Object.entries(SECTIONS).map(([key, section]) => {
            const all = entriesInSection(key);
            // A section with no entries is not rendered; neither is one with no
            // matches while a filter is active.
            const shown = all.filter((w) => visibleSlugs.has(w.slug));
            if (all.length === 0 || shown.length === 0) return null;
            return (
              <section key={key} aria-labelledby={`section-${key}`}>
                <h2
                  id={`section-${key}`}
                  className="mb-2 font-body text-[13px] font-medium uppercase tracking-[0.08em] text-ink-soft"
                >
                  {section.label}
                </h2>
                <div className="border-b border-blush">
                  {shown.map((entry) => (
                    <WritingCard key={entry.slug} entry={entry} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="mt-10 text-ink-soft">No piece matches that combination. Clear a filter to see more.</p>
        )}
      </div>
    </section>
  );
}

export default Writing;
