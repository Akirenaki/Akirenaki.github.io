Drop real media here:
- portrait.jpg              (hero portrait, ~800x1000)
- og-image.jpg              (1200x630, used for link previews - referenced in index.html)
- projects/<slug>.jpg       (project card thumbnail, ~16:9)
- projects/<slug>-hero.jpg  (case-study header image, ~16:9)

Slugs match the `slug` field in src/data/projects.js. Until a file exists at
a given path, the site shows a labelled placeholder box at the right size
instead of a broken image - nothing else needs to change when you add one.
