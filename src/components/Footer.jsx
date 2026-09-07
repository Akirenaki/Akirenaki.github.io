import { profile } from "../data/profile";

export function Footer() {
  const year = new Date().getFullYear();
  const badges = [
    {
      href: `mailto:${profile.contact.email}`,
      src: "https://img.shields.io/badge/Email-Contact-D8579C?style=flat&logo=gmail&logoColor=white",
      alt: `Email ${profile.contact.email}`,
    },
    {
      href: profile.contact.github.url,
      src: `https://img.shields.io/badge/GitHub-${profile.contact.github.label}-181717?for-the-badge&logo=github&logoColor=white`,
      alt: `GitHub ${profile.contact.github.label}`,
    },
    {
      href: profile.contact.linkedin,
      src: "https://img.shields.io/badge/LinkedIn-Profile-0A66C2?style=flat&logo=linkedin&logoColor=white",
      alt: "LinkedIn profile",
    },
  ];

  return (
    <footer className="border-t border-blush/70 px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-ink-soft md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {profile.namePreferred}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {badges.map((badge) => (
            <a href={badge.href} target="_blank" rel="noreferrer" key={badge.alt}>
              <img src={badge.src} alt={badge.alt} className="h-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
