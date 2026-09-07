import { profile } from "../data/profile";
import { experience } from "../data/experience";
import { awards, certifications, technicalStack } from "../data/awards";
import { PlaceholderImage } from "../components/PlaceholderMedia";

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
          <p className="leading-relaxed text-ink-soft">
            Outside formal coursework, also tinkers with embedded electronics - ESP32-based environmental sensors -
            when a project calls for a hardware layer.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-1 text-sm text-ink-soft">
          <span>{profile.location}</span>
          <span className="flex gap-3">
            {profile.languages.map((l) => (
              <span key={l.name}>
                {l.name} <span className="text-ink-soft/70">({l.level})</span>
              </span>
            ))}
          </span>
        </div>

        {/* Technical stack */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-medium text-ink">Technical stack</h2>
          <div className="mt-5 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-ink-soft">Daily</h3>
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

          <h3 className="mt-8 text-sm font-medium uppercase tracking-wide text-ink-soft">Certifications</h3>
          <ul className="mt-3 flex flex-col gap-1.5 text-ink">
            {certifications.map((c) => (
              <li key={c.title} className="flex flex-col gap-3 border-b border-blush/60 py-3 sm:flex-row">
                {c.image && (
                  <PlaceholderImage
                    src={c.image}
                    alt={`${c.title} certificate`}
                    aspect="4/3"
                    label={`Certification — ${c.title}`}
                    className="w-full shrink-0 rounded-sm sm:w-28"
                  />
                )}
                <div className="flex min-w-0 flex-1 flex-wrap justify-between gap-x-4 gap-y-1">
                  <span>
                    {c.title} <span className="text-ink-soft">— {c.issuer}</span>
                  </span>
                  <span className="text-ink-soft">{c.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Education & Experience */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-medium text-ink">Education &amp; experience</h2>

          <div className="mt-5 border-b border-blush pb-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              {profile.education.image && (
                <PlaceholderImage
                  src={profile.education.image}
                  alt={`${profile.education.institution} education photo`}
                  aspect="4/3"
                  label={`Education — ${profile.education.institution}`}
                  className="w-full shrink-0 rounded-sm sm:w-36"
                />
              )}
              <div>
                <p className="font-medium text-ink">{profile.education.institution}</p>
                <p className="text-sm text-ink-soft">
                  {profile.education.degree} · Expected {profile.education.graduation}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-8">
            {experience.map((role) => (
              <div key={role.title} className="flex flex-col gap-4 sm:flex-row">
                {role.image && (
                  <PlaceholderImage
                    src={role.image}
                    alt={`${role.title} at ${role.org}`}
                    aspect="4/3"
                    label={`Experience — ${role.org}`}
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

        {/* Awards */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-medium text-ink">Awards &amp; competitions</h2>
          <div className="mt-5 flex flex-col gap-6">
            {awards.map((award) => (
              <div key={award.title} className="flex flex-col gap-4 sm:flex-row">
                {award.image && (
                  <PlaceholderImage
                    src={award.image}
                    alt={`${award.title} award`}
                    aspect="4/3"
                    label={`Award — ${award.title}`}
                    className="w-full shrink-0 rounded-sm sm:w-36"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-medium text-ink">{award.title}</h3>
                    <span className="text-sm text-ink-soft">{award.date}</span>
                  </div>
                  <p className="text-sm text-ink-soft">{award.issuer}</p>
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
