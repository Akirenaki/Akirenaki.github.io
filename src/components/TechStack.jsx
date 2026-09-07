// Tech-stack chips: always-visible items, plus a native <details> disclosure
// for the rest. Uses <details>/<summary> (not a JS-driven accordion) so it
// works with no JS and reads correctly to screen readers out of the box.

export function TechStack({ visible = [], hidden = [] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((item) => (
        <span
          key={item}
          className="rounded-full border border-blush bg-surface px-3 py-1 text-sm text-ink"
        >
          {item}
        </span>
      ))}

      {hidden.length > 0 && (
        <details className="group inline-block [&>summary]:list-none">
          <summary
            className="cursor-pointer rounded-full border border-dashed border-blush bg-transparent px-3 py-1 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent group-open:hidden"
          >
            +{hidden.length} more
          </summary>
          <span className="inline-flex flex-wrap gap-2">
            {hidden.map((item) => (
              <span
                key={item}
                className="rounded-full border border-blush bg-surface px-3 py-1 text-sm text-ink"
              >
                {item}
              </span>
            ))}
          </span>
        </details>
      )}
    </div>
  );
}
