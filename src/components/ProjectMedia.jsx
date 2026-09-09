import { useState } from "react";
import { PlaceholderImage, PlaceholderVideo } from "./PlaceholderMedia";

export function ProjectMedia({ project, variant = "card", aspect = "16/9", className = "" }) {
  const [mediaType, setMediaType] = useState("video");
  const suffix = variant === "hero" ? "-hero" : "";
  const videoSrc = project.media?.video || `/assets/projects/${project.slug}${suffix}.mp4`;
  const imageSrc = project.media?.image || `/assets/projects/${project.slug}${suffix}.jpg`;
  const label = `${variant === "hero" ? "Screenshot" : "Preview"} — ${project.title}`;

  if (mediaType === "video") {
    return (
      <PlaceholderVideo
        src={videoSrc}
        aspect={aspect}
        label={label}
        className={className}
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
        className={className}
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