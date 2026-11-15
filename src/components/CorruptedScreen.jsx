// The corrupted error screen: the 404 page and the fallback for any other
// error. Words come from data/error-screen.js, the look from `.corrupt` in
// index.css (the same family of effect as the Ripples of Past Reverie section,
// on a dark field with a cooler palette).
//
// The corruption is decorative: a fixed set of aria-hidden blocks animated with
// CSS alone, never intercepting pointer events and never placed over the text
// panel, so the message stays readable. With reduced motion it is a still image.
//
// The address and the random flavour line are only filled in after the page has
// loaded. The 404 is prerendered once and served for every unknown address, so
// anything per-visitor rendered on the server would not match what the browser
// renders (and would show the wrong address for a moment).

import { useEffect, useId, useState } from "react";
import { Link } from "react-router";
import { ERROR_SCREEN, fillFlavour, pickFragment } from "../data/error-screen";

// [left, top, width, height, tone, drift, delay, duration, opacity]
// Percentages of the field. `drift` is how far a block jumps sideways. The
// middle band is left to the text panel, so most blocks hug the top and bottom.
const FRAGMENTS = [
  [0, 0, 100, 9, "indigo", "4%", "-0.4s", "3.6s", 0.95],
  [6, 8, 58, 7, "pink", "-8%", "-1.9s", "4.3s", 0.8],
  [52, 6, 48, 12, "blue", "7%", "-0.9s", "5.2s", 0.85],
  [0, 15, 30, 14, "blush", "-6%", "-2.6s", "3.9s", 0.55],
  [70, 20, 30, 10, "indigo", "9%", "-1.3s", "4.7s", 0.9],
  [0, 36, 14, 22, "blue", "-5%", "-3.1s", "5.6s", 0.7],
  [86, 40, 14, 26, "pink", "6%", "-0.2s", "4.4s", 0.65],
  [0, 62, 22, 12, "indigo", "-7%", "-2.2s", "3.7s", 0.9],
  [64, 70, 36, 11, "blush", "8%", "-1.1s", "5.0s", 0.5],
  [0, 80, 60, 8, "blue", "-9%", "-3.4s", "4.1s", 0.85],
  [40, 86, 60, 7, "pink", "5%", "-0.7s", "3.4s", 0.75],
  [0, 92, 100, 8, "indigo", "-4%", "-2.9s", "4.9s", 0.95],
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function CorruptedScreen({ variant = "notFound", path = "", status }) {
  const screen = ERROR_SCREEN[variant] ?? ERROR_SCREEN.notFound;
  const isNotFound = variant === "notFound";
  const code = status && !isNotFound ? String(status) : screen.code;
  const titleId = useId();

  // null until the page has loaded, then a random line.
  const [index, setIndex] = useState(null);
  const [settling, setSettling] = useState(false);

  useEffect(() => {
    setIndex(pickFragment(screen.flavour.length));
  }, [screen.flavour.length]);

  async function showAnother() {
    setSettling(true); // a short burst of extra jitter, so the swap feels like part of the effect
    await wait(220);
    setIndex((current) => pickFragment(screen.flavour.length, current ?? -1));
    setSettling(false);
  }

  const flavour = index === null ? "" : fillFlavour(screen.flavour[index], isNotFound ? path : "");

  return (
    <section aria-labelledby={titleId} className="corrupt" data-variant={variant} data-settling={settling || undefined}>
      <div className="cx-layer" aria-hidden="true">
        {FRAGMENTS.map(([x, y, w, h, tone, dx, delay, dur, o], i) => (
          <span
            key={i}
            className={`cx-frag cx-tone-${tone}`}
            style={{ "--x": `${x}%`, "--y": `${y}%`, "--w": `${w}%`, "--h": `${h}%`, "--dx": dx, "--delay": delay, "--dur": dur, "--o": o }}
          />
        ))}
      </div>

      <div className="cx-panel">
        <p className="cx-code font-display" data-text={code} aria-hidden="true">
          {code}
        </p>
        <h1 id={titleId} className="cx-heading font-display">
          <span className="sr-only">Error {code}: </span>
          {screen.heading}
        </h1>
        <p className="cx-body">{screen.body}</p>

        <p className="cx-flavour font-mono" aria-live="polite">
          {flavour}
        </p>

        <div className="cx-actions">
          {isNotFound ? (
            <Link to={screen.cta.to} className="cx-button cx-button--primary">
              {screen.cta.label}
            </Link>
          ) : (
            <>
              <button type="button" onClick={() => window.location.reload()} className="cx-button cx-button--primary">
                {screen.cta.label}
              </button>
              {/* A plain link, not <Link>: after an error the router may not be trustworthy. */}
              <a href="/" className="cx-button cx-button--ghost">
                {screen.homeLabel}
              </a>
            </>
          )}
          {screen.flavour.length > 1 && (
            <button type="button" onClick={showAnother} className="cx-button cx-button--ghost">
              {ERROR_SCREEN.anotherLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
