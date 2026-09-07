import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Work } from "./pages/Work";
import { ProjectCaseStudy } from "./pages/ProjectCaseStudy";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

// HashRouter (not BrowserRouter) is deliberate: GitHub Pages serves static
// files with no server-side rewrite, so a direct link/refresh on a
// sub-route like /work/some-project would 404 under BrowserRouter. Hash
// routing (/#/work/some-project) needs no server config at all. Switch to
// BrowserRouter + a 404->index.html redirect trick only if a custom domain
// with proper rewrites is set up later.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectCaseStudy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
