import { useState } from "react";
import { PlaceholderImage, PlaceholderVideo } from "./PlaceholderMedia";

export function ProjectMedia({ project, variant = "card", aspect = "16/9", className = "" }) {
  // Only try the video path when a project actually declares one - every
  // project currently only ships jpg/webp stills, so defaulting this to
  // "video" meant every single card fired a doomed request for a .mp4 that
  // was never going to exist before falling back to the image.
  const [mediaType, setMediaType] = useState(project.media?.video ? "video" : "image");
  const suffix = variant === "hero" ? "-hero" : "";
  const videoSrc = project.media?.video || `/assets/projects/${project.slug}${suffix}.mp4`;
  const imageSrc = project.media?.image || `/assets/projects/${project.slug}${suffix}.jpg`;
  const label = `${variant === "hero" ? "Screenshot" : "Preview"} — ${project.title}`;
  // Grid/card thumbnails span everything from a galaxy-poster logo to a
  // dark-mode app screenshot, each with its own colour story that has
  // nothing to do with the site's palette - a wall of them fighting for
  // attention reads as noisy. A light, always-on (not hover-gated, so it
  // isn't lost on touch devices) desaturation pulls them into the same
  // register without hiding anything. The full-size case-study hero stays
  // untouched, since that's a documentation image evaluated on its own.
  const toneClass = variant === "hero" ? "" : "thumb-tone";

  if (mediaType === "video") {
    return (
      <PlaceholderVideo
        src={videoSrc}
        aspect={aspect}
        label={label}
        className={`${toneClass} ${className}`}
        onError={() => setMediaType("image")}
      />
    );
  }

  if (mediaType === "image") {
    return (
      <PlaceholderImage
        src={imageSrc}
        alt={`${project.title} preview`}
        aspect={aspect}
        label={label}
        className={`${toneClass} ${className}`}
        onError={() => setMediaType("placeholder")}
      />
    );
  }

  return (
    <PlaceholderImage
      alt={`${project.title} preview`}
      aspect={aspect}
      label={label}
      className={className}
    />
  );
}