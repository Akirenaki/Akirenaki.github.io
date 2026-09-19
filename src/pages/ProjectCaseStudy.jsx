import { Link, useParams } from "react-router";
import { projects } from "../data/projects";
import { ProjectMedia } from "../components/ProjectMedia";
import { TechStack } from "../components/TechStack";
import { buildMeta } from "../lib/seo";

// meta() gets `params` directly - the same :slug the component reads via
// useParams() - rather than needing to be a hook, since this now runs
// once at prerender time per URL in react-router.config.js's prerender()
// list, not client-side per navigation. Falls back to the site default
// title/description when the slug doesn't match anything, so a
// mistyped/old link doesn't keep whatever the previous page's tags were.
export function meta({ params }) {
  const project = projects.find((p) => p.slug === params.slug);
  return project
    ? buildMeta({ title: project.title, description: project.summary, path: `/work/${project.slug}` })
    : buildMeta({ path: `/work/${params.slug ?? ""}` });
}

export function ProjectCaseStudy() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <section className="px-5 py-24 text-center md:px-8">
        <h1 className="font-display text-3xl text-ink">Project not found</h1>
        <Link to="/work" className="mt-4 inline-block text-accent-deep hover:underline">
          ← Back to work
        </Link>
      </section>
    );
  }

  return (
    <article className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Link to="/work" className="text-sm text-ink-soft hover:text-accent-deep">
          ← Back to work
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
          <span>{project.dateRange}</span>
          <span aria-hidden="true">·</span>
          <span>{project.role}</span>
        </div>

        <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink md:text-5xl">
          {project.title}
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{project.summary}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <TechStack visible={project.stack.visible} hidden={project.stack.hidden} />
        </div>

        <div className="mt-4 flex gap-4 text-sm">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent-deep px-5 py-2 font-medium text-paper transition hover:brightness-90"
            >
              Live demo
            </a>
          )}
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink/20 px-5 py-2 font-medium text-ink transition-colors hover:border-accent-deep hover:text-accent-deep"
            >
              Repository
            </a>
          )}
        </div>

        <ProjectMedia
          project={project}
          variant="hero"
          aspect="16/9"
          className="mt-10 rounded-sm"
        />

        <div className="mt-12 flex flex-col gap-10">
          {project.caseStudy.map((block) => (
            <div key={block.heading}>
              <h2 className="font-display text-xl font-medium text-ink">{block.heading}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default ProjectCaseStudy;
