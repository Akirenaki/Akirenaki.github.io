// Renders on Home and Contact only (not Nav/Footer) - see PrintCV.jsx for
// the destination page and its own in-page browser notice. This component
// only carries the short heads-up shown *before* the click.

function PrinterIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M7 8.5V4h10v4.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="8.5" width="16" height="7.5" rx="1.4" />
      <path d="M8 13.5h8V20H8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function openPrintCv() {
  // App.jsx uses BrowserRouter with basename="/Portfolio", so the route is a
  // real path (/Portfolio/print), not a #fragment - match that here.
  const origin = window.location.origin;
  window.open(`${origin}/Portfolio/print?auto=1`, "_blank", "noopener,noreferrer");
}

const VARIANT_CLASSES = {
  // Matches the "Get in touch" secondary CTA on Home.
  pill: "rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent-deep hover:text-accent-deep",
  // A quieter, tertiary treatment for sitting under a hero CTA row.
  link: "text-sm font-medium text-ink-soft transition-colors hover:text-accent-deep",
};

export function PrintCVButton({ variant = "pill", className = "" }) {
  const buttonClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.pill;

  return (
    <div className={className}>
      <button type="button" onClick={openPrintCv} className={`inline-flex items-center gap-2 ${buttonClass}`}>
        <PrinterIcon />
        Print CV
      </button>
      <p className="mt-2 text-xs text-ink-soft">
        Opens in a new tab. Use your regular browser app (Chrome, Safari) — printing may not work inside
        an in-app browser like Instagram or WhatsApp.
      </p>
    </div>
  );
}
