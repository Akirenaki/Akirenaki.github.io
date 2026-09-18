import { useMemo, useState } from "react";
import { projects } from "../data/projects";
import { ProjectCard } from "../components/ProjectCard";
import { useSEO } from "../hooks/useSEO";

export function Work() {
  useSEO({
    title: "Work",
    description:
      "Selected projects by Renee Astraea spanning astronomical data pipelines, full-stack web systems, and applied statistics.",
    path: "/work",
  });
  const [activeTag, setActiveTag] = useState("All");

  const tags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const visible = activeTag === "All" ? projects : projects.filter((p) => p.tags.includes(activeTag));
  // On a 2-column grid, an odd total leaves the last card alone with empty
  // space beside it - give it the wide "lg" treatment instead so every row
  // stays full, regardless of how the filtered count comes out.
  const isLastOdd = (i) => visible.length % 2 === 1 && i === visible.length - 1;

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-medium text-ink">Work</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Everything from full-stack astronomy tools to a trebuchet built for a physics grade. Filter by domain, or
          open a project for the full write-up.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                activeTag === tag
                  ? "border-accent-deep bg-accent-deep text-paper"
                  : "border-blush text-ink-soft hover:border-accent-deep hover:text-accent-deep"
              }`}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {visible.map((project, i) => (
            <ProjectCard key={project.slug} project={project} size={isLastOdd(i) ? "lg" : "md"} />
          ))}
        </div>
      </div>
    </section>
  );
}
