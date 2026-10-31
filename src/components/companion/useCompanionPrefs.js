import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_COMPANION_PREFS, normalizeCompanionPrefs } from "../../lib/companion-settings";

// Every place that shows or edits the preferences (the mascot, the settings
// tab, the footer's "bring Heimarmene back" button) has its own copy of this
// hook. They stay in sync through one window event, so no shared provider is
// needed. The values are read after the page loads (never during the static
// build), so the prerendered HTML is identical for every visitor.
const CHANGE_EVENT = "heimarmene-prefs-changed";
const STORAGE_KEY = "heimarmene-prefs-v1";

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeCompanionPrefs(JSON.parse(raw)) : DEFAULT_COMPANION_PREFS;
  } catch {
    return DEFAULT_COMPANION_PREFS;
  }
}

function writeStored(prefs) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Private mode / blocked storage: the choice just lasts for this page view.
  }
}

export function useCompanionPrefs() {
  const [prefs, setPrefs] = useState(DEFAULT_COMPANION_PREFS);
  const [ready, setReady] = useState(false);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  useEffect(() => {
    setPrefs(readStored());
    setReady(true);
    const onChange = (event) => {
      if (event.detail) setPrefs(normalizeCompanionPrefs(event.detail));
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, []);

  const update = useCallback((patch) => {
    const next = normalizeCompanionPrefs({ ...prefsRef.current, ...patch });
    setPrefs(next);
    writeStored(next);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
  }, []);

  return { prefs, ready, update };
}
