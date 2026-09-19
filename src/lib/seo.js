// Single source of truth for the two things that don't change per-route:
// where the site actually lives, and the fallback image for link previews.
// Update SITE_BASE here (not per-page) if the repo/hosting path ever
// changes - it must match `basename` in react-router.config.js and `base`
// in vite.config.js. Empty string because this deploys as a GitHub Pages
// User Site (akirenaki.github.io) rather than a Project Site
// (akirenaki.github.io/Portfolio/) - the site lives at the domain root,
// which is also what let the prerender build succeed in the first place
// (see react-router.config.js's comment on the basename bug this avoids).
export const SITE_ORIGIN = "https://akirenaki.github.io";
export const SITE_BASE = "";
export const SITE_URL = `${SITE_ORIGIN}${SITE_BASE}/`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}assets/og-image.jpg`;

// Replaces the old useSEO() hook. That hook set document.title and meta
// tags imperatively inside a useEffect - which only ever ran in the
// browser, after hydration. Now that routes export a `meta` function
// (see each page's `meta` export, and src/root.jsx), React Router calls
// this during the prerender pass itself, so the tags below are baked into
// the static HTML file for each route - not just applied client-side
// after the fact. That's what actually lets Slack/Discord/iMessage-style
// unfurlers (which never run our JS) see the correct per-page title and
// description, closing the gap the old useSEO.js comment used to flag.
export function buildMeta({ title, description, path = "/" }) {
  const pageTitle = title
    ? `${title} · Renee Astraea`
    : "Portfolio of Renee Astraea · Raden Bagus Narendra Tsaqiif Aryasuta Maldini";
  const socialTitle = title ? `${title} — Renee Astraea` : "Renee Astraea — Astrophysics & Software";

  // path is the app-relative route (e.g. "/work", "/work/some-slug"), so
  // strip any leading slash before joining it onto SITE_URL (which already
  // ends in one) rather than onto SITE_ORIGIN+SITE_BASE (which doesn't).
  const pageUrl = path === "/" ? SITE_URL : `${SITE_URL}${path.replace(/^\//, "")}`;

  const meta = [
    { title: pageTitle },
    { property: "og:title", content: socialTitle },
    { name: "twitter:title", content: socialTitle },
    { property: "og:url", content: pageUrl },
    { tagName: "link", rel: "canonical", href: pageUrl },
  ];

  if (description) {
    meta.push(
      { name: "description", content: description },
      { property: "og:description", content: description },
      { name: "twitter:description", content: description },
    );
  }

  return meta;
}
