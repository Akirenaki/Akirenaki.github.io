import { useMemo, useState } from "react";
import { projects, isLive, hasRepo, SCALES } from "../data/projects";
import { ProjectCard } from "../components/ProjectCard";
import { buildMeta } from "../lib/seo";

export function meta() {
  return buildMeta({
    title: "Work",
    description:
      "Selected projects by Renee Astraea spanning astronomical data pipelines, full-stack web systems, and applied statistics.",
    path: "/work",
  });
}

const yesNo = (flag) => [flag ? "Yes" : "No"];

// One entry per filter group, in display order. `values(project)` returns the
// values a project has for that group. Options are built from the data in
// projects.js unless a group has a `fixed` list (which also fixes their order).
//
// Scale is the primary filter and stays visible. The remaining filters are
// tucked behind one disclosure because most visitors start with project size.
const GROUPS = [
  {
    key: "scale",
    label: "Scale",
    tier: "main",
    fixed: Object.values(SCALES).map((s) => s.label),
    values: (p) => [SCALES[p.scale].label],
  },
  { key: "domain", label: "Domain", tier: "main", values: (p) => p.filters.domain },
  { key: "type", label: "Type", tier: "main", values: (p) => p.filters.type },
  { key: "framework", label: "Framework", tier: "tech", values: (p) => p.filters.framework },
  { key: "language", label: "Language", tier: "tech", values: (p) => p.filters.language },
  { key: "live", label: "Live", tier: "tech", fixed: ["Yes", "No"], values: (p) => yesNo(isLive(p)) },
  { key: "repo", label: "Repo", tier: "tech", fixed: ["Yes", "No"], values: (p) => yesNo(hasRepo(p)) },
];

const EMPTY = Object.fromEntries(GROUPS.map((g) => [g.key, []]));

// Within a group the selected options combine with OR (Astronomy or Physics);
// across groups they combine with AND (Astronomy and a Flagship). An empty
// group does not restrict anything.
const matchesGroup = (project, group, selected) =>
  selected.length === 0 || group.values(project).some((v) => selected.includes(v));

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

export function Work() {
  const [selected, setSelected] = useState(EMPTY);
  const [panelOpen, setPanelOpen] = useState(false);

  const options = useMemo(
    () =>
      Object.fromEntries(
        GROUPS.map((g) => [
          g.key,
          g.fixed ?? Array.from(new Set(projects.flatMap(g.values))).sort((a, b) => a.localeCompare(b)),
        ]),
      ),
    [],
  );

  const matches = (project, skipKey) =>
    GROUPS.every((g) => g.key === skipKey || matchesGroup(project, g, selected[g.key]));

  const visible = projects.filter((p) => matches(p));
  const activeCount = GROUPS.reduce((n, g) => n + selected[g.key].length, 0);
  const secondaryActiveCount = GROUPS.filter((g) => g.key !== "scale").reduce(
    (n, g) => n + selected[g.key].length,
    0,
  );

  const countFor = (group, option) =>
    projects.filter((p) => matches(p, group.key) && group.values(p).includes(option)).length;

  const toggle = (key, option) =>
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key].includes(option) ? prev[key].filter((o) => o !== option) : [...prev[key], option],
    }));

  const allScaleCount = projects.filter((p) => matches(p, "scale")).length;

  const activeFilters = Object.entries(selected).flatMap(([groupKey, values]) => {
    const group = GROUPS.find((g) => g.key === groupKey);
    return values.map((val) => ({
      groupKey,
      groupLabel: group?.label || groupKey,
      value: val,
    }));
  });

  // On a 2-column grid, an odd total leaves the last card alone with empty
  // space beside it - give it the wide "lg" treatment instead so every row
  // stays full, regardless of how the filtered count comes out.
  const isLastOdd = (i) => visible.length % 2 === 1 && i === visible.length - 1;

  const secondaryGroups = GROUPS.filter((g) => g.key !== "scale");

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-medium text-ink">Work</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Everything from full-stack astronomy tools to a trebuchet built for a physics grade. Start with the big
          ones or the quick experiments, browse by field, or dig into the tech. Open any project for the full write-up.
        </p>

        {/* Clean, streamlined filter toolbar */}
        <div className="mt-8 border-y border-blush/70 py-4" role="group" aria-label="Filter projects">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Primary Scale Filter */}
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by scale">
              <span className="mr-1 text-xs font-medium uppercase tracking-wide text-ink-soft">Scale:</span>
              <button
                type="button"
                onClick={() => setSelected((prev) => ({ ...prev, scale: [] }))}
                aria-pressed={selected.scale.length === 0}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selected.scale.length === 0
                    ? "bg-accent-deep text-paper shadow-xs"
                    : "border border-blush/70 bg-surface/80 text-ink-soft hover:border-accent-deep hover:text-accent-deep"
                }`}
              >
                <span>All</span>
                <span className="ml-1 text-[11px] opacity-70">{allScaleCount}</span>
              </button>
              {options.scale.map((scaleLabel) => {
                const active = selected.scale.includes(scaleLabel);
                const count = countFor(GROUPS[0], scaleLabel);
                return (
                  <button
                    key={scaleLabel}
                    type="button"
                    onClick={() => toggle("scale", scaleLabel)}
                    aria-pressed={active}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "bg-accent-deep text-paper shadow-xs"
                        : "border border-blush/70 bg-surface/80 text-ink-soft hover:border-accent-deep hover:text-accent-deep"
                    }`}
                  >
                    <span>{scaleLabel}</span>
                    <span className="ml-1 text-[11px] opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Toggle More Filters */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPanelOpen((prev) => !prev)}
                aria-expanded={panelOpen}
                aria-controls="work-secondary-filters"
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  panelOpen || secondaryActiveCount > 0
                    ? "border-accent-deep bg-surface text-accent-deep"
                    : "border-blush/70 bg-surface/60 text-ink-soft hover:border-accent-deep hover:text-accent-deep"
                }`}
              >
                <FilterIcon />
                <span>Filters</span>
                {secondaryActiveCount > 0 && (
                  <span className="rounded-full bg-accent-deep px-1.5 py-0.2 text-[10px] text-paper">
                    {secondaryActiveCount}
                  </span>
                )}
                <span className={`text-[10px] transition-transform ${panelOpen ? "rotate-180" : ""}`}>▼</span>
              </button>
            </div>
          </div>

          {/* Expandable secondary filter drawer */}
          {panelOpen && (
            <div
              id="work-secondary-filters"
              className="mt-4 flex flex-col gap-3.5 rounded-2xl border border-blush/60 bg-surface/80 p-4 shadow-xs md:p-5"
            >
              {secondaryGroups.map((group) => {
                const groupOptions = options[group.key].filter(
                  (opt) => countFor(group, opt) > 0 || selected[group.key].includes(opt),
                );
                if (groupOptions.length === 0) return null;

                return (
                  <fieldset key={group.key} className="grid gap-2 sm:grid-cols-[5.5rem_1fr] sm:items-baseline">
                    <legend className="contents">
                      <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">{group.label}</span>
                    </legend>
                    <div className="flex flex-wrap gap-1.5">
                      {groupOptions.map((option) => {
                        const active = selected[group.key].includes(option);
                        const count = countFor(group, option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggle(group.key, option)}
                            aria-pressed={active}
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs transition-colors ${
                              active
                                ? "border-accent-deep bg-accent-deep font-medium text-paper shadow-xs"
                                : "border-blush/70 bg-white/70 text-ink-soft hover:border-accent-deep hover:text-accent-deep"
                            }`}
                          >
                            <span>{option}</span>
                            <span className="ml-1 text-[11px] opacity-60">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>
          )}

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-ink-soft">Applied:</span>
              {activeFilters.map((item) => (
                <button
                  key={`${item.groupKey}-${item.value}`}
                  type="button"
                  onClick={() => toggle(item.groupKey, item.value)}
                  className="inline-flex items-center gap-1 rounded-full border border-blush/80 bg-white px-2.5 py-0.5 text-xs text-ink transition-colors hover:border-accent-deep hover:text-accent-deep"
                  title={`Remove ${item.groupLabel}: ${item.value}`}
                >
                  <span>
                    <span className="text-ink-soft/75">{item.groupLabel}:</span> {item.value}
                  </span>
                  <CloseIcon />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelected(EMPTY)}
                className="ml-1 text-xs text-accent-deep underline-offset-2 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Status summary */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-ink-soft">
            <p role="status" aria-live="polite">
              Showing {visible.length} of {projects.length} projects
            </p>
            {activeCount > 0 && activeFilters.length === 0 && (
              <button
                type="button"
                onClick={() => setSelected(EMPTY)}
                className="text-accent-deep underline-offset-2 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {visible.map((project, i) => (
            <ProjectCard key={project.slug} project={project} size={isLastOdd(i) ? "lg" : "md"} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-10 text-ink-soft">No project matches that combination. Clear a filter to see more.</p>
        )}
      </div>
    </section>
  );
}

export default Work;
