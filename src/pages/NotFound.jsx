import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { CorruptedScreen } from "../components/CorruptedScreen";
import { buildMeta } from "../lib/seo";

// Catch-all route (the "*" entry in routes.js). It sits inside the site layout,
// so the navigation and footer stay available. The build also prerenders it at
// /404 and copies that to 404.html (scripts/build-404.mjs), which is what
// GitHub Pages serves for an address that matches no file.
export function meta() {
  return buildMeta({
    title: "Page not found",
    path: "/404",
    noindex: true,
  });
}

export function NotFound() {
  const { pathname } = useLocation();
  // Set after load, so the prerendered 404 has no address baked in.
  const [path, setPath] = useState("");
  useEffect(() => {
    setPath(pathname === "/404" || pathname === "/404/" ? "" : pathname);
  }, [pathname]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16">
      <CorruptedScreen variant="notFound" path={path} />
    </div>
  );
}

export default NotFound;
