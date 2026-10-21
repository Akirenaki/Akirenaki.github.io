import { Link, useParams } from "react-router";
import {
  LANGUAGE_CODES,
  SECTIONS,
  entriesInSection,
  entryMeta,
  formatLastEdited,
  writing,
} from "../data/writing";
import { FACETS, TAGS_BY_ID } from "../data/writing-taxonomy";
import { TagLabel } from "../components/TagLabel";
import { essayHtml } from "../lib/essay-text";
import { articleJsonLd, breadcrumbJsonLd, pageUrl, SITE_URL, buildMeta } from "../lib/seo";

// Same pattern as ProjectCaseStudy: meta() reads the :slug from `params`, so the
// tags are baked into each prerendered file. Falls back to the site default for
// an unknown slug.
export function meta({ params }) {
  const entry = writing.find((w) => w.slug === params.slug);
  const path = `/writing/${entry?.slug ?? params.slug ?? ""}`;
  if (!entry) return buildMeta({ path });
  return buildMeta({
    title: entry.title,
    description: entry.summary,
    path,
    jsonLd: [
      articleJsonLd({
        headline: entry.title,
        description: entry.summary,
        path,
        inLanguage: LANGUAGE_CODES[entry.language],
        wordCount: entry.wordCount,
        dateModified: entry.pdf.lastEdited,
      }),
      breadcrumbJsonLd([
        { name: "Home", item: SITE_URL },
        { name: "Writing", item: pageUrl("/writing") },
        { name: entry.title, item: pageUrl(path) },
      ]),
    ],
  });
}

const withBase = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export function WritingEntry() {
  const { slug } = useParams();
  const entry = writing.find((w) => w.slug === slug);

  if (!entry) {
    return (
      <section className="px-5 py-24 text-center md:px-8">
        <h1 className="font-display text-3xl text-ink">Piece not found</h1>
        <Link to="/writing" className="mt-4 inline-block text-accent-deep hover:underline">
          ← Back to writing
        </Link>
      </section>
    );
  }

  const siblings = entriesInSection(entry.section);
  const at = siblings.findIndex((w) => w.slug === entry.slug);
  const previous = siblings[at - 1];
  const next = siblings[at + 1];

  const pdfHref = withBase(entry.pdf.path);
  const textHtml = essayHtml(entry.slug);
  const facts = [SECTIONS[entry.section].label, ...entryMeta(entry)];
  const versions = entry.otherVersions.filter((v) => v.url);

  // One row per tag group that this entry actually uses, in taxonomy order.
  const tagRows = FACETS.flatMap((facet) =>
    facet.groups
      .filter((group) => (entry.tags[group.key] ?? []).length > 0)
      .map((group) => ({
        key: group.key,
        label: facet.groups.length > 1 ? `${facet.label} (${group.label})` : facet.label,
        tags: entry.tags[group.key].map((id) => TAGS_BY_ID.get(id)),
      })),
  );

  return (
    <article className="px-5 py-16 md:px-8 md:py-24 print:p-0">
      <div className="mx-auto max-w-3xl print:max-w-none">
        <Link to="/writing" className="text-sm text-ink-soft hover:text-accent-deep print:hidden">
          ← Back to writing
        </Link>

        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft print:hidden">
          {facts.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true">·</span>}
              {item}
            </span>
          ))}
        </p>

        <h1 className="mt-2 font-display text-4xl font-medium leading-[1.15] text-ink md:text-[44px] print:mt-0 print:text-[22pt]!">{entry.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft print:hidden">{entry.summary}</p>

        {tagRows.length > 0 && (
          <div className="mt-6 flex flex-col gap-2.5 print:hidden" role="group" aria-label="Tags">
            {tagRows.map((row) => (
              <div key={row.key} className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-3">
                <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-ink-soft sm:w-40">
                  {row.label}
                </span>
                <ul className="flex flex-wrap gap-2">
                  {row.tags.map((tag) => (
                    <li key={tag.id}>
                      <Link
                        to={`/writing?${new URLSearchParams({ [tag.facet]: tag.id })}`}
                        className="inline-block rounded-full border border-blush px-3 py-1 text-sm text-ink-soft transition-colors hover:border-accent-deep hover:text-accent-deep"
                      >
                        <TagLabel tag={tag} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm print:hidden">
          <a
            href={pdfHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent-deep px-5 py-2 font-medium text-paper transition hover:brightness-90"
          >
            Open PDF
          </a>
          <a
            href={pdfHref}
            download
            className="rounded-full border border-ink/20 px-5 py-2 font-medium text-ink transition-colors hover:border-accent-deep hover:text-accent-deep"
          >
            Download PDF
          </a>
        </div>

        <p className="mt-5 text-[13px] text-ink-soft print:mt-3 print:text-[10pt]!">
          <span className="hidden print:inline">Renee Astraea · </span>
          Last edited: <time dateTime={entry.pdf.lastEdited}>{formatLastEdited(entry.pdf.lastEdited)}</time>
        </p>

        {textHtml && (
          <section
            aria-label="Full text"
            lang={LANGUAGE_CODES[entry.language]}
            className="mt-10 border-t border-blush pt-10 print:mt-6 print:border-t-0 print:pt-0"
          >
            {/* Trusted: rendered at build time from our own Markdown files (src/lib/essay-text.js). */}
            <div className="essay-prose" dangerouslySetInnerHTML={{ __html: textHtml }} />
          </section>
        )}

        {entry.googleDocUrl && (
          <section aria-labelledby="online-document" className="mt-14 print:hidden">
            <h2 id="online-document" className="font-display text-[22px] font-medium text-ink">
              Online document
            </h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              The online document below may be more up to date, and so more relevant, than the text on this page and the PDF.
            </p>
            <a
              href={entry.googleDocUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-full border border-ink/20 px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-accent-deep hover:text-accent-deep"
            >
              Open in Google Docs →
            </a>
          </section>
        )}

        {versions.length > 0 && (
          <section aria-labelledby="other-versions" className="mt-14 print:hidden">
            <h2 id="other-versions" className="font-display text-[22px] font-medium text-ink">
              Other versions
            </h2>
            <div className="mt-3 flex flex-col gap-4">
              {versions.map((v) => (
                <div key={v.url} className="border border-blush bg-surface p-5">
                  <p className="font-medium text-ink">
                    {v.language} · {v.label}
                  </p>
                  <p className="mt-1.5 leading-relaxed text-ink-soft">{v.note}</p>
                  {v.embedUrl && (
                    <>
                      <p className="mt-4 text-sm text-ink-soft">The text below is the current version.</p>
                      <iframe
                        src={v.embedUrl}
                        title={`${v.language} text, current version`}
                        loading="lazy"
                        className="mt-2 h-[480px] w-full border border-blush bg-paper"
                      />
                    </>
                  )}
                  <a href={v.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-accent-deep hover:underline">
                    Open the live {v.label} →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {entry.sources.length > 0 && (
          <section aria-labelledby="key-sources" className="mt-12 print:hidden">
            <h2 id="key-sources" className="font-display text-[22px] font-medium text-ink">
              Key sources
            </h2>
            <ul className="mt-3 list-disc pl-5 leading-[1.9] text-ink-soft">
              {entry.sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </section>
        )}

        <p className="hidden text-[9pt] leading-relaxed text-ink-soft print:mt-8 print:block">
          {entry.rights.replace(/\.$/, "")}. Source and later versions: {pageUrl(`/writing/${entry.slug}`)}
        </p>

        <p className="mt-12 text-sm leading-relaxed text-ink-soft print:hidden">
          {entry.rights.replace(/\.$/, "")}. Responses and objections are welcome through{" "}
          <Link to="/contact" className="text-accent-deep hover:underline">
            Contact
          </Link>
          .
        </p>

        {(previous || next) && (
          <nav
            aria-label={`More in ${SECTIONS[entry.section].label}`}
            className="mt-10 flex justify-between gap-6 border-t border-blush pt-6 text-sm print:hidden"
          >
            {previous ? (
              <Link to={`/writing/${previous.slug}`} rel="prev" className="max-w-[46%] text-accent-deep hover:underline">
                <span className="block text-[13px] text-ink-soft">← Previous</span>
                {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={`/writing/${next.slug}`} rel="next" className="max-w-[46%] text-right text-accent-deep hover:underline">
                <span className="block text-[13px] text-ink-soft">Next →</span>
                {next.title}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </article>
  );
}

export default WritingEntry;
