# Portfolio — Renee Astraea

A static portfolio built with React, React Router, and Tailwind CSS. Home / Work
(with per-project case-study pages) / About & Credentials / Contact.

## Running it locally

```bash
npm install
npm run dev       # dev server with hot reload
npm run build     # production build -> dist/
npm run preview   # serve the production build locally, to sanity-check it
```

## Editing content

Nothing in this repo needs code changes for routine updates - it's all in
`src/data/`:

| File | What it controls |
|---|---|
| `src/data/profile.js` | Names, tagline, bio, contact links, languages, education |
| `src/data/projects.js` | Every project card + its case-study page |
| `src/data/experience.js` | Experience entries on the About page |
| `src/data/awards.js` | Awards, certifications, and the technical-stack lists |

To add a new project: add an object to the array in `projects.js` with a unique
`slug` - a page at `/work/<slug>` is generated automatically, no routing code
to touch.

## Adding real media

Every image is currently a placeholder box at the right size (see
`public/assets/README.md` for exact filenames/dimensions expected). Drop a
file at the path it names and it swaps in automatically - nothing else
changes.

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that builds and deploys on every push to `main`. One-time setup after you
push this to a new GitHub repo:

1. On GitHub: **Settings → Pages → Source**, select **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the **Actions** tab).
3. Your site will be live at `https://<username>.github.io/<repo-name>/`
   within a minute or two.

No further config is needed when the repo name changes - `vite.config.js`
uses a relative base path, and routing uses `HashRouter` (URLs look like
`/#/work/some-project`), specifically so GitHub Pages' lack of server-side
rewrites never causes a 404 on a direct link or refresh.

If you later move to a custom domain: add a `CNAME` file to `public/` with
the domain name, point your DNS at GitHub Pages, then switch `HashRouter` to
`BrowserRouter` in `src/App.jsx` if you want clean URLs (optional - hash
routing works fine on a custom domain too).

## Stack

React 19 · React Router 7 (HashRouter) · Tailwind CSS 4 · Vite 8

Animation is currently hand-rolled (see `src/components/ConstellationField.jsx`)
rather than pulled from reactbits.dev, since that library ships as
copy-paste component source rather than an installable package and isn't
reachable from the build environment this was created in. Swap in real
reactbits components any time - drop the component file into
`src/components/` and use it like any other.
