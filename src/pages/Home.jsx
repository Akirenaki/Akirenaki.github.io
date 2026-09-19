import { Link } from "react-router";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "../data/profile";
import { getBigFeaturedProject, getOrderedFeaturedProjects } from "../data/projects";
import { ProjectCard } from "../components/ProjectCard";
import { PlaceholderImage } from "../components/PlaceholderMedia";
import { PrintCVButton } from "../components/PrintCVButton";
import { buildMeta } from "../lib/seo";

// One deliberate motion moment for the whole site: the hero text and portrait
// settle in on first load, staggered slightly. Framer Motion was already a
// dependency but wasn't imported anywhere - everything else stays still, on
// purpose, so this doesn't compete with the ConstellationField background.
const textVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const portraitVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] } },
};

// No `title` override - Home uses buildMeta's own default (matching the
// old static index.html tags).
export function meta() {
  return buildMeta({ description: profile.homeSummary, path: "/" });
}

export function Home() {
  const orderedFeaturedProjects = getOrderedFeaturedProjects();
  const bigProject = getBigFeaturedProject();
  const prefersReducedMotion = useReducedMotion();
  // With prefers-reduced-motion, skip straight to the resting state instead
  // of animating into it.
  const initial = prefersReducedMotion ? "visible" : "hidden";

  // Home's "Featured work" always includes the big slot plus whatever else is
  // flagged featured=true; on a 2-column grid an odd number of remaining
  // cards orphans the last one with empty space beside it. Same fix as
  // Work.jsx: give the odd one out the wide treatment so it never dangles.
  const remainingCount = orderedFeaturedProjects.length - 1;
  const isLastOdd = (i) =>
    i > 0 && remainingCount % 2 === 1 && i === orderedFeaturedProjects.length - 1;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-blush/70">
        <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-5 py-20 md:flex-row md:items-center md:px-8 md:py-28">
          <motion.div
            className="max-w-xl"
            initial={initial}
            animate="visible"
            variants={textVariants}
          >
            <p className="font-body text-sm tracking-wide text-ink-soft">{profile.legalNameHome}</p>
            <h1 className="mt-1 font-display text-5xl font-medium leading-[1.05] text-ink md:text-6xl">
              {profile.preferredNameHome}
            </h1>
            <p className="mt-5 text-lg text-ink-soft">{profile.roleSummary}</p>
            <p className="mt-6 font-display text-xl italic text-accent-deep">"{profile.tagline}"</p>

            <p className="mt-6 max-w-md leading-relaxed text-ink">{profile.homeSummary}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/work"
                className="rounded-full bg-accent-deep px-6 py-3 text-sm font-medium text-paper transition hover:brightness-90"
              >
                See the work
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent-deep hover:text-accent-deep"
              >
                Get in touch
              </Link>
            </div>

            <PrintCVButton variant="link" className="mt-6" />
          </motion.div>

          <motion.div
            className="w-full max-w-[280px] self-center md:ml-auto"
            initial={initial}
            animate="visible"
            variants={portraitVariants}
          >
            <PlaceholderImage
              src="/assets/portrait.jpg"
              alt={profile.preferredNameHome}
              aspect="4/5"
              label="Portrait — 800×1000"
              className="rounded-sm"
            />
          </motion.div>
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
            <Link to="/work" className="text-sm text-accent-deep hover:underline">
              View all projects →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {orderedFeaturedProjects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                size={project.slug === bigProject?.slug || isLastOdd(i) ? "lg" : "md"}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
