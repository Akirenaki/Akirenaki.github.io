import { Link } from "react-router";
import { ProjectMedia } from "./ProjectMedia";
import { TechStack } from "./TechStack";

// size="lg" is used for exactly one featured slot per row so the grid reads
// as curated rather than a uniform card kit - see Home.jsx / Work.jsx.
export function ProjectCard({ project, size = "md" }) {
  const isLarge = size === "lg";

  return (
    <article
      className={`group flex flex-col overflow-hidden border border-blush bg-surface transition-colors hover:border-accent-deep ${
        isLarge ? "md:col-span-2" : ""
      }`}
    >
      <Link to={`/work/${project.slug}`} className="block">
        <ProjectMedia
          project={project}
          aspect={isLarge ? "21/9" : "16/9"}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs text-ink-soft">{project.dateRange}</span>
          <span className="text-xs text-ink-soft">{project.role}</span>
        </div>

        <h3 className={`font-display font-medium text-ink ${isLarge ? "text-2xl" : "text-xl"}`}>
          <Link to={`/work/${project.slug}`} className="hover:text-accent-deep">
            {project.title}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-ink-soft">{project.summary}</p>

        <div className="mt-1">
          <TechStack visible={project.stack.visible} hidden={project.stack.hidden} />
        </div>

        <div className="mt-auto flex items-center gap-4 pt-3 text-sm">
          <Link to={`/work/${project.slug}`} className="text-accent-deep hover:underline">
            Read the case study
          </Link>
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noreferrer" className="text-ink-soft hover:text-ink">
              Live demo
            </a>
          )}
          {project.links.repo && (
            <a href={project.links.repo} target="_blank" rel="noreferrer" className="text-ink-soft hover:text-ink">
              Repository
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
