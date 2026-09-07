import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base: './' keeps built asset paths relative, so the site works whether it
// ends up at a GitHub Pages project path (username.github.io/repo/) or a
// custom subdomain later - no need to touch this when the URL changes.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
