import { SCALES } from "../data/projects";

// Small pill that says how big a project is. Flagship is filled, Standard is a
// plain outline, Mini is dashed, so the three read differently at a glance
// without relying on colour alone. The description shows on hover/focus via
// the title attribute and is read out by screen readers through aria-label.
const STYLES = {
  flagship: "border-accent-deep bg-accent-deep/10 text-accent-deep",
  standard: "border-blush text-ink-soft",
  mini: "border-dashed border-blush text-ink-soft",
};

export function ScaleBadge({ scale }) {
  const info = SCALES[scale];
  if (!info) return null;

  return (
    <span
      title={info.description}
      aria-label={`${info.label} project. ${info.description}`}
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[scale]}`}
    >
      {info.label}
    </span>
  );
}
