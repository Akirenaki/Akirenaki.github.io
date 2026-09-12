# Generated Assets Output

This directory (`/public/assets`) contains **automatically generated output files** created by the build-time image pipeline (`scripts/build-images.mjs`).

> [!NOTE]
> **Do not manually add or edit files here.** Original source images belong in `/assets-src`.

When you run `npm run dev`, `npm run build`, or `npm run images`, the image script reads original images from `/assets-src` and writes optimized pairs here:
- `<filename>.webp` (primary web format, optimized with Sharp)
- `<filename>.jpg` (fallback format for browsers/crawlers without WebP support)

### Expected Filenames in `/assets-src`
- `portrait.jpg` (hero portrait)
- `og-image.jpg` (1200x630, social link preview)
- `projects/<slug>.jpg` (project card thumbnail, 16:9)
- `projects/<slug>-hero.jpg` (case-study banner/hero image, 16:9)
- `credentials/education-*.jpg` (education credential images)
- `credentials/experience-*.jpg` (experience images)
- `credentials/award-*.jpg` (award images)
- `credentials/certification-*.jpg` (certification images)

