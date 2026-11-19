// Heimarmene: a small floating guide for the portfolio. The draggable mascot opens
// a panel with two tabs: Questions (an interactive FAQ with pre-written
// answers that point to the right page, see data/companion.js) and Settings
// (size, rotation style, position, hide). Ported from the Neutrino companion in
// Project Cherenkov, minus everything that needed a server: no chat, no account.
//
// Nothing renders until the page has loaded in the browser, so the static HTML
// is the same for everyone and there is no hydration mismatch. It is hidden
// when printing (including the PDFs the build makes from each essay page), and
// it is mounted in components/Layout.jsx, so it never appears on /print.

import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ManifoldMascot } from "./ManifoldMascot";
import { CompanionTrail } from "./CompanionTrail";
import { useCompanionPrefs } from "./useCompanionPrefs";
import { useCompanionWander } from "./useCompanionWander";
import {
  COMPANION_NAME,
  COMPANION_ROTATIONS,
  COMPANION_SIZES,
  COMPANION_SIZE_PX,
  DEFAULT_COMPANION_PREFS,
  DEFAULT_DRIFT_SPEED,
  DEFAULT_STARFIELD_SPEED,
  MOTION_SPEED_MAX,
  MOTION_SPEED_MIN,
  MOTION_SPEED_STEP,
  STARFIELD_SPEED_MAX,
  STARFIELD_SPEED_MIN,
} from "../../lib/companion-settings";
import {
  DEFAULT_DOCK_POSITION,
  DOCK_MARGIN,
  clampPixels,
  keyboardResize,
  parseStoredPanelSize,
  parseStoredPosition,
  pixelsToPosition,
  placePanel,
  positionToPixels,
  resizeFrame,
  resizeSheetHeight,
} from "../../lib/companion-position";
import { COMPANION_QUESTIONS, GROUPS, QUESTIONS_BY_ID } from "../../data/companion";
import { RIPPLES_BY_ID } from "../../data/past-reverie";
import { PastReverie } from "./PastReverie";

const POSITION_KEY = "heimarmene-position-v1";
const SLOW_KEY = "heimarmene-3d-slow-v1";
const PANEL_SIZE_KEY = "heimarmene-panel-size-v1";
const INTRO_KEY = "heimarmene-intro-dismissed-v1";
// How long the intro bubble stays up, and how much horizontal room it needs
// beside the mascot (its width plus the gap and a margin from the screen edge).
const INTRO_VISIBLE_MS = 6000;
const INTRO_ROOM_PX = 230;

const SIZE_LABELS = { small: "Small", medium: "Medium", large: "Large" };
const ROTATION_LABELS = {
  auto: { label: "Automatic", help: "3D, switching to a lighter flat spin if the device struggles." },
  "3d": { label: "3D", help: "Always rotate the lattice in 3D." },
  flat: { label: "Flat", help: "A simple spin in the plane. Uses the least power." },
};

function readSession(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key, value) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch {
    // Blocked storage: the choice simply lasts until the next render.
  }
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function CloseIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

const linkChip =
  "inline-flex min-h-11 items-center rounded-full border border-accent-deep/40 px-4 text-sm font-medium text-accent-deep transition-colors hover:bg-blush/40";
const questionButton =
  "min-h-11 w-full rounded-xl border border-blush bg-paper px-3 py-2 text-left text-sm text-ink transition-colors hover:border-accent-deep hover:bg-blush/25";

function AnswerLinks({ links, onNavigate }) {
  if (!links?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {links.map((link) =>
        link.to ? (
          <Link key={link.label} to={link.to} onClick={onNavigate} className={linkChip}>
            {link.label}
          </Link>
        ) : (
          <a
            key={link.label}
            href={link.href}
            className={linkChip}
            {...(link.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
          >
            {link.label}
          </a>
        ),
      )}
    </div>
  );
}

function QuestionList({ onPick, reverie }) {
  return (
    <>
      <div className="space-y-5">
        {GROUPS.map((group) => (
          <section key={group.id}>
            <h3 className="mb-2 text-sm font-medium text-ink-soft">{group.label}</h3>
            <ul className="space-y-2">
              {COMPANION_QUESTIONS.filter((q) => q.group === group.id).map((q) => (
                <li key={q.id}>
                  <button type="button" onClick={() => onPick(q.id)} className={questionButton}>
                    {q.question}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <PastReverie
        unlocked={reverie.unlocked}
        onUnlock={reverie.onUnlock}
        onPick={onPick}
        buttonClassName={questionButton}
        className="mt-12"
      />
    </>
  );
}

function QuestionsTab({ closePanel, reverie }) {
  const [history, setHistory] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const scrollRef = useRef(null);
  const latestRef = useRef(null);

  // Bring the newest exchange to the top of the panel, so its question and the
  // start of its answer are both in view (not just the end of a long answer).
  useEffect(() => {
    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    if (showAll) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
    else if (latestRef.current) latestRef.current.scrollIntoView({ block: "start", behavior });
  }, [history, showAll]);

  function pick(id) {
    setHistory((current) => [...current.filter((x) => x !== id), id]);
    setShowAll(false);
  }

  // Ripples resolve only once the collection is unlocked, and have no follow-ups.
  const exchanges = history
    .map((id) => QUESTIONS_BY_ID.get(id) ?? (reverie.unlocked ? RIPPLES_BY_ID.get(id) : undefined))
    .filter(Boolean)
    .map((q) => ({ q, a: q.answer() }));
  const last = exchanges[exchanges.length - 1];
  const followUps = last ? (last.q.related ?? []).filter((id) => !history.includes(id)).slice(0, 3) : [];

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
      <p className="rounded-xl bg-blush/30 p-3 text-sm text-ink">
        Hello, I’m {COMPANION_NAME}. Pick a question and I’ll point you to the right page.
      </p>

      {exchanges.length === 0 ? (
        <QuestionList onPick={pick} reverie={reverie} />
      ) : (
        <div className="space-y-4" aria-live="polite">
          {exchanges.map(({ q, a }, index) => (
            <div key={q.id} ref={index === exchanges.length - 1 ? latestRef : undefined} className="scroll-mt-4 space-y-2">
              <p className="ml-8 rounded-xl rounded-br-sm bg-ink p-3 text-sm text-paper">{q.question}</p>
              <div className="mr-4 rounded-xl rounded-bl-sm border border-blush bg-paper p-3 text-sm text-ink">
                <p className="whitespace-pre-wrap">{a.text}</p>
                <AnswerLinks links={a.links} onNavigate={closePanel} />
              </div>
            </div>
          ))}

          {followUps.length > 0 && !showAll ? (
            <div>
              <h3 className="mb-2 text-sm font-medium text-ink-soft">You could also ask</h3>
              <ul className="space-y-2">
                {followUps.map((id) => (
                  <li key={id}>
                    <button type="button" onClick={() => pick(id)} className={questionButton}>
                      {QUESTIONS_BY_ID.get(id).question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="min-h-11 rounded-full border border-blush px-4 text-sm text-ink-soft hover:border-accent-deep hover:text-accent-deep"
            >
              {showAll ? "Hide all questions" : "All questions"}
            </button>
            <button
              type="button"
              onClick={() => { setHistory([]); setShowAll(false); }}
              className="min-h-11 rounded-full border border-blush px-4 text-sm text-ink-soft hover:border-accent-deep hover:text-accent-deep"
            >
              Start over
            </button>
          </div>

          {showAll ? <QuestionList onPick={pick} reverie={reverie} /> : null}
        </div>
      )}
    </div>
  );
}

function OptionGroup({ legend, name, value, options, onChange }) {
  const helpId = useId();
  const selected = options.find((option) => option.value === value);
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      <div className="grid grid-cols-3 gap-2" aria-describedby={selected?.help ? helpId : undefined}>
        {options.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-blush bg-paper px-2 py-2 text-center text-sm font-medium text-ink hover:bg-blush/25 peer-checked:border-accent-deep peer-checked:bg-blush/45 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-deep">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {selected?.help ? (
        <p id={helpId} className="text-xs text-ink-soft">
          {selected.help}
        </p>
      ) : null}
    </fieldset>
  );
}

function SpeedSlider({ label, help, value, min, max, defaultValue, onChange }) {
  const id = useId();
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-sm font-medium text-ink">
        <label htmlFor={id}>{label}</label>
        <span className="flex items-center gap-2">
          <output htmlFor={id} className="tabular-nums text-ink-soft">{(value / 100).toFixed(1)}×</output>
          <button type="button" onClick={() => onChange(defaultValue)} disabled={value === defaultValue} aria-label={`Reset ${label} speed`} className="min-h-8 rounded-md px-2 text-xs text-accent-deep underline underline-offset-2 disabled:cursor-default disabled:text-ink-soft disabled:no-underline">
            Reset
          </button>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={MOTION_SPEED_STEP}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full cursor-pointer accent-accent-deep"
      />
      <div className="flex justify-between text-xs text-ink-soft"><span>Slower</span><span>Faster</span></div>
      <p className="text-xs text-ink-soft">{help}</p>
    </div>
  );
}

function SettingsTab({ prefs, update, onResetPosition, onResetPanelSize, onResetAll, onHide }) {
  const fieldId = useId();
  const [status, setStatus] = useState("");
  return (
    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
      <OptionGroup
        legend="Size"
        name={`${fieldId}-size`}
        value={prefs.size}
        onChange={(size) => { update({ size }); setStatus(""); }}
        options={COMPANION_SIZES.map((size) => ({ value: size, label: SIZE_LABELS[size] }))}
      />
      <OptionGroup
        legend="Rotation"
        name={`${fieldId}-rotation`}
        value={prefs.rotation}
        onChange={(rotation) => { update({ rotation }); setStatus(""); }}
        options={COMPANION_ROTATIONS.map((rotation) => ({
          value: rotation,
          label: ROTATION_LABELS[rotation].label,
          help: ROTATION_LABELS[rotation].help,
        }))}
      />
      <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          role="switch"
          checked={prefs.ambientMotion}
          onChange={(event) => { update({ ambientMotion: event.target.checked }); setStatus(""); }}
          className="mt-1 h-5 w-5 shrink-0 accent-accent-deep"
        />
        <span>
          <span className="block font-medium">Drift and traces</span>
          <span className="block text-xs text-ink-soft">Let Heimarmene roam the screen with lattice fragments and star-like sparkles. The trail also appears while you drag it.</span>
        </span>
      </label>
      <fieldset className="space-y-4 rounded-xl border border-blush/70 p-3">
        <legend className="px-1 text-sm font-medium text-ink">Motion speed</legend>
        <SpeedSlider
          label="Heimarmene drift"
          help="Adjust how quickly Heimarmene roams across the screen."
          value={prefs.driftSpeed ?? DEFAULT_DRIFT_SPEED}
          min={MOTION_SPEED_MIN}
          max={MOTION_SPEED_MAX}
          defaultValue={DEFAULT_DRIFT_SPEED}
          onChange={(driftSpeed) => { update({ driftSpeed }); setStatus(""); }}
        />
        <SpeedSlider
          label="Stellar field"
          help="Adjust how quickly the background stars drift."
          value={prefs.starfieldSpeed ?? DEFAULT_STARFIELD_SPEED}
          min={STARFIELD_SPEED_MIN}
          max={STARFIELD_SPEED_MAX}
          defaultValue={DEFAULT_STARFIELD_SPEED}
          onChange={(starfieldSpeed) => { update({ starfieldSpeed }); setStatus(""); }}
        />
      </fieldset>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { onResetAll(); setStatus("All companion settings reset."); }}
            className="min-h-11 rounded-lg border border-accent-deep/40 px-4 text-sm font-medium text-accent-deep hover:bg-blush/25"
          >
            Reset all Heimarmene settings
          </button>
          <button
            type="button"
            onClick={() => { onResetPosition(); setStatus("Position reset."); }}
            className="min-h-11 rounded-lg border border-blush px-4 text-sm font-medium text-ink hover:border-accent-deep hover:bg-blush/25"
          >
            Reset position
          </button>
          {onResetPanelSize ? (
            <button
              type="button"
              onClick={() => { onResetPanelSize(); setStatus("Panel size reset."); }}
              className="min-h-11 rounded-lg border border-blush px-4 text-sm font-medium text-ink hover:border-accent-deep hover:bg-blush/25"
            >
              Reset panel size
            </button>
          ) : null}
          <button
            type="button"
            onClick={onHide}
            className="min-h-11 rounded-lg border border-blush px-4 text-sm font-medium text-ink hover:border-accent-deep hover:bg-blush/25"
          >
            Hide {COMPANION_NAME}
          </button>
        </div>
        <p className="text-xs text-ink-soft">
          Hiding is remembered on this device. A small button in the footer, beside the email and LinkedIn links, brings {COMPANION_NAME} back.
        </p>
        <p role="status" className="min-h-5 text-sm text-ink-soft">{status}</p>
      </div>
    </div>
  );
}

function tabClass(active) {
  return [
    "inline-flex min-h-11 items-center justify-center rounded-lg px-2 text-sm font-medium",
    active ? "bg-blush/45 text-ink" : "text-ink-soft hover:bg-blush/25",
  ].join(" ");
}

function CompanionPanel({ prefs, update, close, onResetPosition, onResetPanelSize, onResetAll, onHide, reverie }) {
  const [tab, setTab] = useState("questions");
  return (
    <div className="flex h-full flex-col bg-surface text-ink">
      <header className="flex items-center justify-between border-b border-blush/70 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <ManifoldMascot size={36} lite />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-medium leading-tight">{COMPANION_NAME}</p>
            <p className="text-xs text-ink-soft">Interactive FAQ - That Which Has Been Allotted</p>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label={`Close ${COMPANION_NAME}`}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-blush/30"
        >
          <CloseIcon />
        </button>
      </header>

      <nav aria-label={`${COMPANION_NAME} sections`} className="grid grid-cols-2 gap-1 border-b border-blush/70 p-2">
        <button type="button" onClick={() => setTab("questions")} aria-pressed={tab === "questions"} className={tabClass(tab === "questions")}>
          Questions
        </button>
        <button type="button" onClick={() => setTab("settings")} aria-pressed={tab === "settings"} className={tabClass(tab === "settings")}>
          Settings
        </button>
      </nav>

      {/* Both tabs stay mounted; the inactive one is display:none. Unmounting the
          Questions tab on every switch threw away the whole conversation. */}
      <div className={tab === "questions" ? "contents" : "hidden"}>
        <QuestionsTab closePanel={close} reverie={reverie} />
      </div>
      {tab === "settings" ? (
        <SettingsTab prefs={prefs} update={update} onResetPosition={onResetPosition} onResetPanelSize={onResetPanelSize} onResetAll={onResetAll} onHide={onHide} />
      ) : null}
    </div>
  );
}

export function HeimarmeneCompanion() {
  const { prefs, ready, update } = useCompanionPrefs();
  const location = useLocation();
  const panelId = useId();
  const helpId = useId();

  const [open, setOpen] = useState(false);
  const [pageMood, setPageMood] = useState("idle");
  const [introVisible, setIntroVisible] = useState(false);
  // Which side of the mascot the intro bubble sits on. "left" puts the bubble
  // to the mascot's left (the natural choice for the default bottom-right corner).
  const [introSide, setIntroSide] = useState("left");
  const [resetMotion, setResetMotion] = useState(false);
  const [openAnchor, setOpenAnchor] = useState(null);
  const [driftPaused, setDriftPaused] = useState(false);
  const [fellBack, setFellBack] = useState(false);
  const [position, setPosition] = useState(DEFAULT_DOCK_POSITION);
  const [viewport, setViewport] = useState({ width: 1024, height: 768 });
  const [dragPx, setDragPx] = useState(null);
  // null = the default panel size. liveFrame is the panel while an edge is being dragged.
  const [panelSize, setPanelSize] = useState(null);
  const [liveFrame, setLiveFrame] = useState(null);
  // Held here, above the conditionally mounted panel, so the collection stays
  // open while Heimarmene is closed and reopened. Memory only: a reload relocks it.
  const [reverieUnlocked, setReverieUnlocked] = useState(false);

  const dockRef = useRef(null);
  const wanderRef = useRef(null);
  const panelRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const suppressClickUntil = useRef(0);
  const restoreFocus = useRef(false);
  const driftTimer = useRef(null);
  const previousPath = useRef(location.pathname);

  const size = COMPANION_SIZE_PX[prefs.size];
  const showDock = ready && prefs.enabled;
  const use3d = prefs.rotation === "3d" || (prefs.rotation === "auto" && !fellBack);

  useEffect(() => {
    try {
      const stored = parseStoredPosition(window.localStorage.getItem(POSITION_KEY));
      if (stored) setPosition(stored);
      setPanelSize(parseStoredPanelSize(window.localStorage.getItem(PANEL_SIZE_KEY)));
    } catch {
      // Storage blocked: the default corner is used.
    }
    // The intro bubble shows ONCE. The dismissal is stored when it is first
    // shown (not only when it is clicked), and it hides itself after
    // INTRO_VISIBLE_MS, so a roaming mascot never carries a speech bubble over
    // the text a first-time visitor is reading.
    try {
      const firstView = window.localStorage.getItem(INTRO_KEY) !== "1";
      setIntroVisible(firstView);
      if (firstView) window.localStorage.setItem(INTRO_KEY, "1");
    } catch { /* Keep the intro optional when storage is unavailable. */ }
    setFellBack(readSession(SLOW_KEY) === "1");
    const measure = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!introVisible) return undefined;
    const timer = window.setTimeout(() => setIntroVisible(false), INTRO_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [introVisible]);

  // The mascot roams, so the side with room for the bubble changes. Look at where
  // it is on screen (not at its resting spot) and only switch sides once the
  // current side runs out of room, so the bubble does not flip back and forth.
  useEffect(() => {
    if (!introVisible || open) return undefined;
    const place = () => {
      const rect = dockRef.current?.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) return;
      const roomLeft = rect.left;
      const roomRight = window.innerWidth - rect.right;
      setIntroSide((current) => {
        if ((current === "left" ? roomLeft : roomRight) >= INTRO_ROOM_PX) return current;
        return roomLeft >= roomRight ? "left" : "right";
      });
    };
    place();
    const interval = window.setInterval(place, 200);
    return () => window.clearInterval(interval);
  }, [introVisible, open]);

  useEffect(() => {
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;
    setPageMood("curious");
    const timeout = window.setTimeout(() => setPageMood("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  // Choosing a rotation other than Automatic clears the "3D was too slow" note,
  // so choosing Automatic again gives 3D another chance.
  useEffect(() => {
    if (prefs.rotation === "auto") return;
    setFellBack(false);
    writeSession(SLOW_KEY, null);
  }, [prefs.rotation]);

  useEffect(() => {
    if (!showDock) setOpen(false);
  }, [showDock]);

  useEffect(() => {
    if (!open) setLiveFrame(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (driftTimer.current) window.clearTimeout(driftTimer.current);
    driftTimer.current = null;
  }, [open]);

  useEffect(() => () => {
    if (driftTimer.current) window.clearTimeout(driftTimer.current);
  }, []);

  // Move focus into the panel when it opens, and back to the mascot when it closes.
  useEffect(() => {
    if (open) panelRef.current?.focus();
    else if (restoreFocus.current) {
      restoreFocus.current = false;
      dockRef.current?.focus();
    }
  }, [open]);

  function closePanel() {
    restoreFocus.current = true;
    setOpen(false);
    setOpenAnchor(null);
    pauseDriftForCooldown();
  }

  function pauseDriftForCooldown() {
    setDriftPaused(true);
    if (driftTimer.current) window.clearTimeout(driftTimer.current);
    driftTimer.current = window.setTimeout(() => {
      driftTimer.current = null;
      if (dragRef.current) return;
      setDriftPaused(false);
    }, 5000);
  }

  function savePosition(next) {
    setPosition(next);
    try {
      window.localStorage.setItem(POSITION_KEY, JSON.stringify(next));
    } catch {
      // Not persisted; still applies for this page view.
    }
  }

  function hide() {
    setOpen(false);
    update({ enabled: false });
  }

  function markSlow() {
    writeSession(SLOW_KEY, "1");
    setFellBack(true);
  }

  function savePanelSize(next) {
    setPanelSize(next);
    try {
      if (next) window.localStorage.setItem(PANEL_SIZE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(PANEL_SIZE_KEY);
    } catch {
      // Not persisted; the size still applies for this page view.
    }
  }

  function resetDockMotion() {
    setResetMotion(true);
    window.requestAnimationFrame(() => setResetMotion(false));
  }

  function resetPosition() {
    const next = positionToPixels(DEFAULT_DOCK_POSITION, viewport, size);
    savePosition(DEFAULT_DOCK_POSITION);
    if (open) setOpenAnchor(next);
    resetDockMotion();
  }

  function resetAll() {
    update(DEFAULT_COMPANION_PREFS);
    savePosition(DEFAULT_DOCK_POSITION);
    savePanelSize(null);
    try { window.localStorage.removeItem(INTRO_KEY); } catch { /* Defaults still apply for this visit. */ }
    setIntroVisible(true);
    writeSession(SLOW_KEY, null);
    setFellBack(false);
    setDriftPaused(true);
    if (driftTimer.current) window.clearTimeout(driftTimer.current);
    driftTimer.current = window.setTimeout(() => {
      driftTimer.current = null;
      setDriftPaused(false);
    }, 5000);
    const next = positionToPixels(DEFAULT_DOCK_POSITION, viewport, COMPANION_SIZE_PX[DEFAULT_COMPANION_PREFS.size]);
    if (open) setOpenAnchor(next);
    resetDockMotion();
  }

  // `frame` is the panel as it is now. In the phone sheet only the height can
  // change, by dragging the top edge.
  function onResizeDown(event, edges, frame) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, start: frame, edges, last: frame };
    setLiveFrame(frame);
  }

  function onResizeMove(event) {
    const resize = resizeRef.current;
    if (!resize || resize.id !== event.pointerId) return;
    const dx = event.clientX - resize.startX;
    const dy = event.clientY - resize.startY;
    resize.last = resize.edges.includes("sheet")
      ? { ...resize.start, height: resizeSheetHeight(resize.start.height, dy, viewport) }
      : resizeFrame(resize.start, resize.edges, dx, dy, viewport);
    setLiveFrame(resize.last);
  }

  function onResizeUp(event, commit) {
    const resize = resizeRef.current;
    if (!resize || resize.id !== event.pointerId) return;
    resizeRef.current = null;
    setLiveFrame(null);
    // A click on a handle (or the first half of a double-click) must not freeze
    // the current, possibly screen-clamped, size as the visitor's chosen size.
    const changed = resize.last.width !== resize.start.width || resize.last.height !== resize.start.height;
    if (!commit || !changed) return;
    // The sheet keeps the stored width; only its height was dragged.
    savePanelSize(resize.edges.includes("sheet")
      ? { width: panelSize?.width ?? 384, height: resize.last.height }
      : { width: resize.last.width, height: resize.last.height });
  }

  function onResizeKey(event, edge, frame) {
    if (edge === "sheet") {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      const step = event.shiftKey ? 96 : 24;
      const height = resizeSheetHeight(frame.height, event.key === "ArrowUp" ? -step : step, viewport);
      savePanelSize({ width: panelSize?.width ?? 384, height });
      return;
    }
    const next = keyboardResize(frame, edge, event.key, event.shiftKey, viewport);
    if (!next) return;
    event.preventDefault();
    savePanelSize({ width: next.width, height: next.height });
  }

  const basePx = positionToPixels(position, viewport, size);
  const px = dragPx ?? basePx;

  // Random wandering: offsets from the resting spot that keep it on screen.
  useCompanionWander({
    ref: wanderRef,
    enabled: showDock && prefs.ambientMotion && !dragPx && !resetMotion,
    paused: driftPaused || open,
    speed: prefs.driftSpeed ?? DEFAULT_DRIFT_SPEED,
    bounds: {
      minX: DOCK_MARGIN - basePx.left,
      maxX: viewport.width - size - DOCK_MARGIN - basePx.left,
      minY: DOCK_MARGIN - basePx.top,
      maxY: viewport.height - size - DOCK_MARGIN - basePx.top,
    },
    resetKey: [Math.round(basePx.left), Math.round(basePx.top), viewport.width, viewport.height, size].join("|"),
  });

  function onPointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pauseDriftForCooldown();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const visualPosition = { left: rect.left, top: rect.top };
    // dragPx stays null until the pointer has travelled past the threshold (see
    // onPointerMove). Setting it here, as this used to, made every plain click
    // swap the dock from its on-screen spot to its resting spot (basePx) on
    // release, so a mascot that had wandered away jumped back to the corner.
    dragRef.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, ...visualPosition, moved: false, last: visualPosition };
  }

  function onPointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    // A small threshold keeps an ordinary click from nudging the mascot.
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    drag.moved = true;
    pauseDriftForCooldown();
    drag.last = clampPixels(drag.left + dx, drag.top + dy, viewport, size);
    setDragPx(drag.last);
  }

  function endDrag(event, commit) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) {
      pauseDriftForCooldown();
      return;
    }
    pauseDriftForCooldown();
    // The browser still fires a click after a drag; ignore it.
    suppressClickUntil.current = performance.now() + 300;
    if (commit) {
      savePosition(pixelsToPosition(drag.last.left, drag.last.top, viewport, size));
      if (open) setOpenAnchor({ left: drag.last.left, top: drag.last.top });
      resetDockMotion();
    }
    setDragPx(null);
  }

  function onKeyDown(event) {
    pauseDriftForCooldown();
    const step = event.shiftKey ? 64 : 16;
    const delta = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = delta[event.key];
    if (!move) return;
    event.preventDefault();
    const rect = dockRef.current?.getBoundingClientRect();
    const next = clampPixels((rect?.left ?? basePx.left) + move[0], (rect?.top ?? basePx.top) + move[1], viewport, size);
    savePosition(pixelsToPosition(next.left, next.top, viewport, size));
    if (open) setOpenAnchor(next);
    resetDockMotion();
  }

  function onClick() {
    if (performance.now() < suppressClickUntil.current) return;
    if (introVisible) {
      setIntroVisible(false);
      try { window.localStorage.setItem(INTRO_KEY, "1"); } catch { /* The prompt can still be dismissed for this visit. */ }
    }
    pauseDriftForCooldown();
    if (open) closePanel();
    else {
      const rect = dockRef.current?.getBoundingClientRect();
      if (rect) setOpenAnchor({ left: rect.left, top: rect.top });
      setOpen(true);
    }
  }

  if (!showDock) return null;

  const panelAnchor = dragPx ?? openAnchor ?? px;
  const placement = open ? placePanel({ ...panelAnchor, size }, viewport, panelSize ?? {}) : null;
  const sheetOpen = placement?.mode === "sheet";
  // The frame being shown: the live drag if there is one, otherwise the placement.
  const frame = placement?.mode === "floating" ? (liveFrame ?? placement) : null;
  const sheetHeight = sheetOpen ? (liveFrame?.height ?? placement.height) : null;

  return (
    <div className="print:hidden">
      <CompanionTrail
        targetRef={dockRef}
        enabled={prefs.ambientMotion}
        active={!open && (!driftPaused || Boolean(dragPx))}
      />
      {placement ? (
        <section
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={COMPANION_NAME}
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              closePanel();
            }
          }}
          className={sheetOpen ? "fixed inset-x-2 bottom-2 z-[60] focus:outline-none" : "fixed z-[60] focus:outline-none"}
          style={
            frame
              ? { left: frame.left, top: frame.top, width: frame.width, height: frame.height }
              : { height: sheetHeight }
          }
        >
          <div className="h-full overflow-hidden rounded-2xl border border-blush bg-surface shadow-2xl">
            <CompanionPanel
              prefs={prefs}
              update={update}
              close={closePanel}
              onResetPosition={resetPosition}
              onResetPanelSize={() => savePanelSize(null)}
              onResetAll={resetAll}
              onHide={hide}
              reverie={{ unlocked: reverieUnlocked, onUnlock: () => setReverieUnlocked(true) }}
            />
          </div>
          <ResizeHandles
            placement={placement}
            frame={frame ?? { left: 0, top: 0, width: viewport.width - 16, height: sheetHeight }}
            viewport={viewport}
            onDown={onResizeDown}
            onMove={onResizeMove}
            onUp={onResizeUp}
            onKey={onResizeKey}
            onReset={() => savePanelSize(null)}
          />
        </section>
      ) : null}

      <div
        ref={wanderRef}
        role="region"
        aria-label={COMPANION_NAME}
        className="heimarmene-dock group fixed z-[60]"
        data-dragging={dragPx ? "true" : "false"}
        data-ambient={prefs.ambientMotion ? "true" : "false"}
        data-paused={driftPaused ? "true" : "false"}
        data-open={open ? "true" : "false"}
        data-motion-reset={resetMotion ? "true" : "false"}
        hidden={sheetOpen}
        style={{ left: px.left, top: px.top, width: size, height: size }}
      >
        {introVisible && !open ? (
          <div className={`absolute top-1/2 z-10 -translate-y-1/2 ${introSide === "left" ? "right-full mr-3" : "left-full ml-3"}`}>
            <button type="button" onClick={onClick} className="whitespace-nowrap rounded-full border border-blush bg-surface px-3 py-2 text-xs font-medium text-ink shadow-lg">
              Ask about this portfolio
            </button>
            <button
              type="button"
              onClick={() => { setIntroVisible(false); try { window.localStorage.setItem(INTRO_KEY, "1"); } catch { /* The prompt can still be dismissed for this visit. */ } }}
              aria-label="Dismiss introduction"
              className="heimarmene-focus absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-blush bg-surface text-ink shadow"
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </div>
        ) : null}
        <button
          ref={dockRef}
          type="button"
          data-heimarmene-dock
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-controls={open ? panelId : undefined}
          aria-describedby={helpId}
          aria-label={`${COMPANION_NAME}: ${open ? "close the questions panel" : "open the questions panel"}`}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(event) => endDrag(event, true)}
          onPointerCancel={(event) => endDrag(event, false)}
          onFocus={pauseDriftForCooldown}
          onBlur={pauseDriftForCooldown}
          className="heimarmene-plate heimarmene-focus block h-full w-full cursor-grab rounded-full shadow-xl active:cursor-grabbing"
        >
          <ManifoldMascot
            size={size}
            mood={open ? "curious" : pageMood}
            rotation={use3d ? "3d" : "flat"}
            monitor={prefs.rotation === "auto" && use3d}
            onSlow={markSlow}
          />
        </button>
        <span id={helpId} className="sr-only">
          Drag to move, or focus and use the arrow keys (Shift for bigger steps). Press Enter to open.
        </span>
        <button
          type="button"
          onClick={hide}
          aria-label={`Hide ${COMPANION_NAME}`}
          title={`Hide ${COMPANION_NAME}`}
          className="heimarmene-focus pointer-events-none absolute -right-3 -top-3 flex [@media(hover:none)]:hidden h-6 w-6 items-center justify-center rounded-full border border-blush bg-surface text-ink opacity-0 shadow transition-opacity before:absolute before:-right-2.5 before:-top-2.5 before:bottom-0 before:left-0 before:content-[''] focus-visible:pointer-events-auto focus-visible:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// Shown in the footer, beside the email and LinkedIn links, only while Heimarmene
// is hidden. Clicking it brings Heimarmene back.
export function HeimarmeneFooterButton() {
  const { prefs, ready, update } = useCompanionPrefs();
  if (!ready || prefs.enabled) return null;

  function bringBack() {
    update({ enabled: true });
    // The footer button disappears, so hand focus to the returning mascot.
    window.setTimeout(() => document.querySelector("[data-heimarmene-dock]")?.focus(), 60);
  }

  return (
    <button
      type="button"
      onClick={bringBack}
      aria-label={`Bring ${COMPANION_NAME} back`}
      title={`Bring ${COMPANION_NAME} back`}
      className="heimarmene-focus flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-blush transition-colors hover:border-accent-deep"
    >
      <ManifoldMascot size={42} lite />
    </button>
  );
}

// The drag handles of the panel. Only the two edges that face away from the
// mascot (and the corner between them) can be dragged, because the other two
// are attached to it. They sit just outside the panel so they never cover its
// scrollbar or buttons. Each edge is also a keyboard-operable separator: focus
// it and use the arrow keys. On a phone the bottom sheet has only a top handle.
function ResizeHandles({ placement, frame, viewport, onDown, onMove, onUp, onKey, onReset }) {
  const shared =
    "absolute z-10 touch-none rounded-full hover:bg-ink/10 focus-visible:bg-ink/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-deep";
  const bind = (edges) => ({
    onPointerDown: (event) => onDown(event, edges, frame),
    onPointerMove: onMove,
    onPointerUp: (event) => onUp(event, true),
    onPointerCancel: (event) => onUp(event, false),
    onDoubleClick: onReset,
    title: "Drag to resize. Double-click to reset.",
  });

  if (placement.mode === "sheet") {
    return (
      <div
        role="separator"
        tabIndex={0}
        aria-orientation="horizontal"
        aria-label="Panel height"
        aria-valuemin={320}
        aria-valuemax={Math.max(320, viewport.height - 16)}
        aria-valuenow={Math.round(frame.height)}
        onKeyDown={(event) => onKey(event, "sheet", frame)}
        {...bind(["sheet"])}
        className={`${shared} inset-x-10 -top-3 h-3 cursor-ns-resize`}
      />
    );
  }

  const { freeHorizontal, freeVertical } = placement;
  const side = freeHorizontal === "left" ? "-left-3" : "-right-3";
  const end = freeVertical === "top" ? "-top-3" : "-bottom-3";
  // Top-left and bottom-right corners drag along the "\\" diagonal, the others along "/".
  const backslash = (freeHorizontal === "left") === (freeVertical === "top");
  return (
    <>
      <div
        role="separator"
        tabIndex={0}
        aria-orientation="vertical"
        aria-label="Panel width"
        aria-valuemin={300}
        aria-valuemax={Math.max(300, viewport.width - 32)}
        aria-valuenow={Math.round(frame.width)}
        onKeyDown={(event) => onKey(event, freeHorizontal, frame)}
        {...bind([freeHorizontal])}
        className={`${shared} ${side} inset-y-6 w-3 cursor-ew-resize`}
      />
      <div
        role="separator"
        tabIndex={0}
        aria-orientation="horizontal"
        aria-label="Panel height"
        aria-valuemin={320}
        aria-valuemax={Math.max(320, viewport.height - 32)}
        aria-valuenow={Math.round(frame.height)}
        onKeyDown={(event) => onKey(event, freeVertical, frame)}
        {...bind([freeVertical])}
        className={`${shared} ${end} inset-x-6 h-3 cursor-ns-resize`}
      />
      <div
        aria-hidden="true"
        {...bind([freeHorizontal, freeVertical])}
        className={`${shared} ${side} ${end} flex h-6 w-6 items-center justify-center text-ink-soft ${backslash ? "cursor-nwse-resize" : "cursor-nesw-resize"}`}
      >
        <svg viewBox="0 0 16 16" className={`h-4 w-4 ${backslash ? "" : "-scale-x-100"}`} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M5 13L13 5M9 13l4-4" />
        </svg>
      </div>
    </>
  );
}
