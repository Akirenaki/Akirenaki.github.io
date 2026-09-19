import { execSync } from 'child_process'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const getBuildDate = () => {
  try {
    return execSync('git log -1 --format="%cd" --date=iso-strict').toString().trim()
  } catch {
    return new Date().toISOString()
  }
}

// base is an absolute path, not './', because every route - /work,
// /work/project-cherenkov, etc. - is now a real prerendered file living at
// its own nested path (see react-router.config.js). A relative base
// resolves against whatever the current URL happens to be, so it works at
// the site root but breaks one level down (it would look for assets under
// /work/assets/... instead of /assets/...). An absolute base always
// resolves the same way regardless of route depth.
//
// It's just '/' - not '/Portfolio/' - because this deploys as a GitHub
// Pages User Site (akirenaki.github.io) rather than a Project Site. This
// MUST match `basename` in react-router.config.js.
//
// reactRouter() replaces the plain @vitejs/plugin-react we used to list
// here - it owns the JSX/React transform itself, plus routing, typegen,
// and the prerender build pass driven by react-router.config.js.
export default defineConfig({
  base: '/',
  plugins: [reactRouter(), tailwindcss()],
  define: {
    __BUILD_DATE__: JSON.stringify(getBuildDate()),
  },
})
