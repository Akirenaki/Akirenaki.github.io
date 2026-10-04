import { StrictMode, useEffect } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import "./index.css";

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

// GoatCounter analytics (cookieless). The script is loaded once, then each
// route change is counted manually, because React Router navigates without
// full page loads and GoatCounter would otherwise only see the first page.
let gcLoader = null;
let lastCounted = null;

function loadGoatCounter() {
  if (!gcLoader) {
    window.goatcounter = { no_onload: true };
    gcLoader = new Promise((resolve) => {
      const s = document.createElement("script");
      s.async = true;
      s.dataset.goatcounter = "https://renee.goatcounter.com/count";
      s.src = "https://gc.zgo.at/count.js";
      s.onload = resolve;
      s.onerror = resolve; // ad blockers: fail silently
      document.head.appendChild(s);
    });
  }
  return gcLoader;
}

function Analytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (lastCounted === pathname) return; // avoids double-counting
    lastCounted = pathname;
    loadGoatCounter().then(() => {
      window.goatcounter?.count?.({ path: pathname });
    });
  }, [pathname]);

  return null;
}

export default function Root() {
  return (
    <StrictMode>
      <Analytics />
      <Outlet />
    </StrictMode>
  );
}
