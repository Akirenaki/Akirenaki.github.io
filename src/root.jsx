import { StrictMode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./index.css";
import { SITE_URL, DEFAULT_OG_IMAGE } from "./lib/seo";

// Site-wide tags that don't vary per page - the old static index.html set
// these once and every route inherited them for free; now that each route
// is its own prerendered file, they have to be declared explicitly
// somewhere all routes share. Root's own `meta` export is that place:
// React Router concatenates every matched route's meta array from root
// down to the leaf, so these appear on every page alongside whatever
// title/description the leaf route (see src/lib/seo.js's buildMeta) adds
// on top - matching what index.html used to do implicitly.
export function meta() {
  return [
    { property: "og:image", content: DEFAULT_OG_IMAGE },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Renee Astraea",
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
    },
  ];
}

// Layout wraps both the page (the default export below) and any error
// boundary, so the <html> shell - and everything in <head> - is present
// even on a route that throws. This is where charSet/viewport live
// directly as plain tags rather than through `meta`, per React Router's
// own recommendation: those two never vary per route, so there's no
// merge-order problem to avoid by keeping them out of the meta export.
export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Karla:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <StrictMode>
      <Outlet />
    </StrictMode>
  );
}
