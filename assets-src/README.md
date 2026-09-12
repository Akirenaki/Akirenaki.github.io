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

- **Credentials / Certificates / Awards:**  
  `assets-src/credentials/<category>-<name>.jpg`  
  *Example:* `assets-src/credentials/certification-python.png`

> Note: `<slug>` matches the `slug` property of your project in `src/data/projects.js`.
