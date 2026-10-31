# Renee Astraea — Portfolio

This repository contains the personal portfolio and online CV of Renee
Astraea, legally known as Raden Bagus Narendra Tsaqiif Aryasuta Maldini,an aspiring astrophysicist, independent web developer, and human
rights activist. The site presents research-oriented software projects,
technical case studies, essays, credentials, contact links, and a
print-friendly CV.

The application is a statically generated React site. There is no runtime
server or database: content is stored in source files under `src/data/`,
Markdown essays live in `src/essays/`, and the build produces deployable HTML
files and assets under `build/client/`.

## Table of contents

1. [Short description](#i-short-description)
2. [Tech stack](#ii-tech-stack)
3. [Pages and features](#iii-pages-and-features)
   - [Home — `/`](#a-home---)
   - [About — `/about`](#b-about---about)
   - [Work — `/work`](#c-work---work)
   - [Writing — `/writing`](#d-writing---writing)
   - [Contact — `/contact`](#e-contact---contact)
   - [Print CV — `/print`](#f-print-cv---print)
4. [How to run and what to understand](#iv-how-to-run-and-what-to-understand)
   - [Local commands](#local-commands)
   - [Content workflow](#content-workflow)
   - [Build and deployment pipelines](#build-and-deployment-pipelines)
   - [Project structure](#project-structure)
5. [Legal notes](#v-legal-notes)

## I. Short description

The portfolio is designed as both a public introduction and a maintainable
content system:

- The home page introduces the person and highlights selected work and
  writing.
- Work pages explain projects through searchable/filterable cards and
  detailed case studies.
- Writing pages provide summaries, taxonomy filters, full essay text, and PDF
  versions.
- The About page collects biography and credentials in one long-form view.
- Contact provides social links and a Formspree-backed message form.
- The print page turns the same profile and project data into a printable CV
  or a browser-generated PDF.

## II. Tech stack

### Application

- **React 19** and **React DOM 19** for the UI.
- **React Router 8 framework mode** for route definitions, static
  prerendering, and dynamic project/essay routes.
- **Vite 8** as the build tool.
- **Tailwind CSS 4** for styling, with global rules in
  [`src/index.css`](src/index.css).
- **Framer Motion** for the small amount of motion used on the home hero.
- **Marked** for converting trusted, repository-owned Markdown essays into
  HTML at build time.
- **Oxlint** for linting.

### Build and media tooling

- **Sharp** resizes source images and creates WebP/JPEG (or transparent
  PNG/WebP) output pairs.
- **Playwright Chromium** prints prerendered essay pages to tagged A4 PDFs.
- **GitHub Actions** builds and deploys the static output to GitHub Pages.

The project intentionally uses static generation (`ssr: false`). The
production site is a collection of HTML files, not a Node server that must
run after deployment.

## III. Pages and features

### A. Home — `/`

The landing page combines the primary introduction with quick paths into the
rest of the site:

1. A hero section shows the preferred/legal name presentation, pronouns,
   role summary, tagline, portrait, and a short profile summary.
2. Calls to action link to the project catalogue and contact page.
3. A “Working across” strip summarizes the core domains from
   [`src/data/profile.js`](src/data/profile.js).
4. Featured projects are selected from `src/data/projects.js`. A priority
   project receives the large card treatment.
5. Featured writing appears when at least one writing entry has
   `featured: true`.
6. The **Print CV** action opens `/print?auto=1` in a new tab. The print page
   then waits for fonts and invokes the browser print dialog.

The hero animation respects `prefers-reduced-motion`.

### B. About — `/about`

About is the long-form biography and credentials page. It reads from the
profile, experience, awards, and technical-stack data modules rather than
duplicating those values in JSX.

The page contains:

1. Biography, location, pronouns, and language proficiency.
2. A jump navigation for the long page.
3. Technical stack split into frequently used tools and other experience.
4. Certifications, with optional credential links and images.
5. Education entries, including descriptions and supporting bullets.
6. Test scores, work/leadership experience, awards, and recognition.

Update the corresponding files in `src/data/` when credentials change. The
page also publishes descriptive metadata during prerendering.

### C. Work — `/work`

Work is the project catalogue for software, astronomy, statistics, and
hardware/engineering projects.

1. Each project is defined once in
   [`src/data/projects.js`](src/data/projects.js).
2. A project has a unique `slug`; its card and case study are available at
   `/work/<slug>` without adding a route manually.
3. The visible **Scale** filter distinguishes Flagship, Standard, and Mini
   projects.
4. Supporting filters cover domain, type, framework, language, live demo, and
   repository availability.
5. Options within one filter group use OR logic; different groups use AND
   logic. Active filters appear as removable chips.
6. Cards can expose repository, live demo, presentation, and document links.
7. Case studies describe the problem, approach, and impact. Optional
   `cv.problem`, `cv.approach`, and `cv.impact` values provide concise lines
   for the printable CV.

The prerender list reads project slugs from the same data file, so adding a
project does not require maintaining a second route list.

### D. Writing — `/writing`

Writing is an essay catalogue organized into **Academic writing** and
**Creative writing**. It supports both discovery and reading:

1. Entries are defined in
   [`src/data/writing.js`](src/data/writing.js), with full text in
   `src/essays/<slug>.md`.
2. Each entry has its own prerendered page at `/writing/<slug>`.
3. The list can be filtered by subject, topic, and thinker/character tags.
   Tags within one facet use OR logic, while facets use AND logic.
4. Filter state is kept in the URL, so a filtered view can be shared.
5. An entry page shows its summary, metadata, taxonomy links, full text, last
   edited time, and Open/Download PDF controls.
6. Optional Google Docs links expose an “Online document” section when a
   potentially newer version exists.
7. Optional alternative versions and published embeds can be listed from the
   entry data.
8. On sufficiently wide screens, the PDF is embedded in the page; mobile
   visitors are not forced to fetch the embedded document.

The PDF conversion pipeline prints the same prerendered essay page with
Chromium, including print styles, headings, references, source information,
page numbers, accessibility tagging, and bookmarks. In CI, a PDF failure
fails the build so a deployment cannot silently publish incomplete essay
downloads.

### E. Contact — `/contact`

Contact provides several ways to connect and repeats the CV entry point:

1. Social links are rendered from the contact data in `profile.js`.
2. The form collects name, email, and message.
3. Form submissions are sent as JSON to Formspree; no application server or
   email credentials are stored in this repository.
4. The UI shows sending, success, and error states and allows a successful
   visitor to send another message.
5. The page includes the same **Print CV** control used on the home page.

The Formspree form ID is configured in `src/pages/Contact.jsx`. If the
endpoint changes, update it there and test both success and failure states.

### F. Print CV — `/print`

`/print` is a standalone document view intentionally outside the normal
navigation/footer layout so that it prints cleanly.

It composes the CV from the same source data used elsewhere:

- profile summary and contact details;
- education and test scores;
- technical skills, experience, awards, and certifications;
- selected projects with compact Problem/Approach/Impact lines;
- selected writing and other relevant portfolio information.

The page is styled for A4 output and hides browser-only notices and controls
when printing. Visitors can click **Print / Save as PDF**, choose a printer,
or choose “Save as PDF”. Links from Home and Contact open it in a new tab;
`?auto=1` triggers the print dialog after web fonts are ready. The page has a
`noindex` meta tag because it repeats personal contact and CV information.

## IV. How to run and what to understand

### Local commands

Use Node.js 22 (the deployment workflow uses Node 22), then install the
locked dependencies:

```bash
npm ci
npm run dev       # development server with hot reload
npm run lint      # Oxlint
npm run build     # production build, sitemap/checks, and essay PDFs
npm run preview   # preview build/client/
npm run images    # run the image pipeline directly
npm run sitemap   # regenerate public/sitemap.xml
npm run essays    # check essay files and word counts
npm run pdfs      # generate PDFs after a production build
```

`npm run build` runs the `prebuild` hook first. PDF generation needs a
Playwright Chromium installation:

```bash
npx playwright install chromium
```

The deployment workflow installs Chromium with system dependencies.

### Content workflow

Routine content changes should normally touch only `src/data/`:

| File | Content |
| --- | --- |
| `src/data/profile.js` | Names, bio, contact links, languages, and education |
| `src/data/projects.js` | Project cards, filters, case studies, links, and CV summaries |
| `src/data/writing.js` | Essay metadata, ordering, PDFs, featured flags, and related versions |
| `src/data/writing-taxonomy.js` | Writing facets and tag definitions |
| `src/data/experience.js` | Experience and leadership entries |
| `src/data/awards.js` | Awards, certifications, scores, and technical-stack lists |
| `src/essays/` | Markdown source for essays with generated text/PDF output |

For a new project, add a unique slug and its data object. For a new essay,
add the Markdown file, metadata object, taxonomy IDs, and a PDF path. The
essay checker warns about missing Markdown/PDF files and mismatched word
counts; malformed writing metadata and unknown tags are rejected by the
build-time validation used by the application.

### Build and deployment pipelines

1. **Image pipeline:** `assets-src/` stores high-resolution originals.
   `scripts/build-images.mjs` uses Sharp to resize them into
   `public/assets/` and creates WebP plus browser fallback formats. The logo
   is converted from a white background to transparency, and favicons are
   derived from it.
2. **Route prerendering:** `react-router.config.js` lists the static pages
   and derives project/essay detail paths from their data arrays.
3. **Sitemap:** `scripts/build-sitemap.mjs` uses the same route sources to
   write `public/sitemap.xml`. `/print` is intentionally excluded because it
   is `noindex`.
4. **Essay checks:** `scripts/check-essays.mjs` checks Markdown presence,
   committed fallback PDFs, and recorded word counts.
5. **Essay PDF generation:** `scripts/build-pdfs.mjs` starts a temporary local
   server over `build/client/`, opens each essay with JavaScript disabled, and
   prints the resulting page to `build/client/essays/<slug>.pdf`.
6. **Deployment:** `.github/workflows/deploy.yml` runs on pushes to `main` or
   manual dispatch, installs dependencies and Chromium, runs the build, uploads
   `build/client/` as a Pages artifact, and deploys it to
   `https://akirenaki.github.io/`.

The site is a GitHub Pages **User Site**, so the base path is `/`. Keep the
base/basename values in `vite.config.js`, `react-router.config.js`, and
`src/lib/seo.js` consistent if the deployment domain changes.

### Project structure

```text
src/
  components/       Shared layout, navigation, cards, media, and CV controls
  data/             Single-source content modules
  essays/           Markdown essay sources
  lib/              SEO, essay rendering, filtering, and shared helpers
  pages/            Route-level page components
  routes.js         React Router route table
  root.jsx          Document shell and site-wide metadata
  index.css         Tailwind and global styles
assets-src/         Original images, not deployed directly
public/             Static files and generated web assets
scripts/             Image, sitemap, essay-check, and PDF build tools
.github/workflows/  GitHub Pages deployment workflow
```

## V. Legal notes

- This repository does not currently include a `LICENSE` file. Do not assume
  that the source code, writing, photography, credentials, or personal
  information may be reused without permission.
- Essay text, profile information, project descriptions, and visual assets are
  personal or third-party material. Confirm ownership and attribution before
  copying or redistributing them.
- External links (including Formspree, Google Docs, social networks, project
  demos, and repositories) are third-party services. Their availability,
  privacy practices, and terms are outside this repository.
- The contact form sends submitted information to Formspree for processing.
  Avoid submitting sensitive information through it.
- Generated files in `public/assets/`, `public/sitemap.xml`, and
  `build/client/` are build products. Edit their source data or scripts rather
  than hand-editing generated output.
