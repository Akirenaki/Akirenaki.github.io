// Every image/video slot on the site goes through this component.
// src is left pointing at a real (but currently missing) path under /public/assets -
// swap the file in, nothing else needs to change. Width/height are always set
// explicitly so the layout doesn't jump once real media lands (CLS).
//
// If the file at `src` is missing (as it will be until you add assets), this
// renders a placeholder box at the exact same dimensions instead of a
// broken-image icon. The box itself stays short and generic (an icon + "Photo
// pending") regardless of context - the full descriptive alt text is still
// there for screen readers via aria-label, it just doesn't get crammed as
// visible copy into what's sometimes a 144px-wide column.

import { useState } from "react";

function PhotoGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="1.6" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M3 16.5l5-5 4 4 3-3 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlaceholderBox({ aspect, className, alt, children }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 border border-dashed border-blush bg-blush/20 text-center text-xs text-ink-soft ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={alt}
    >
      {children}
    </div>
  );
}

// priority: for the one above-the-fold image per page (the Home portrait).
// Lazy-loading the largest visible element delays Largest Contentful Paint.
export function PlaceholderImage({ src, alt, aspect = "16/9", label, className = "", onError, priority = false }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <PlaceholderBox aspect={aspect} className={className} alt={alt}>
        <PhotoGlyph />
        <span className="px-4">{label || "Photo pending"}</span>
      </PlaceholderBox>
    );
  }

  const resolvedSrc = src?.startsWith("/") ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src;
  // scripts/build-images.mjs writes every credential/project/portrait image
  // as a .jpg + .webp pair sharing a basename, so the same source path
  // always has a same-named .webp sibling - derive it rather than storing
  // both paths in the data files.
  const webpSrc = resolvedSrc?.replace(/\.(jpe?g|png)$/i, ".webp");

  return (
    <picture>
      {webpSrc && webpSrc !== resolvedSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img
        src={resolvedSrc}
        alt={alt}
        style={{ aspectRatio: aspect }}
        className={`w-full object-cover ${className}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        onError={() => {
          setFailed(true);
          onError?.();
        }}
      />
    </picture>
  );
}

export function PlaceholderVideo({ src, aspect = "16/9", label, className = "", onError }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <PlaceholderBox aspect={aspect} className={className}>
        <PhotoGlyph />
        <span className="px-4">{label || "Video pending"}</span>
      </PlaceholderBox>
    );
  }

  return (
    <video
      src={src?.startsWith("/") ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src}
      style={{ aspectRatio: aspect }}
      className={`w-full object-cover ${className}`}
      controls
      onError={() => {
        setFailed(true);
        onError?.();
      }}
    />
  );
}
