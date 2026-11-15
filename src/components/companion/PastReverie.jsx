// Ripples of Past Reverie: the passphrase-gated collection at the bottom of
// Heimarmene's Questions tab. Data lives in data/past-reverie.js, the check in
// lib/past-reverie-access.js, and the corruption styles under `.past-reverie`
// in index.css.
//
// The unlocked flag is owned by HeimarmeneCompanion so it survives closing the
// panel and switching tabs. This component only owns the attempt in progress
// (typing, checking, the transition). Nothing is written to storage.
//
// The corruption is decorative: a fixed set of aria-hidden blocks animated
// with CSS alone, never intercepting pointer events, so the form underneath
// stays fully usable.

import { useEffect, useId, useRef, useState } from "react";
import { PAST_REVERIE } from "../../data/past-reverie";
import { MAX_RAW_INPUT_LENGTH, verifyPasscode } from "../../lib/past-reverie-access";

const TITLE = "Ripples of Past Reverie";
const ATTEMPT_MS = 700; // shortest a check may take, so the burst is always seen
const UNLOCK_MS = 1400; // keep in step with --pr-unlock in index.css

// [left, top, width, height, tone, drift, delay, duration, opacity]
// Percentages of the section. `drift` is how far a block jumps sideways.
const UNDER = [
  [0, 0, 100, 14, "ink", "5%", "-0.4s", "3.4s", 0.9],
  [8, 12, 70, 10, "accent", "-7%", "-1.9s", "4.1s", 0.85],
  [0, 22, 55, 18, "blush", "9%", "-0.9s", "5.2s", 0.95],
  [40, 28, 60, 12, "ink", "-5%", "-2.6s", "3.8s", 0.9],
  [0, 44, 100, 9, "deep", "6%", "-1.3s", "4.6s", 0.85],
  [15, 50, 45, 20, "ink", "-8%", "-3.1s", "5.6s", 0.92],
  [55, 55, 45, 16, "blue", "7%", "-0.2s", "4.3s", 0.88],
  [0, 68, 65, 12, "blush", "-6%", "-2.2s", "3.6s", 0.95],
  [30, 76, 70, 10, "ink", "5%", "-1.1s", "4.9s", 0.9],
  [0, 84, 40, 16, "accent", "-9%", "-3.4s", "5.0s", 0.85],
  [50, 88, 50, 12, "blush", "8%", "-0.7s", "3.9s", 0.95],
  [70, 4, 30, 32, "deep", "-4%", "-2.9s", "4.4s", 0.8],
];
const OVER = [
  [4, 9, 46, 6, "accent", "10%", "-1.5s", "3.3s", 0.55],
  [38, 21, 58, 4, "ink", "-12%", "-0.5s", "4.2s", 0.5],
  [0, 40, 30, 8, "blue", "9%", "-2.4s", "3.7s", 0.45],
  [52, 47, 44, 5, "blush", "-10%", "-3.3s", "4.8s", 0.6],
  [10, 58, 62, 7, "ink", "8%", "-1.0s", "3.5s", 0.4],
  [58, 66, 40, 5, "accent", "-11%", "-2.0s", "4.0s", 0.5],
  [0, 79, 52, 6, "deep", "10%", "-0.3s", "5.1s", 0.45],
  [44, 92, 56, 5, "blue", "-9%", "-2.7s", "3.4s", 0.5],
];

function Layer({ name, fragments }) {
  return (
    <div className={`pr-layer pr-layer--${name}`} aria-hidden="true">
      {fragments.map(([x, y, w, h, tone, dx, delay, dur, o], index) => (
        <span
          key={index}
          className={`pr-frag pr-tone-${tone}`}
          style={{ "--x": `${x}%`, "--y": `${y}%`, "--w": `${w}%`, "--h": `${h}%`, "--dx": dx, "--delay": delay, "--dur": dur, "--o": o }}
        />
      ))}
    </div>
  );
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PastReverie({ unlocked, onUnlock, onPick, buttonClassName, className = "" }) {
  // locked | verifying | unlocking | error | open
  const [phase, setPhase] = useState(unlocked ? "open" : "locked");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  const headingRef = useRef(null);
  const focusOnOpen = useRef(false);
  const titleId = useId();
  const inputId = useId();

  const open = unlocked && phase !== "unlocking";
  const state = open ? "open" : phase;
  const working = phase === "verifying" || phase === "unlocking";

  // The reveal runs on a timer so it also works with reduced motion (instantly).
  useEffect(() => {
    if (phase !== "unlocking") return undefined;
    const timer = setTimeout(() => {
      focusOnOpen.current = true;
      setMessage("Corruption quelled. Ripples of Past Reverie are now accessible until the next refresh.");
      setPhase("open");
    }, prefersReducedMotion() ? 0 : UNLOCK_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // The form disappears on success, so hand focus to the heading rather than losing it.
  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false;
      headingRef.current?.focus();
    }
  }, [open]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy.current || working) return;
    busy.current = true;
    setPhase("verifying");
    setMessage("Checking…");
    try {
      const [ok] = await Promise.all([
        verifyPasscode(value, PAST_REVERIE.access),
        wait(prefersReducedMotion() ? 0 : ATTEMPT_MS),
      ]);
      if (ok) {
        setValue("");
        setMessage("Passphrase accepted.");
        setPhase("unlocking");
        onUnlock();
      } else {
        setMessage("That isn’t the passphrase.");
        setPhase("error");
      }
    } catch (error) {
      setMessage(
        error?.code === "unsupported"
          ? "This browser can’t check the passphrase here. Try a current browser over HTTPS."
          : error?.code === "unconfigured"
            ? "This collection hasn’t been set up yet."
            : "Something went wrong while checking. Try again.",
      );
      setPhase("error");
    } finally {
      busy.current = false;
    }
  }

  const { ripples } = PAST_REVERIE;

  return (
    <section aria-labelledby={titleId} className={`past-reverie ${className}`} data-state={state}>
      <hr className="pr-seam" />
      <div className="pr-body">
        {open ? null : (
          <>
            <Layer name="under" fragments={UNDER} />
            <Layer name="over" fragments={OVER} />
          </>
        )}
        <div className="pr-content">
          <h3 id={titleId} ref={headingRef} tabIndex={-1} data-text={TITLE} className="pr-title font-display text-lg font-medium text-ink">
            {TITLE}
          </h3>

          {open ? (
            ripples.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {ripples.map((ripple) => (
                  <li key={ripple.id}>
                    <button type="button" onClick={() => onPick(ripple.id)} className={`${buttonClassName} pr-ripple`}>
                      {ripple.question}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-soft">Nothing has surfaced here yet.</p>
            )
          ) : (
            <form onSubmit={handleSubmit} className="mt-2 space-y-2" autoComplete="off">
              <p className="text-sm text-ink">Corrupted by Irontomb! Enter the passphrase to defeat the corruption!.</p>
              <label htmlFor={inputId} className="block text-sm font-medium text-ink">
                Hint: The English Translation of the first two lines of the song Advaita of the Perpetual World from genshin-impact.fandom.com
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  id={inputId}
                  type="password"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                    if (phase === "error") {
                      setPhase("locked");
                      setMessage("");
                    }
                  }}
                  maxLength={MAX_RAW_INPUT_LENGTH}
                  readOnly={working}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="min-h-11 min-w-0 flex-1 rounded-xl border border-ink/50 bg-surface px-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                />
                <button
                  type="submit"
                  disabled={working}
                  className="min-h-11 rounded-full bg-ink px-5 text-sm font-medium text-paper hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep disabled:opacity-60"
                >
                  Open
                </button>
              </div>
            </form>
          )}

          <p role="status" className="mt-2 min-h-5 text-sm text-ink-soft">
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}
