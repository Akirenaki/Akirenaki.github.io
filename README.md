# Portfolio — Renee Astraea

A static portfolio built with React 19, React Router 7, Tailwind CSS 4, and Framer Motion. Features Home, Work (with per-project case-study pages), About & Credentials, Contact, and a printable CV page (`/print`).

## Running it locally

```bash
npm install
npm run dev       # dev server with hot reload (automatically processes new images)
npm run build     # production build -> dist/
npm run preview   # serve the production build locally, to sanity-check it
npm run images    # run image optimization pipeline manually
```

## Editing content

Nothing in this repo needs code changes for routine content updates — it's all in `src/data/`:

| File | What it controls |
|---|---|
| `src/data/profile.js` | Names, tagline, bio, contact links, languages, education |
| `src/data/projects.js` | Every project card + its case-study page |
| `src/data/experience.js` | Experience entries on the About page |
| `src/data/awards.js` | Awards, certifications, and technical-stack lists |

To add a new project: add an object to the array in `projects.js` with a unique `slug` — a case study page at `/#/work/<slug>` is generated automatically, with no routing code to touch.

## Adding and Uploading Media

All raw, full-resolution image assets belong in `assets-src/`. The project uses an automated build-time image pipeline ([scripts/build-images.mjs](scripts/build-images.mjs) powered by `sharp`) to resize assets to display targets and generate dual `.webp` (primary) and `.jpg` (fallback) outputs in `public/assets/`.

### How to Upload/Add Images Yourself:

1. **Add your original high-res image (`.jpg` or `.png`) into `assets-src/`**:
   - **Case Study Hero Banner:** `assets-src/projects/<slug>-hero.jpg` (e.g., `assets-src/projects/astronomical-multi-catalog-identifier-matcher-hero.jpg`)
   - **Project Card Thumbnail:** `assets-src/projects/<slug>.jpg` (e.g., `assets-src/projects/astronomical-multi-catalog-identifier-matcher.jpg`)
   - **Hero Portrait:** `assets-src/portrait.jpg`
   - **Credentials / Certificates:** `assets-src/credentials/<category>-<name>.jpg` (e.g. `education-*`, `experience-*`, `award-*`, `certification-*`)

   *(Make sure `<slug>` matches the `slug` key in `src/data/projects.js`)*

2. **Process the images**:
   - Run `npm run images` in your terminal to process immediately.
   - Or simply run `npm run dev` or `npm run build` — pre-build hooks automatically run `npm run images` whenever source images are missing or updated.

3. **Automatic Fallbacks**:
   - Until a real image is placed in `assets-src/`, the site renders a styled, labeled placeholder box without breaking layout.

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys on every push to `main`. One-time setup after pushing to a new GitHub repo:

1. On GitHub: **Settings → Pages → Source**, select **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the **Actions** tab).
3. Site is live at `https://akirenaki.github.io/Portfolio` within a minute or two.

`vite.config.js` uses a relative base path (`base: './'`), and routing uses `HashRouter` (URLs look like `/#/work/some-project`), ensuring GitHub Pages' lack of server-side rewrites never causes a 404 on direct navigation or page refreshes.

If you later move to a custom domain with server rewrites: add a `CNAME` file to `public/`, point your DNS at GitHub Pages, then optionally switch `HashRouter` to `BrowserRouter` in `src/App.jsx`.

## Stack

React 19 · React Router 7 (HashRouter) · Tailwind CSS 4 · Framer Motion · Sharp · Vite 8

## Application Structure

```text
src/
   App.jsx                         Main app router (HashRouter setup & page routing)
   main.jsx                        React application entry point
   index.css                       Global CSS styles & Tailwind configuration
   components/                     Reusable UI components
      ConstellationField.jsx        Interactive canvas constellation background animation
      Footer.jsx                    Global site footer
      Layout.jsx                    Page layout shell (Nav + Canvas + Page Content + Footer)
      Nav.jsx                       Top navigation bar with routes and status indicators
      PlaceholderMedia.jsx          Image & video renderer with WebP fallbacks and placeholders
      PrintCVButton.jsx             Interactive button for triggering window print / CV export
      ProjectCard.jsx               Card component for project grid items
      ProjectMedia.jsx              Media resolver helper for project thumbnails & hero banners
      TechStack.jsx                 Categorized skill tags and tech stack badge lists
   data/                           Content data sources (edit here for content updates)
      awards.js                     Certifications, awards, and technical skill lists
      experience.js                 Work and leadership experience entries
      profile.js                    Personal metadata, bio, contact links, and education
      projects.js                   Project card catalog and detailed case-study content
   pages/                          Top-level page views
      About.jsx                     About page (bio, experience, skills, credentials grid)
      Contact.jsx                   Contact page with direct messaging links
      Home.jsx                      Landing page (hero header, featured projects, quick bio)
      PrintCV.jsx                   Standalone printable CV layout
      ProjectCaseStudy.jsx          Detailed per-project case study viewer (/#/work/:slug)
      Work.jsx                      Full portfolio projects showcase grid
   utils/                          Utility functions
      browserDetect.js              Browser & device feature detection helpers

assets-src/                        Raw, high-resolution source images (git-tracked)
   credentials/                    Original certificate & credential images
   projects/                       Original project thumbnails & hero banners
   portrait.jpg                    Original hero portrait image

public/                            Static assets served directly by Vite
   assets/                         Web-ready optimized images (generated automatically by Sharp)
      credentials/                  Resized .jpg & .webp credential image pairs
      projects/                     Resized .jpg & .webp project image pairs
      README.md                     Notes on build pipeline output
   favicon.svg                     Favicon SVG asset

scripts/                           Build tools & automated pipelines
   build-images.mjs                Sharp-based image optimization & WebP conversion pipeline

.github/
   workflows/
      deploy.yml                   GitHub Actions workflow for automated build & deployment

index.html                         HTML entry point & meta tags
package.json                       Node dependencies and script definitions
package-lock.json                  Locked Node dependency versions
vite.config.js                     Vite bundler configuration (relative base path)
.oxlintrc.json                     Oxlint linter configuration
.gitignore                         Git ignore rules
README.md                          Project documentation and operating notes
```

