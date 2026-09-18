import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Work } from "./pages/Work";
import { ProjectCaseStudy } from "./pages/ProjectCaseStudy";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { PrintCV } from "./pages/PrintCV";

// BrowserRouter (not HashRouter) so every route is a real, separately
// crawlable URL - /work, /about, /contact, /work/:slug - instead of a
// #fragment that Google never indexes as its own page. GitHub Pages still
// can't do server-side rewrites, so a direct hit or refresh on a sub-route
// depends on the public/404.html + index.html redirect-restore script pair
// (see those files) to hand the right path back to this router before it
// ever renders. basename must match the GitHub Pages project path exactly,
// same as vite.config.js's `base`.
export default function App() {
  return (
    <BrowserRouter basename="/Portfolio">
      <Routes>
        {/* Standalone - deliberately outside <Layout>, so it renders without
            Nav/Footer/ConstellationField and prints cleanly on its own. */}
        <Route path="/print" element={<PrintCV />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectCaseStudy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
