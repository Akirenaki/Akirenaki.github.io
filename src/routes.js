import { route, index, layout } from "@react-router/dev/routes";

// Framework-mode equivalent of the old App.jsx <Routes> tree. Path
// segments are relative to appDirectory ("src", set in
// react-router.config.js) - so "pages/Home.jsx" resolves to
// src/pages/Home.jsx, the same file as before, unmoved.
//
// /print stays outside the layout() wrapper for the same reason the old
// App.jsx kept it outside <Layout>: it renders without Nav/Footer/
// ConstellationField so it prints cleanly on its own.
//
// /work/:slug has a dynamic segment, so the prerenderer can't discover
// its real URLs on its own - react-router.config.js's prerender()
// function lists them explicitly, reading the same slugs from
// src/data/projects.js that this route uses to look up which project to
// show (one source of truth, not two lists that can drift apart).
export default [
  route("print", "pages/PrintCV.jsx"),
  layout("components/Layout.jsx", [
    index("pages/Home.jsx"),
    route("work", "pages/Work.jsx"),
    route("work/:slug", "pages/ProjectCaseStudy.jsx"),
    route("about", "pages/About.jsx"),
    route("contact", "pages/Contact.jsx"),
  ]),
];
