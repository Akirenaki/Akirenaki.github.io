import { execSync } from 'child_process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const getBuildDate = () => {
  try {
    return execSync('git log -1 --format="%cd" --date=iso-strict').toString().trim()
  } catch {
    return new Date().toISOString()
  }
}

// base: './' keeps built asset paths relative, so the site works whether it
// ends up at a GitHub Pages project path (username.github.io/repo/) or a
// custom subdomain later - no need to touch this when the URL changes.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_DATE__: JSON.stringify(getBuildDate()),
  },
})
