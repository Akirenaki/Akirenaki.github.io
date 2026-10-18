# Source Assets (`/assets-src`)

This directory is the git-tracked **source of truth** for all full-resolution media and image files.

## How Image Processing Works

The build script `scripts/build-images.mjs` (runs automatically on `npm run dev`, `npm run build`, or manually via `npm run images`) converts all images dropped here into optimized WebP and JPG pairs inside `/public/assets`.

## Where to Place New Images

- **Project Case Study Banner:**  
  `assets-src/projects/<slug>-hero.jpg` (or `.png`)  
  *Example:* `assets-src/projects/astronomical-multi-catalog-identifier-matcher-hero.jpg`

- **Project Card Thumbnail:**  
  `assets-src/projects/<slug>.jpg` (or `.png`)  
  *Example:* `assets-src/projects/astronomical-multi-catalog-identifier-matcher.jpg`

- **Hero Portrait:**  
  `assets-src/portrait.jpg`

- **Navbar Logo:**  
  `assets-src/logo.png` (supplied on a plain white background)  
  The pipeline turns the white into real transparency and writes `logo.png` + `logo.webp` with an alpha channel. `Nav.jsx` shows it on a dark `bg-ink` tile so the pink/purple stays readable.

- **Social Share Card (link previews):**  
  `assets-src/og-image.jpg` (resized to 1200px wide; if you change its aspect ratio, update `og:image:height` in `src/lib/seo.js`)

- **Credentials / Certificates / Awards:**  
  `assets-src/credentials/<category>-<name>.jpg`  
  *Example:* `assets-src/credentials/certification-python.png`

> Note: `<slug>` matches the `slug` property of your project in `src/data/projects.js`.
