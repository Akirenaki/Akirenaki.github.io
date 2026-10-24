import { useEffect, useState } from "react";

// GoatCounter's public, read-only counter (enabled in GoatCounter's settings).
// No secret token is involved, so it's safe to call from the browser.
//
// This reads the home page ("/") rather than TOTAL. TOTAL adds up each page's
// own visitor count, so one person browsing four pages adds four to it. The
// home page is where most sessions begin, so its count is a closer (slightly
// conservative) stand-in for the number of visits. GoatCounter counts a
// visitor once per session of up to 8 hours.
const COUNTER_URL = "https://renee.goatcounter.com/counter/%2F.json";

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

  return (
    <p
      className="mt-0.5 text-xs text-ink-soft"
      title="Visitors who opened the home page, each counted once per session"
    >
      {count} visits
    </p>
  );
}
