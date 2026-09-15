import { profile } from "../data/profile";
import { experience } from "../data/experience";
import { awards, certifications, technicalStack } from "../data/awards";
import { PlaceholderImage } from "../components/PlaceholderMedia";

const SECTIONS = [
  { id: "stack", label: "Technical stack" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "awards", label: "Awards" },
];

export function About() {
  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-medium text-ink">About &amp; Credentials</h1>

        {/* Background narrative */}
        <div className="mt-8 flex flex-col gap-4">
          {profile.bioParagraphs.map((para, i) => (
            <p key={i} className="leading-relaxed text-ink-soft">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-1 text-sm text-ink-soft">
          <span>{profile.location}</span>
          <span className="flex gap-3">
            {profile.languages.map((l) => (
              <span key={l.name}>
                {l.name} <span className="text-ink-soft">({l.level})</span>
              </span>
            ))}
          </span>
        </div>

        {/* This page runs long (Technical stack -> Education -> Experience ->
            Awards, each with its own list of entries), so a jump nav earns
            its keep here in a way it wouldn't on the shorter pages. */}
        <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2 border-y border-blush/70 py-3">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-blush px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent-deep hover:text-accent-deep"
            >
              {s.label}
            </a>
          ))}
        </nav>

        {/* Technical stack */}
        <div id="stack" className="mt-16">
          <h2 className="font-display text-2xl font-medium text-ink">Technical stack</h2>
          <div className="mt-5 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-ink-soft">Most Frequent</h3>
              <ul className="mt-3 flex flex-col gap-1.5 text-ink">
                {technicalStack.daily.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-ink-soft">Worked with</h3>
              <ul className="mt-3 flex flex-col gap-1.5 text-ink">
                {technicalStack.workedWith.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Certifications get a denser two-up grid rather than full-width
              rows - there are seven of them, they're supporting evidence
              rather than the main narrative, and the old layout gave each
              one as much vertical space as a whole Experience entry. */}
          <h3 className="mt-8 text-sm font-medium uppercase tracking-wide text-ink-soft">Certifications</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {certifications.map((c) => {
              const card = (
                <div className="flex items-center gap-3 border border-blush/70 bg-surface p-3 transition-colors hover:border-accent-deep">
                  {c.image && (
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-blush/50">
                      <PlaceholderImage src={c.image} alt={`${c.title} certificate`} aspect="1/1" className="w-full" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{c.title}</p>
                    <p className="truncate text-xs text-ink-soft">
                      {c.issuer} · {c.date}
                    </p>
                    {c.credentialId && (
                      <p className="mt-0.5 truncate font-mono text-xs text-accent-deep">{c.credentialId}</p>
                    )}
                  </div>
                </div>
              );
              return (
                <li key={c.title}>
                  {c.credentialUrl ? (
                    <a href={c.credentialUrl} target="_blank" rel="noreferrer" aria-label={`Open credential for ${c.title}`}>
                      {card}
                    </a>
                  ) : (
                    card
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Education */}
        <div id="education" className="mt-16">
          <h2 className="font-display text-2xl font-medium text-ink">Education</h2>
          <div className="mt-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              {profile.education.image && (
                <PlaceholderImage
                  src={profile.education.image}
                  alt={`${profile.education.institution} education photo`}
                  aspect="4/3"
                  className="w-full shrink-0 rounded-sm sm:w-36"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{profile.education.institution}</p>
                <p className="text-sm text-ink-soft">
                  {profile.education.degree} · Expected {profile.education.graduation}
                </p>
                {profile.education.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {profile.education.description}
                  </p>
                )}
                {profile.education.bullets && (
                  <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed text-ink-soft">
                    {profile.education.bullets.map((bullet, i) => (
                      <li key={i} className="pl-4 -indent-4">
                        <span className="mr-2 text-blush">–</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Experience - genuinely chronological, so a connecting line +
            marker per entry earns its place (unlike, say, numbering the tech
            stack, which isn't a sequence). */}
        <div id="experience" className="mt-16">
          <h2 className="font-display text-2xl font-medium text-ink">Experience</h2>
          <div className="relative mt-5">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-blush" aria-hidden="true" />
            <div className="flex flex-col gap-8">
              {experience.map((role) => (
                <div key={role.title} className="relative flex flex-col gap-4 pl-6 sm:flex-row sm:pl-8">
                  <span
                    className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-paper bg-accent-deep"
                    aria-hidden="true"
                  />
                  {role.image && (
                    <PlaceholderImage
                      src={role.image}
                      alt={`${role.title} at ${role.org}`}
                      aspect="4/3"
                      className="w-full shrink-0 rounded-sm sm:w-36"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-medium text-ink">{role.title}</h3>
                      <span className="text-sm text-ink-soft">{role.dateRange}</span>
                    </div>
                    <p className="text-sm text-ink-soft">{role.org}</p>
                    <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed text-ink-soft">
                      {role.bullets.map((bullet, i) => (
                        <li key={i} className="pl-4 -indent-4">
                          <span className="mr-2 text-blush">–</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards */}
        <div id="awards" className="mt-16">
          <h2 className="font-display text-2xl font-medium text-ink">Awards &amp; competitions</h2>
          <div className="mt-5 flex flex-col gap-6">
            {awards.map((award) => (
              <div key={award.title} className="flex flex-col gap-4 sm:flex-row">
                {award.image && (
                  award.credentialUrl ? (
                    <a href={award.credentialUrl} target="_blank" rel="noreferrer" aria-label={`Open credential for ${award.title}`}>
                      <PlaceholderImage
                        src={award.image}
                        alt={`${award.title} award`}
                        aspect="4/3"
                        className="w-full shrink-0 rounded-sm sm:w-36"
                      />
                    </a>
                  ) : (
                    <PlaceholderImage
                      src={award.image}
                      alt={`${award.title} award`}
                      aspect="4/3"
                      className="w-full shrink-0 rounded-sm sm:w-36"
                    />
                  )
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-medium text-ink">{award.title}</h3>
                    <span className="text-sm text-ink-soft">{award.date}</span>
                  </div>
                  <p className="text-sm text-ink-soft">{award.issuer}</p>
                  {award.credentialId && award.credentialUrl && (
                    <p className="mt-1 text-xs text-ink-soft">
                      Credential ID:{" "}
                      <a
                        href={award.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-accent-deep underline decoration-accent-deep/40 underline-offset-2 hover:brightness-90"
                      >
                        {award.credentialId}
                      </a>
                    </p>
                  )}
                  {award.detail && <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{award.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
