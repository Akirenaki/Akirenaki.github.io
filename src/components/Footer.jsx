import { profile } from "../data/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-blush/70 px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-ink-soft md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {profile.namePreferred}. Built with intent, not a template.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <a href={profile.contact.github.url} className="hover:text-accent" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.contact.linkedin} className="hover:text-accent" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.contact.kaggle.url} className="hover:text-accent" target="_blank" rel="noreferrer">
            Kaggle
          </a>
        </div>
      </div>
    </footer>
  );
}
