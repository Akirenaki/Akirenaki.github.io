import { projects } from "./src/data/projects.js";

// Framework-mode build config, sitting alongside vite.config.js.
// appDirectory keeps route modules resolving from src/ instead of the
// framework's default app/, so page/component files didn't need to move.
export default {
  appDirectory: "src",

  // Root, not "/Portfolio" - this deploys as a GitHub Pages User Site
  // (akirenaki.github.io), not a Project Site. Must match `base` in
  // vite.config.js and SITE_BASE in src/lib/seo.js.
  //
  // This isn't just a style choice: @react-router/dev's ssr:false
  // prerenderer currently has a real bug (remix-run/react-router#14587)
  // where a non-root basename combined with `prerender` produces build
  // output that doesn't match any route ("Unable to prerender path
  // because it does not match any routes"), confirmed by testing it
  // directly against this project at "/Portfolio". Deploying at the
  // domain root sidesteps it rather than working around it.
  basename: "/",

  // ssr:false + a concrete prerender path list means: no runtime Node
  // server, every route below is rendered to a real static HTML file at
  // build time (build/client/work/index.html, etc.), and that's the whole
  // deployment - matches how GitHub Pages already serves this site.
  ssr: false,
  async prerender() {
    return ["/", "/work", "/about", "/contact", "/print", ...projects.map((p) => `/work/${p.slug}`)];
  },
};
