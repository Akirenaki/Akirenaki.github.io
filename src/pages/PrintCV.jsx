import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { profile } from "../data/profile";
import { experience } from "../data/experience";
import { awards, certifications, technicalStack } from "../data/awards";
import { projects } from "../data/projects";
import { isLikelyInAppBrowser } from "../utils/browserDetect";

function PrinterIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M7 8.5V4h10v4.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="8.5" width="16" height="7.5" rx="1.4" />
      <path d="M8 13.5h8V20H8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="font-display text-lg font-medium text-ink border-b border-blush pb-1.5 mb-3">{children}</h2>
  );
}

export function PrintCV() {
  const [searchParams] = useSearchParams();
  const hasTriggeredPrint = useRef(false);
  const inAppBrowser = isLikelyInAppBrowser();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${profile.legalNameCV} — CV`;
    return () => {
      document.title = previousTitle;
    };
  }, []);

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

  const generatedFrom = window.location.href.split("#")[0];
  const generatedOn = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-paper px-4 py-10 print:bg-white print:p-0 md:px-8">
      <style>{`
        @page { size: A4; margin: 14mm 16mm; }
        @media print {
          html, body { background: #fff !important; }
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
      <div className="mx-auto max-w-[210mm] border border-blush/40 bg-white p-10 shadow-sm print:max-w-none print:border-0 print:p-0 print:shadow-none">
        <header className="mb-8 border-b border-blush pb-6 print:break-inside-avoid">
          <p className="font-body text-sm text-ink-soft">{profile.preferredNameCV}</p>
          <h1 className="mt-1 font-display text-4xl font-medium leading-tight text-ink">
            {profile.legalNameCV}
          </h1>
          <p className="mt-2 text-base text-ink-soft">{profile.roleSummary}</p>

          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink">
            <span>{profile.location}</span>
            <span className="text-blush">·</span>
            <span>{profile.contact.email}</span>
            <span className="text-blush">·</span>
            <span>{profile.contact.whatsapp}</span>
            <span className="text-blush">·</span>
            <span>{profile.contact.linkedin.replace("https://www.", "")}</span>
            <span className="text-blush">·</span>
            <span>github.com/{profile.contact.github.label}</span>
          </p>
        </header>

        <section className="mb-8 print:break-inside-avoid">
          <SectionHeading>Summary</SectionHeading>
          <p className="text-sm leading-relaxed text-ink">{profile.homeSummary}</p>
        </section>

        <section className="mb-8 print:break-inside-avoid">
          <SectionHeading>Education</SectionHeading>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{profile.education.institution}</p>
                <p className="text-ink-soft">{profile.education.degree}</p>
              </div>
              <p className="whitespace-nowrap text-ink-soft">{profile.education.graduation}</p>
            </div>
            {profile.education.description && (
              <p className="mt-1 text-sm leading-relaxed text-ink">{profile.education.description}</p>
            )}
            {profile.education.bullets && (
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink">
                {profile.education.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="mb-8">
          <SectionHeading>Experience</SectionHeading>
          <div className="flex flex-col gap-5">
            {experience.map((role) => (
              <div key={role.title} className="print:break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <p className="font-medium text-ink">
                    {role.title} <span className="font-normal text-ink-soft">— {role.org}</span>
                  </p>
                  <p className="whitespace-nowrap text-xs text-ink-soft">{role.dateRange}</p>
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-ink">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <SectionHeading>Projects</SectionHeading>
          <div className="flex flex-col gap-5">
            {projects.map((project) => (
              <div key={project.slug} className="print:break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <p className="font-medium text-ink">
                    {project.title} <span className="font-normal text-ink-soft">— {project.role}</span>
                  </p>
                  <p className="whitespace-nowrap text-xs text-ink-soft">{project.dateRange}</p>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">{project.summary}</p>
                <p className="mt-1.5 text-xs text-ink-soft">{project.stack.visible.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 print:break-inside-avoid">
          <SectionHeading>Awards</SectionHeading>
          <div className="flex flex-col gap-3">
            {awards.map((award) => (
              <div key={award.title} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-sm">
                <p className="text-ink">
                  {award.title} <span className="text-ink-soft">— {award.issuer}</span>
                </p>
                {award.credentialId && <p className="text-xs text-ink-soft">Credential ID: {award.credentialId}</p>}
                <p className="whitespace-nowrap text-xs text-ink-soft">{award.date}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 print:break-inside-avoid">
          <SectionHeading>Certifications</SectionHeading>
          <div className="grid grid-cols-1 gap-x-8 gap-y-1 text-sm text-ink sm:grid-cols-2">
            {certifications.map((cert) => (
              <p key={cert.title}>
                {cert.title} <span className="text-ink-soft">— {cert.issuer}, {cert.date}</span>
              </p>
            ))}
          </div>
        </section>

        <section className="mb-8 print:break-inside-avoid">
          <SectionHeading>Technical Skills</SectionHeading>
          <p className="text-sm text-ink">
            <span className="text-ink-soft">Daily: </span>
            {technicalStack.daily.join(" · ")}
          </p>
          <p className="mt-1.5 text-sm text-ink">
            <span className="text-ink-soft">Also worked with: </span>
            {technicalStack.workedWith.join(" · ")}
          </p>
        </section>

        <section className="print:break-inside-avoid">
          <SectionHeading>Languages</SectionHeading>
          <p className="text-sm text-ink">
            {profile.languages.map((lang) => `${lang.name} (${lang.level})`).join(" · ")}
          </p>
        </section>

        <footer className="mt-10 border-t border-blush pt-4 text-xs text-ink-soft print:break-inside-avoid">
          Generated from {generatedFrom} on {generatedOn}.
        </footer>
      </div>
    </div>
  );
}
