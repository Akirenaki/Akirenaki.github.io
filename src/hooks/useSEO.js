import { useEffect } from "react";

// Single source of truth for the two things that don't change per-route:
// where the site actually lives, and the fallback image for link previews.
// Update SITE_BASE here (not per-page) if the repo/hosting path ever
// changes - it must match `basename` in App.jsx and `base` in vite.config.js.
export const SITE_ORIGIN = "https://akirenaki.github.io";
export const SITE_BASE = "/Portfolio";
export const SITE_URL = `${SITE_ORIGIN}${SITE_BASE}/`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}assets/og-image.jpg`;

function setMetaByAttr(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkHref(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// Updates document.title plus the description/OG/Twitter/canonical tags on
// route change. Now that routing is BrowserRouter (real paths, not
// #fragments - see App.jsx), each page's canonical/og:url genuinely is that
// page's own address, and this is what lets Google index Work/About/Contact
// and every case study as separate pages instead of just the homepage.
//
// Remaining limitation, so nobody mistakes this for the whole picture:
// static link-unfurlers (Slack, Discord, iMessage, most of Twitter/X) fetch
// the raw HTML of whatever URL was shared and never run this script, so a
// direct share of e.g. /work will still show the homepage's baked-in
// index.html tags rather than Work's. That gap needs build-time
// prerendering to close, not a client-side hook - only Googlebot's
// JS-rendering pass actually sees what this sets.
export function useSEO({ title, description, path = "/" }) {
  useEffect(() => {
    const pageTitle = title
      ? `${title} · Renee Astraea`
      : "Portfolio of Renee Astraea · Raden Bagus Narendra Tsaqiif Aryasuta Maldini";
    const socialTitle = title ? `${title} — Renee Astraea` : "Renee Astraea — Astrophysics & Software";

    document.title = pageTitle;
    setMetaByAttr("property", "og:title", socialTitle);
    setMetaByAttr("name", "twitter:title", socialTitle);

    if (description) {
      setMetaByAttr("name", "description", description);
      setMetaByAttr("property", "og:description", description);
      setMetaByAttr("name", "twitter:description", description);
    }

    // path is the app-relative route (e.g. "/work", "/work/some-slug"), so
    // strip any leading slash before joining it onto SITE_URL (which already
    // ends in one) rather than onto SITE_ORIGIN+SITE_BASE (which doesn't).
    const pageUrl = path === "/" ? SITE_URL : `${SITE_URL}${path.replace(/^\//, "")}`;
    setMetaByAttr("property", "og:url", pageUrl);
    setLinkHref("canonical", pageUrl);
  }, [title, description, path]);
}
