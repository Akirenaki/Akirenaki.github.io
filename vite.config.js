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

// base is an absolute path, not './', because BrowserRouter now serves real
// nested routes like /work/project-cherenkov. A relative base resolves
// against whatever the current URL happens to be, so it works at the site
// root but breaks one level down (it would look for assets under
// /work/assets/... instead of /assets/...). An absolute base always
// resolves the same way regardless of route depth. This MUST match the
// `basename` in src/App.jsx and the repo name in public/404.html.
export default defineConfig({
  base: '/Portfolio/',
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_DATE__: JSON.stringify(getBuildDate()),
  },
})
