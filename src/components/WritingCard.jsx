import { Link } from "react-router";
import { SECTIONS, entryMeta } from "../data/writing";

// Two shapes of the same entry.
//   variant="row"   the /writing index: flat, divided by rules, summary in full
//   variant="card"  Home's "Featured writing": the ProjectCard chrome (blush
//                   border, surface fill, accent border on hover) with type in
//                   place of an image, since essays have none. size="lg" spans
//                   both columns, as the big featured project does.
// No tags here on purpose: tags live on the entry page.
export function WritingCard({ entry, variant = "row", size = "md" }) {
  const to = `/writing/${entry.slug}`;
  const meta = entryMeta(entry);

  if (variant === "card") {
    const isLarge = size === "lg";
    return (
      <article
        className={`group flex flex-col border border-blush bg-surface p-6 transition-colors hover:border-accent-deep ${
          isLarge ? "md:col-span-2" : ""
        }`}
      >
        <p className="text-xs text-ink-soft">{[SECTIONS[entry.section].label, ...meta].join(" · ")}</p>
        <h3 className={`mt-3 font-display font-medium text-ink ${isLarge ? "text-2xl" : "text-xl"}`}>
          <Link to={to} className="hover:text-accent-deep">
            {entry.title}
          </Link>
        </h3>
        <p className={`mt-3 text-sm leading-relaxed text-ink-soft ${isLarge ? "md:max-w-3xl" : "line-clamp-5"}`}>
          {entry.summary}
        </p>
        <Link to={to} className="mt-auto pt-4 text-sm text-accent-deep hover:underline">
          Read the piece →
        </Link>
      </article>
    );
  }

  return (
    <article className="border-t border-blush py-6">
      <p className="text-[13px] text-ink-soft">{meta.join(" · ")}</p>
      <h3 className="mt-2 font-display text-2xl font-medium text-ink">
        <Link to={to} className="hover:text-accent-deep">
          {entry.title}
        </Link>
      </h3>
      <p className="mt-2 max-w-[680px] leading-relaxed text-ink-soft">{entry.summary}</p>
      <Link to={to} className="mt-3 inline-block text-accent-deep hover:underline">
        Read the piece →
      </Link>
    </article>
  );
}
