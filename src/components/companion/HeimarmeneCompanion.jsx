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
import { Link } from "react-router";
import { ManifoldMascot } from "./ManifoldMascot";
import { useCompanionPrefs } from "./useCompanionPrefs";
import {
  COMPANION_NAME,
  COMPANION_ROTATIONS,
  COMPANION_SIZES,
  COMPANION_SIZE_PX,
} from "../../lib/companion-settings";
import {
  DEFAULT_DOCK_POSITION,
  clampPixels,
  parseStoredPosition,
  pixelsToPosition,
  placePanel,
  positionToPixels,
} from "../../lib/companion-position";
import { COMPANION_QUESTIONS, GROUPS, QUESTIONS_BY_ID } from "../../data/companion";

const POSITION_KEY = "heimarmene-position-v1";
const SLOW_KEY = "heimarmene-3d-slow-v1";
const PANEL_SIZE_KEY = "heimarmene-panel-size-v1";
const DEFAULT_PANEL_SIZE = { width: 384, height: 640 };
const MIN_PANEL_SIZE = { width: 280, height: 320 };

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

function parsePanelSize(raw) {
  if (!raw) return DEFAULT_PANEL_SIZE;
  try {
    const value = JSON.parse(raw);
    if (!Number.isFinite(value.width) || !Number.isFinite(value.height)) return DEFAULT_PANEL_SIZE;
    return {
      width: Math.max(MIN_PANEL_SIZE.width, value.width),
      height: Math.max(MIN_PANEL_SIZE.height, value.height),
    };
  } catch {
    return DEFAULT_PANEL_SIZE;
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

function QuestionList({ onPick }) {
  return (
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
  );
}

function QuestionsTab({ closePanel }) {
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

  const exchanges = history.map((id) => {
    const q = QUESTIONS_BY_ID.get(id);
    return { q, a: q.answer() };
  });
  const last = exchanges[exchanges.length - 1];
  const followUps = last ? last.q.related.filter((id) => !history.includes(id)).slice(0, 3) : [];

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
      <p className="rounded-xl bg-blush/30 p-3 text-sm text-ink">
        Hello, I’m {COMPANION_NAME}. Pick a question and I’ll point you to the right page.
      </p>

      {exchanges.length === 0 ? (
        <QuestionList onPick={pick} />
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

          {showAll ? <QuestionList onPick={pick} /> : null}
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

function SettingsTab({ prefs, update, onResetPosition, onHide }) {
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
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { onResetPosition(); setStatus("Position reset."); }}
            className="min-h-11 rounded-lg border border-blush px-4 text-sm font-medium text-ink hover:border-accent-deep hover:bg-blush/25"
          >
            Reset position
          </button>
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

function CompanionPanel({ prefs, update, close, onResetPosition, onHide }) {
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

      {tab === "questions" ? (
        <QuestionsTab closePanel={close} />
      ) : (
        <SettingsTab prefs={prefs} update={update} onResetPosition={onResetPosition} onHide={onHide} />
      )}
    </div>
  );
}

export function HeimarmeneCompanion() {
  const { prefs, ready, update } = useCompanionPrefs();
  const panelId = useId();
  const helpId = useId();

  const [open, setOpen] = useState(false);
  const [fellBack, setFellBack] = useState(false);
  const [position, setPosition] = useState(DEFAULT_DOCK_POSITION);
  const [viewport, setViewport] = useState({ width: 1024, height: 768 });
  const [dragPx, setDragPx] = useState(null);
  const [panelSize, setPanelSize] = useState(DEFAULT_PANEL_SIZE);
  const [panelFrame, setPanelFrame] = useState(null);

  const dockRef = useRef(null);
  const panelRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const suppressClickUntil = useRef(0);
  const restoreFocus = useRef(false);

  const size = COMPANION_SIZE_PX[prefs.size];
  const showDock = ready && prefs.enabled;
  const use3d = prefs.rotation === "3d" || (prefs.rotation === "auto" && !fellBack);

  useEffect(() => {
    try {
      const stored = parseStoredPosition(window.localStorage.getItem(POSITION_KEY));
      if (stored) setPosition(stored);
      setPanelSize(parsePanelSize(window.localStorage.getItem(PANEL_SIZE_KEY)));
    } catch {
      // Storage blocked: the default corner is used.
    }
    setFellBack(readSession(SLOW_KEY) === "1");
    const measure = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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
    if (!open) setPanelFrame(null);
  }, [open]);

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

  function onResizePointerDown(event, edges) {
    if (!placement) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const frame =
      placement.mode === "floating"
        ? { mode: "floating", left: placement.left, top: placement.top, width: placement.width, height: placement.height }
        : { mode: "sheet", left: 8, top: viewport.height - placement.height - 8, width: viewport.width - 16, height: placement.height };
    resizeRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startFrame: frame,
      edges,
    };
    setPanelFrame(frame);
  }

  function onResizePointerMove(event) {
    const resize = resizeRef.current;
    if (!resize || resize.id !== event.pointerId) return;
    const dx = event.clientX - resize.startX;
    const dy = event.clientY - resize.startY;
    const { left, top, width, height } = resize.startFrame;
    const resizingLeft = resize.edges.includes("left");
    const resizingTop = resize.edges.includes("top");
    const nextLeft = resizingLeft ? left + dx : left;
    const nextTop = resizingTop ? top + dy : top;
    const next = {
      left: nextLeft,
      top: nextTop,
      width: Math.min(viewport.width - 16, width + (resizingLeft ? -dx : dx)),
      height: Math.min(viewport.height - 16, height + (resizingTop ? -dy : dy)),
    };
    resize.lastFrame = {
      left: resizingLeft && next.width >= MIN_PANEL_SIZE.width ? next.left : left,
      top: resizingTop && next.height >= MIN_PANEL_SIZE.height ? next.top : top,
      width: Math.max(MIN_PANEL_SIZE.width, next.width),
      height: Math.max(MIN_PANEL_SIZE.height, next.height),
    };
    setPanelFrame(resize.lastFrame);
  }

  function onResizePointerUp(event) {
    const resize = resizeRef.current;
    if (!resize || resize.id !== event.pointerId) return;
    resizeRef.current = null;
    const frame = resize.lastFrame ?? resize.startFrame;
    const next = { width: frame.width, height: frame.height };
    setPanelFrame(null);
    setPanelSize(next);
    try {
      window.localStorage.setItem(PANEL_SIZE_KEY, JSON.stringify(next));
    } catch {
      // Not persisted; the resized dimensions still apply for this page view.
    }
  }

  const basePx = positionToPixels(position, viewport, size);
  const px = dragPx ?? basePx;

  function onPointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, left: basePx.left, top: basePx.top, moved: false, last: basePx };
  }

  function onPointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    // A small threshold keeps an ordinary click from nudging the mascot.
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    drag.moved = true;
    drag.last = clampPixels(drag.left + dx, drag.top + dy, viewport, size);
    setDragPx(drag.last);
  }

  function endDrag(event, commit) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) return;
    // The browser still fires a click after a drag; ignore it.
    suppressClickUntil.current = performance.now() + 300;
    if (commit) savePosition(pixelsToPosition(drag.last.left, drag.last.top, viewport, size));
    setDragPx(null);
  }

  function onKeyDown(event) {
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
    const next = clampPixels(basePx.left + move[0], basePx.top + move[1], viewport, size);
    savePosition(pixelsToPosition(next.left, next.top, viewport, size));
  }

  function onClick() {
    if (performance.now() < suppressClickUntil.current) return;
    if (open) closePanel();
    else setOpen(true);
  }

  if (!showDock) return null;

  const calculatedPlacement = open ? placePanel({ left: px.left, top: px.top, size }, viewport, panelSize) : null;
  const placement = panelFrame ?? calculatedPlacement;
  const sheetOpen = placement?.mode === "sheet";

  return (
    <div className="print:hidden">
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
          className={
            sheetOpen
              ? "fixed inset-x-2 bottom-2 z-[60] overflow-hidden rounded-2xl border border-blush bg-surface shadow-2xl focus:outline-none"
              : "fixed z-[60] overflow-hidden rounded-2xl border border-blush bg-surface shadow-2xl focus:outline-none"
          }
          style={
            placement.mode === "floating"
              ? { left: placement.left, top: placement.top, width: placement.width, height: placement.height }
              : { height: placement.height, left: placement.left, width: placement.width, bottom: 8 }
          }
        >
          <CompanionPanel
            prefs={prefs}
            update={update}
            close={closePanel}
            onResetPosition={() => savePosition(DEFAULT_DOCK_POSITION)}
            onHide={hide}
          />
          {[
            ["top", "absolute inset-x-3 top-0 h-3 cursor-row-resize"],
            ["right", "absolute inset-y-3 right-0 w-3 cursor-col-resize"],
            ["bottom", "absolute inset-x-3 bottom-0 h-3 cursor-row-resize"],
            ["left", "absolute inset-y-3 left-0 w-3 cursor-col-resize"],
            ["top right", "absolute right-0 top-0 h-5 w-5 cursor-ne-resize"],
            ["bottom right", "absolute bottom-0 right-0 h-5 w-5 cursor-se-resize"],
            ["bottom left", "absolute bottom-0 left-0 h-5 w-5 cursor-sw-resize"],
            ["top left", "absolute left-0 top-0 h-5 w-5 cursor-nw-resize"],
          ].map(([edges, className]) => (
            <div
              key={edges}
              role="separator"
              aria-label={`Resize panel from ${edges.replace(" ", " and ")} edge`}
              title="Drag to resize"
              onPointerDown={(event) => onResizePointerDown(event, edges.split(" "))}
              onPointerMove={onResizePointerMove}
              onPointerUp={onResizePointerUp}
              onPointerCancel={onResizePointerUp}
              className={`${className} z-10 touch-none`}
            />
          ))}
        </section>
      ) : null}

      <div
        role="region"
        aria-label={COMPANION_NAME}
        className="heimarmene-dock group fixed z-[60]"
        data-dragging={dragPx ? "true" : "false"}
        hidden={sheetOpen}
        style={{ left: px.left, top: px.top, width: size, height: size }}
      >
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
          className="heimarmene-plate heimarmene-focus block h-full w-full cursor-grab rounded-full shadow-xl active:cursor-grabbing"
        >
          <ManifoldMascot
            size={size}
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
          className="heimarmene-focus absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-blush bg-surface text-ink opacity-0 shadow transition-opacity before:absolute before:-inset-2.5 before:content-[''] focus-visible:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
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
