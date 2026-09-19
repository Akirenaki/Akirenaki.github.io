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
export const SITE_NAME = "Renee Astraea";

// Every page is prerendered to <path>/index.html, and GitHub Pages answers a
// request for "/work" with a 301 to "/work/". Canonical, og:url and the
// sitemap must all name the URL that actually returns 200 (the slashed one),
// otherwise the canonical points at a URL that redirects somewhere else.
export function pageUrl(path = "/") {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `${SITE_URL}${clean}/` : SITE_URL;
}

// Site-wide structured data. This used to live in root.jsx's own `meta`
// export, but React Router does NOT merge a parent route's meta into a leaf
// route's: as soon as a leaf exports `meta` (every page here does), the
// root's array is discarded. The build output confirmed it - no og:image,
// no twitter:card and no JSON-LD on any page. So the shared tags are added
// here, inside buildMeta, which every page already calls.
const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}#person`,
      name: SITE_NAME,
      alternateName: "Raden Bagus Narendra Tsaqiif Aryasuta Maldini",
      url: SITE_URL,
      image: `${SITE_URL}assets/portrait.jpg`,
      jobTitle: "Aspiring Astrophysicist & Software Developer",
      description:
        "Astrophysics student and developer building data tools and interactive visualisations for observational astronomy.",
      sameAs: [
        "https://github.com/Akirenaki",
        "https://www.linkedin.com/in/renee-astraea/",
        "https://www.kaggle.com/reneeastraea",
        "https://www.instagram.com/heavychainthatdoesfreezemybone/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: `${SITE_NAME} — Astrophysics & Software`,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}#person` },
    },
  ],
};

export function breadcrumbJsonLd(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
  };
}

// Called from each route's `meta` export, so the tags below are baked into
// that route's prerendered HTML (link unfurlers and crawlers never run our JS).
//   noindex - adds <meta name="robots" content="noindex"> (used for /print)
//   jsonLd  - extra JSON-LD objects for this page only (e.g. breadcrumbs)
export function buildMeta({ title, description, path = "/", noindex = false, jsonLd = [] }) {
  // Keep <title> under ~60 characters so it isn't cut off in results. The
  // legal name stays in the Person schema (alternateName) and in the page body.
  const pageTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Astrophysics & Software Portfolio`;
  const socialTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Astrophysics & Software`;
  const url = pageUrl(path);

  const meta = [
    { title: pageTitle },
    { property: "og:title", content: socialTitle },
    { name: "twitter:title", content: socialTitle },
    { property: "og:url", content: url },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: DEFAULT_OG_IMAGE },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "600" },
    { property: "og:image:alt", content: socialTitle },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    { "script:ld+json": SITE_JSON_LD },
    ...jsonLd.map((obj) => ({ "script:ld+json": obj })),
  ];

  if (noindex) meta.push({ name: "robots", content: "noindex" });

  if (description) {
    meta.push(
      { name: "description", content: description },
      { property: "og:description", content: description },
      { name: "twitter:description", content: description },
    );
  }

  return meta;
}
