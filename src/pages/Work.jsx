import { useMemo, useState } from "react";
import { projects } from "../data/projects";
import { ProjectCard } from "../components/ProjectCard";

export function Work() {
  const [activeTag, setActiveTag] = useState("All");

  const tags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const visible = activeTag === "All" ? projects : projects.filter((p) => p.tags.includes(activeTag));

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
                  ? "border-accent bg-accent text-paper"
                  : "border-blush text-ink-soft hover:border-accent hover:text-accent"
              }`}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
