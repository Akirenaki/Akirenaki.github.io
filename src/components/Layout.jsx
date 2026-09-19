import { Outlet } from "react-router";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ConstellationField } from "./ConstellationField";

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none fixed inset-0 z-0">
        <ConstellationField className="h-full w-full" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

// Framework-mode route modules (see src/routes.js's layout() call) are
// resolved by their default export.
export default Layout;
