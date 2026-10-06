import { useEffect, useState } from "react";

// GoatCounter's public, read-only counter (enabled in GoatCounter's settings).
// No secret token is involved, so it's safe to call from the browser.
const COUNTER_URL = "https://renee.goatcounter.com/counter/TOTAL.json";

// Hide the counter until the total reaches this number. Raise it if a small
// figure would look underwhelming; set it to 1 to show anything above zero.
const MIN_TO_SHOW = 1;

export function VisitorCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(COUNTER_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad response"))))
      .then((data) => {
        if (data && data.count != null) setCount(String(data.count));
      })
      .catch(() => {
        // Blocked, offline, or GoatCounter is down: show nothing.
      });

    return () => controller.abort();
  }, []);

  if (!count) return null;

  // GoatCounter may format the number (e.g. with separators), so only use the
  // digits for the threshold check and display the string as received.
  const numeric = Number(count.replace(/\D/g, ""));
  if (!Number.isFinite(numeric) || numeric < MIN_TO_SHOW) return null;

  return <p className="mt-0.5 text-xs text-ink-soft">{count} page views</p>;
}
