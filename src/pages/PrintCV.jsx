import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { profile } from "../data/profile";
import { testScores } from "../data/awards";
import { projects } from "../data/projects";
import {
  cvProfile,
  cvEducation,
  cvTests,
  cvProjects,
  cvExperience,
  cvAwards,
  cvCertification,
  cvSkills,
  formatCvDate,
  LINK_LABELS,
} from "../data/cv";
import { isLikelyInAppBrowser } from "../utils/browserDetect";
import { SITE_URL } from "../lib/seo";

function PrinterIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M7 8.5V4h10v4.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="8.5" width="16" height="7.5" rx="1.4" />
      <path d="M8 13.5h8V20H8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PROJECTS_BY_SLUG = new Map(projects.map((project) => [project.slug, project]));

// Links are absolute so they stay clickable in the saved PDF.
const caseStudyUrl = (slug) => `${SITE_URL}work/${slug}/`;
const linkedinLabel = profile.contact.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const githubLabel = `github.com/${profile.contact.github.label}`;

function SectionHeading({ children }) {
  return <h2 className="cv-h2">{children}</h2>;
}

function EntryHead({ title, sub, date }) {
  return (
    <div className="cv-head">
      <p className="cv-head-main">
        {title}
        {sub && <span className="cv-sub"> — {sub}</span>}
      </p>
      {date && <p className="cv-date">{date}</p>}
    </div>
  );
}

function Bullets({ items }) {
  return (
    <ul className="cv-bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// Baked into the prerendered build/client/print/index.html. noindex: this
// page lists contact details (email, location), so it shouldn't appear in
// search results. Don't also block it in robots.txt - a crawler has to be able
// to fetch the page to see the tag.
export function meta() {
  return [
    { title: `${cvProfile.displayName} — CV` },
    { name: "robots", content: "noindex" },
  ];
}

export function PrintCV() {
  const [searchParams] = useSearchParams();
  const hasTriggeredPrint = useRef(false);
  const inAppBrowser = isLikelyInAppBrowser();

  useEffect(() => {
    if (searchParams.get("auto") !== "1" || hasTriggeredPrint.current) return;
    hasTriggeredPrint.current = true;
    // Wait for web fonts to finish loading so the print output uses
    // Fraunces/Karla rather than a fallback face mid-swap.
    const trigger = () => window.print();
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setTimeout(trigger, 150));
    } else {
      setTimeout(trigger, 400);
    }
  }, [searchParams]);

  const testLine = cvTests
    .map(({ name, showMax }) => {
      const test = testScores.find((entry) => entry.name === name);
      if (!test) return null;
      const score = showMax
        ? `${test.value.toFixed(test.decimals)}/${test.max.toFixed(test.decimals)}`
        : test.value.toFixed(test.decimals);
      return `${test.name} ${score} (${formatCvDate(test.date)})`;
    })
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-paper px-4 py-10 print:bg-white print:p-0 md:px-8">
      <style>{`
        @page { size: A4; margin: 13mm 16mm; }
        .cv-doc { font-family: var(--font-body); font-size: 10.5pt; line-height: 1.33; color: #221D2E; }
        .cv-doc a { color: inherit; text-decoration: underline; text-underline-offset: 2px; text-decoration-color: #B23E82; }
        .cv-name { font-family: var(--font-display); font-size: 26pt; line-height: 1.1; font-weight: 500; }
        .cv-headline { margin-top: 3pt; font-size: 11.5pt; color: #3d3748; }
        .cv-contact { margin-top: 6pt; display: flex; flex-wrap: wrap; gap: 0 14pt; font-size: 10pt; }
        .cv-h2 { font-family: var(--font-display); font-size: 13pt; font-weight: 500; line-height: 1.2; border-bottom: 1px solid #221D2E; padding-bottom: 2pt; margin: 10pt 0 5pt; break-after: avoid; page-break-after: avoid; }
        .cv-entry { margin-top: 6pt; break-inside: avoid; page-break-inside: avoid; }
        .cv-entry:first-of-type { margin-top: 0; }
        .cv-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12pt; }
        .cv-head-main { font-weight: 700; break-after: avoid; }
        .cv-sub { font-weight: 400; }
        .cv-date { white-space: nowrap; flex: none; }
        .cv-role { font-style: italic; }
        .cv-bullets { margin: 2pt 0 0; padding-left: 14pt; list-style: disc; }
        .cv-bullets li { margin-top: 1pt; padding-left: 1pt; }
        .cv-links { font-size: 9.5pt; white-space: nowrap; flex: none; }
        .cv-group-title { font-weight: 700; break-after: avoid; }
        .cv-subentry { margin-top: 4pt; margin-left: 0; break-inside: avoid; page-break-inside: avoid; }
        .cv-line { margin-top: 2pt; }
        .cv-line strong { font-weight: 700; }
        @media print {
          html, body { background: #fff !important; }
          .cv-doc { color: #000; }
          .cv-headline { color: #222; }
        }
      `}</style>

      {/* On-screen-only notices - never appear in the printed/PDF output */}
      <div className="mx-auto mb-6 max-w-[210mm] print:hidden">
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            inAppBrowser
              ? "border-accent-deep bg-blush/40 text-ink"
              : "border-blush bg-surface text-ink-soft"
          }`}
        >
          {inAppBrowser ? (
            <p>
              <strong className="font-medium text-ink">This looks like an in-app browser.</strong>{" "}
              Printing usually doesn't work here. Tap the "···" or share menu and choose "Open in
              Chrome" / "Open in Safari", then try again.
            </p>
          ) : (
            <p>
              For best results, open this page in a regular browser app (Chrome, Safari) rather than
              one built into another app.
            </p>
          )}
          <p className="mt-1.5 text-xs">
            Android: in the print dialog, choose "Save as PDF" as the destination. iPhone: once the
            print preview appears, pinch outward on it to open the Share sheet, then "Save to Files"
            as PDF.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-deep px-6 py-3 text-sm font-medium text-paper transition hover:brightness-90"
        >
          <PrinterIcon />
          Print / Save as PDF
        </button>
      </div>

      {/* The document itself */}
      <div className="cv-doc mx-auto max-w-[210mm] border border-blush/40 bg-white p-10 shadow-sm print:max-w-none print:border-0 print:p-0 print:shadow-none">
        <header>
          <h1 className="cv-name">{cvProfile.displayName}</h1>
          <p className="cv-headline">{cvProfile.headline}</p>
          <p className="cv-contact">
            <span>{profile.location}</span>
            <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
            <span>
              LinkedIn: <a href={profile.contact.linkedin}>{linkedinLabel}</a>
            </span>
            <span>
              GitHub: <a href={profile.contact.github.url}>{githubLabel}</a>
            </span>
            <span>
              Portfolio: <a href={SITE_URL}>{cvProfile.portfolioLabel}</a>
            </span>
          </p>
        </header>

        <section aria-labelledby="cv-profile">
          <h2 id="cv-profile" className="cv-h2">Profile</h2>
          <p>{cvProfile.summary}</p>
        </section>

        <section aria-labelledby="cv-education">
          <h2 id="cv-education" className="cv-h2">Education &amp; Standardized Tests</h2>
          {cvEducation.map((edu) => (
            <div key={edu.institution} className="cv-entry">
              <EntryHead title={edu.institution} date={edu.date} />
              {(edu.detail || edu.note) && <p>{[edu.detail, edu.note].filter(Boolean).join(" · ")}</p>}
            </div>
          ))}
          <p className="cv-line" style={{ marginTop: "7pt" }}>
            <strong>Standardized tests:</strong> {testLine}
          </p>
        </section>

        <section aria-labelledby="cv-projects">
          <h2 id="cv-projects" className="cv-h2">Selected Projects &amp; Research</h2>
          {cvProjects.map((entry) => {
            const project = PROJECTS_BY_SLUG.get(entry.slug);
            if (!project) return null;
            const extraLinks = entry.links
              .map((key) => ({ key, url: project.links?.[key] }))
              .filter((link) => link.url);
            return (
              <div key={entry.slug} className="cv-entry">
                <div className="cv-head">
                  <p className="cv-head-main">
                    <a href={caseStudyUrl(entry.slug)}>{project.title}</a>
                  </p>
                  <p className="cv-date">{formatCvDate(project.dateRange)}</p>
                </div>
                <div className="cv-head">
                  <p className="cv-role">{entry.role}</p>
                  {extraLinks.length > 0 && (
                    <p className="cv-links">
                      {extraLinks.map((link, index) => (
                        <span key={link.key}>
                          {index > 0 && " · "}
                          <a href={link.url}>{LINK_LABELS[link.key]}</a>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                <Bullets items={entry.bullets} />
              </div>
            );
          })}
        </section>

        <section aria-labelledby="cv-service">
          <h2 id="cv-service" className="cv-h2">Teaching, Leadership &amp; Service</h2>
          {cvExperience.map((role) =>
            role.group ? (
              <div key={role.org} className="cv-entry">
                <p className="cv-group-title">{role.org}</p>
                {role.group.map((sub) => (
                  <div key={sub.title} className="cv-subentry">
                    <div className="cv-head">
                      <p className="cv-head-main" style={{ fontWeight: 400 }}>
                        <strong style={{ fontWeight: 700 }}>{sub.title}</strong>
                      </p>
                      <p className="cv-date">{sub.date}</p>
                    </div>
                    <Bullets items={sub.bullets} />
                  </div>
                ))}
              </div>
            ) : (
              <div key={role.title} className="cv-entry">
                <EntryHead title={role.title} date={role.date} />
                <p className="cv-role">{role.org}</p>
                <Bullets items={role.bullets} />
              </div>
            ),
          )}
        </section>

        <section aria-labelledby="cv-awards">
          <h2 id="cv-awards" className="cv-h2">Awards &amp; Selected Credentials</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {cvAwards.map((award) => (
              <li key={`${award.title}-${award.date}`} className="cv-head" style={{ marginTop: "2pt", breakInside: "avoid" }}>
                <p>
                  <strong>{award.title}</strong>, {award.detail}
                </p>
                <p className="cv-date">{award.date}</p>
              </li>
            ))}
          </ul>
          <div className="cv-head" style={{ marginTop: "5pt", breakInside: "avoid" }}>
            <p>
              <strong>{cvCertification.label}:</strong> {cvCertification.text}
            </p>
            <p className="cv-date">{cvCertification.date}</p>
          </div>
        </section>

        <section aria-labelledby="cv-skills">
          <h2 id="cv-skills" className="cv-h2">Technical Skills &amp; Languages</h2>
          {cvSkills.map((group) => (
            <p key={group.label} className="cv-line" style={{ breakInside: "avoid" }}>
              <strong>{group.label}:</strong> {group.items}.
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}

export default PrintCV;
