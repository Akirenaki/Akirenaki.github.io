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
// Two tiers: "main" is what a project is about and how big it is, always shown.
// "tech" is how it's built and where to find it, tucked behind a disclosure
// because most visitors start from the main tier.
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

const MAIN_GROUPS = GROUPS.filter((g) => g.tier === "main");
const TECH_GROUPS = GROUPS.filter((g) => g.tier === "tech");
const EMPTY = Object.fromEntries(GROUPS.map((g) => [g.key, []]));

// Within a group the selected options combine with OR (Astronomy or Physics);
// across groups they combine with AND (Astronomy and a Flagship). An empty
// group does not restrict anything.
const matchesGroup = (project, group, selected) =>
  selected.length === 0 || group.values(project).some((v) => selected.includes(v));

export function Work() {
  const [selected, setSelected] = useState(EMPTY);

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
  const techActiveCount = TECH_GROUPS.reduce((n, g) => n + selected[g.key].length, 0);

  // How many projects an option would show if clicked, given what is selected
  // in the *other* groups. Options that would return nothing are disabled so
  // you can't click your way into an empty page.
  const countFor = (group, option) =>
    projects.filter((p) => matches(p, group.key) && group.values(p).includes(option)).length;

  const toggle = (key, option) =>
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key].includes(option) ? prev[key].filter((o) => o !== option) : [...prev[key], option],
    }));

  // On a 2-column grid, an odd total leaves the last card alone with empty
  // space beside it - give it the wide "lg" treatment instead so every row
  // stays full, regardless of how the filtered count comes out.
  const isLastOdd = (i) => visible.length % 2 === 1 && i === visible.length - 1;

  const renderGroup = (group) => (
    <fieldset key={group.key} className="grid gap-2 md:grid-cols-[6rem_1fr] md:items-center">
      <legend className="contents">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">{group.label}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options[group.key].map((option) => {
          const active = selected[group.key].includes(option);
          const count = countFor(group, option);
          const disabled = count === 0 && !active;
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(group.key, option)}
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
              {option} <span className="text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-medium text-ink">Work</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Everything from full-stack astronomy tools to a trebuchet built for a physics grade. Start with the big
          ones or the quick experiments, browse by field, or dig into the tech. Open any project for the full write-up.
        </p>

        <div className="mt-8 flex flex-col gap-3 border-y border-blush/70 py-5" role="group" aria-label="Filter projects">
          {MAIN_GROUPS.map(renderGroup)}

          <details className="group/tech mt-1">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-accent-deep hover:underline [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="transition-transform group-open/tech:rotate-90">
                ›
              </span>
              Tech and links: framework, language, live demo, repo
              {techActiveCount > 0 && (
                <span className="rounded-full bg-accent-deep px-2 py-0.5 text-xs text-paper">{techActiveCount}</span>
              )}
            </summary>
            <div className="mt-4 flex flex-col gap-3">{TECH_GROUPS.map(renderGroup)}</div>
          </details>

          <div className="flex items-center gap-4 pt-1 text-sm text-ink-soft">
            <p role="status" aria-live="polite">
              Showing {visible.length} of {projects.length} projects
            </p>
            {activeCount > 0 && (
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
