import { Link } from "react-router-dom";
import { profile } from "../data/profile";
import { getBigFeaturedProject, getOrderedFeaturedProjects } from "../data/projects";
import { ProjectCard } from "../components/ProjectCard";
import { PlaceholderImage } from "../components/PlaceholderMedia";
import { PrintCVButton } from "../components/PrintCVButton";

export function Home() {
  const orderedFeaturedProjects = getOrderedFeaturedProjects();
  const bigProject = getBigFeaturedProject();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-blush/70">
        <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-5 py-20 md:flex-row md:items-center md:px-8 md:py-28">
          <div className="max-w-xl">
            <p className="font-body text-sm tracking-wide text-ink-soft">{profile.nameLegal}</p>
            <h1 className="mt-1 font-display text-5xl font-medium leading-[1.05] text-ink md:text-6xl">
              {profile.namePreferred}
            </h1>
            <p className="mt-5 text-lg text-ink-soft">{profile.roleSummary}</p>
            <p className="mt-6 font-display text-xl italic text-accent-deep">"{profile.tagline}"</p>

            <p className="mt-6 max-w-md leading-relaxed text-ink">{profile.homeSummary}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/work"
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
              >
                See the work
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Get in touch
              </Link>
            </div>

            <PrintCVButton variant="link" className="mt-6" />
          </div>

          <PlaceholderImage
            src="/assets/portrait.jpg"
            alt={profile.namePreferred}
            aspect="4/5"
            label="Portrait — 800×1000"
            className="w-full max-w-[280px] self-center rounded-sm md:ml-auto"
          />
        </div>
      </section>

      {/* Core domains strip */}
      <section className="border-b border-blush/70 bg-surface px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-3">
          <span className="text-sm text-ink-soft">Working across</span>
          {profile.coreDomains.map((domain, i) => (
            <span key={domain} className="text-sm text-ink">
              {domain}
              {i < profile.coreDomains.length - 1 && <span className="ml-8 text-blush">·</span>}
            </span>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-medium text-ink">Featured work</h2>
            <Link to="/work" className="text-sm text-accent hover:text-accent-deep">
              View all projects →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {orderedFeaturedProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                size={project.slug === bigProject?.slug ? "lg" : "md"}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
