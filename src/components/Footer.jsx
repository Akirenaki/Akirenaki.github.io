import { profile } from "../data/profile";
import { SocialLinks } from "./SocialLinks";
import { VisitorCount } from "./VisitorCount";
import { HeimarmeneFooterButton } from "./companion/HeimarmeneCompanion";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-blush/70 px-5 py-10 md:px-8 print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-ink-soft">
          <p>
            © {year} {profile.preferredNameHome}. All rights reserved.
          </p>
          {typeof __BUILD_DATE__ !== "undefined" && __BUILD_DATE__ && (
            <p className="mt-0.5 text-xs text-ink-soft">
              Last Updated On: {new Date(__BUILD_DATE__).toLocaleString()}
            </p>
          )}
          <VisitorCount />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SocialLinks variant="compact" only={["email", "github", "linkedin"]} />
          <HeimarmeneFooterButton />
        </div>
      </div>
    </footer>
  );
}
