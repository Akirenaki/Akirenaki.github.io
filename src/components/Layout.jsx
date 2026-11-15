import { Outlet } from "react-router";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ConstellationField } from "./ConstellationField";
import { HeimarmeneCompanion } from "./companion/HeimarmeneCompanion";
import { useCompanionPrefs } from "./companion/useCompanionPrefs";

export function Layout() {
  const { prefs } = useCompanionPrefs();
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none fixed inset-0 z-0 print:hidden">
        <ConstellationField className="h-full w-full" speed={prefs.starfieldSpeed} />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <HeimarmeneCompanion />
    </div>
  );
}

// Framework-mode route modules (see src/routes.js's layout() call) are
// resolved by their default export.
export default Layout;
