// Every image/video slot on the site goes through this component.
// src is left pointing at a real (but currently missing) path under /public/assets -
// swap the file in, nothing else needs to change. Width/height are always set
// explicitly so the layout doesn't jump once real media lands (CLS).
//
// If the file at `src` is missing (as it will be until you add assets), this
// renders a labelled placeholder box at the exact same dimensions instead of
// a broken-image icon - just for a cleaner dev preview.

import { useState } from "react";

export function PlaceholderImage({ src, alt, aspect = "16/9", label, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-blush bg-blush/20 text-center text-sm text-ink-soft ${className}`}
        style={{ aspectRatio: aspect }}
        role="img"
        aria-label={alt}
      >
        <span className="px-4">{label || alt || "Image placeholder"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ aspectRatio: aspect }}
      className={`w-full object-cover ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function PlaceholderVideo({ src, aspect = "16/9", label, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-blush bg-blush/20 text-center text-sm text-ink-soft ${className}`}
        style={{ aspectRatio: aspect }}
      >
        <span className="px-4">{label || "Video placeholder"}</span>
      </div>
    );
  }

  return (
    <video
      src={src}
      style={{ aspectRatio: aspect }}
      className={`w-full object-cover ${className}`}
      controls
      onError={() => setFailed(true)}
    />
  );
}
