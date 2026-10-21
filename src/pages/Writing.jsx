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
import { FACETS, TAGS_BY_ID } from "../data/writing-taxonomy";
import { buildMeta } from "../lib/seo";

export function meta() {
  return buildMeta({
    title: "Writing",
    description:
      "Essays by Renee Astraea on philosophy of mind, Madhyamaka, evidence and science, and literature. Each piece has a summary and the full text on the page, with a PDF to download.",
    path: "/writing",
  });
}

// Built once from the data: which tags are in use, grouped by facet.
const TREE = usedFilterTree();

function FilterIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

function CloseIcon({ className = "h-3 w-3" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function Writing() {
  const [params, setParams] = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);

  // The prerendered HTML is the unfiltered list. If the first client render
  // already applied ?topic=... the two would disagree, so the URL is read only
  // after hydration; until then everything shows.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    if (params.has("topic") || params.has("character")) {
      setPanelOpen(true);
    }
  }, [params]);
  const selected = useMemo(() => (hydrated ? selectionFromParams(params) : EMPTY_SELECTION), [hydrated, params]);

  const activeCount = selectionCount(selected);
  const secondaryActiveCount = (selected.topic?.length ?? 0) + (selected.character?.length ?? 0);
  const visible = writing.filter((w) => matches(w, selected));
  const visibleSlugs = new Set(visible.map((w) => w.slug));

  // The URL is the state. replace keeps the Back button from stepping through
  // every click; preventScrollReset keeps the page where it is.
  const commit = (next) => setParams(paramsFromSelection(next), { replace: true, preventScrollReset: true });
  const toggle = (facetKey, id) => {
    const current = selected[facetKey] ?? [];
    commit({ ...selected, [facetKey]: current.includes(id) ? current.filter((x) => x !== id) : [...current, id] });
  };

  const subjectFacet = TREE.find((f) => f.key === "subject");
  const secondaryFacets = TREE.filter((f) => f.key !== "subject");

  const allSubjectCount = writing.filter((w) => matches(w, selected, "subject")).length;

  const activeItems = FACETS.flatMap((facet) =>
    (selected[facet.key] ?? []).map((id) => {
      const tag = TAGS_BY_ID.get(id);
      return {
        facetKey: facet.key,
        facetLabel: facet.label,
        id,
        label: tag?.label || id,
      };
    }),
  );

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-medium text-ink">Writing</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Essays on evidence, minds and meaning. Each entry gives the argument in brief; open it for the full text.
        </p>

        {TREE.length > 0 && (
          <div className="mt-8 border-y border-blush/70 py-4" role="group" aria-label="Filter writing">
            {/* Toolbar: Primary Subject filter + Secondary toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Primary Subject Filter */}
              {subjectFacet && (
                <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by subject">
                  <span className="mr-1 text-xs font-medium uppercase tracking-wide text-ink-soft">Subject:</span>
                  <button
                    type="button"
                    onClick={() => commit({ ...selected, subject: [] })}
                    aria-pressed={selected.subject.length === 0}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selected.subject.length === 0
                        ? "bg-accent-deep text-paper shadow-xs"
                        : "border border-blush/70 bg-surface/80 text-ink-soft hover:border-accent-deep hover:text-accent-deep"
                    }`}
                  >
                    <span>All</span>
                    <span className="ml-1 text-[11px] opacity-70">{allSubjectCount}</span>
                  </button>
                  {subjectFacet.groups[0].tags.map((tag) => {
                    const active = selected.subject.includes(tag.id);
                    const count = countFor(subjectFacet, tag.id, selected);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggle("subject", tag.id)}
                        aria-pressed={active}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          active
                            ? "bg-accent-deep text-paper shadow-xs"
                            : "border border-blush/70 bg-surface/80 text-ink-soft hover:border-accent-deep hover:text-accent-deep"
                        }`}
                      >
                        <TagLabel tag={tag} />
                        <span className="ml-1 text-[11px] opacity-70">{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Topics & Thinkers Toggle */}
              {secondaryFacets.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPanelOpen((prev) => !prev)}
                    aria-expanded={panelOpen}
                    aria-controls="writing-secondary-filters"
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      panelOpen || secondaryActiveCount > 0
                        ? "border-accent-deep bg-surface text-accent-deep"
                        : "border-blush/70 bg-surface/60 text-ink-soft hover:border-accent-deep hover:text-accent-deep"
                    }`}
                  >
                    <FilterIcon />
                    <span>Topics & Thinkers</span>
                    {secondaryActiveCount > 0 && (
                      <span className="rounded-full bg-accent-deep px-1.5 py-0.2 text-[10px] text-paper">
                        {secondaryActiveCount}
                      </span>
                    )}
                    <span className={`text-[10px] transition-transform ${panelOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                </div>
              )}
            </div>

            {/* Expandable Topics & Thinkers drawer */}
            {panelOpen && secondaryFacets.length > 0 && (
              <div
                id="writing-secondary-filters"
                className="mt-4 flex flex-col gap-3.5 rounded-2xl border border-blush/60 bg-surface/80 p-4 shadow-xs md:p-5"
              >
                {secondaryFacets.map((facet) => {
                  const nested = facet.groups.length > 1;
                  return (
                    <fieldset key={facet.key} className="grid gap-2 sm:grid-cols-[5.5rem_1fr] sm:items-baseline">
                      <legend className="contents">
                        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">{facet.label}</span>
                      </legend>
                      <div className="flex flex-col gap-2">
                        {facet.groups.map((group) => {
                          const availableTags = group.tags.filter(
                            (t) => countFor(facet, t.id, selected) > 0 || selected[facet.key].includes(t.id),
                          );
                          if (availableTags.length === 0) return null;

                          return (
                            <div
                              key={group.key}
                              role={nested ? "group" : undefined}
                              aria-label={nested ? `${facet.label}: ${group.label}` : undefined}
                              className="flex flex-wrap items-center gap-1.5"
                            >
                              {nested && (
                                <span className="text-[11px] font-medium text-ink-soft/70 sm:w-16">
                                  {group.label}
                                </span>
                              )}
                              {availableTags.map((tag) => {
                                const active = selected[facet.key].includes(tag.id);
                                const count = countFor(facet, tag.id, selected);
                                return (
                                  <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggle(facet.key, tag.id)}
                                    aria-pressed={active}
                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs transition-colors ${
                                      active
                                        ? "border-accent-deep bg-accent-deep font-medium text-paper shadow-xs"
                                        : "border-blush/70 bg-white/70 text-ink-soft hover:border-accent-deep hover:text-accent-deep"
                                    }`}
                                  >
                                    <TagLabel tag={tag} />
                                    <span className="ml-1 text-[11px] opacity-60">{count}</span>
                                  </button>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            )}

            {/* Active filter chips */}
            {activeItems.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-ink-soft">Applied:</span>
                {activeItems.map((item) => (
                  <button
                    key={`${item.facetKey}-${item.id}`}
                    type="button"
                    onClick={() => toggle(item.facetKey, item.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-blush/80 bg-white px-2.5 py-0.5 text-xs text-ink transition-colors hover:border-accent-deep hover:text-accent-deep"
                    title={`Remove ${item.facetLabel}: ${item.label}`}
                  >
                    <span>
                      <span className="text-ink-soft/75">{item.facetLabel}:</span> {item.label}
                    </span>
                    <CloseIcon />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => commit(EMPTY_SELECTION)}
                  className="ml-1 text-xs text-accent-deep underline-offset-2 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Status summary */}
            <div className="mt-2.5 flex items-center justify-between text-xs text-ink-soft">
              <p role="status" aria-live="polite">
                Showing {visible.length} of {writing.length} {writing.length === 1 ? "piece" : "pieces"}
              </p>
              {activeCount > 0 && activeItems.length === 0 && (
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
