import { useState } from "react";
import { NavLink } from "react-router";
import { profile } from "../data/profile";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/work", label: "Work" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-blush/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
        {/* Bare logo, no tile or frame: both made it smaller and paler. The pink
            and pale blue are faint on the pale navbar, so the filter deepens the
            tone a little (pink ~2.4:1 -> ~3.0:1, purple ~5:1 -> ~6:1). Remove the
            two filter classes to get the logo's original colours back. 44px
            matches the mobile menu button, so the header height doesn't change. */}
        <NavLink
          to="/"
          aria-label={`${profile.preferredNameHome} - home`}
          className="shrink-0 rounded-full"
          onClick={() => setOpen(false)}
        >
          <picture>
            <source srcSet={`${import.meta.env.BASE_URL}assets/logo.webp`} type="image/webp" />
            <img
              src={`${import.meta.env.BASE_URL}assets/logo.png`}
              alt=""
              width="44"
              height="44"
              className="block h-11 w-11 saturate-[1.35] brightness-[.86]"
              decoding="async"
            />
          </picture>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? "text-accent-deep" : "text-ink-soft hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-blush/70 px-5 pb-4 md:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-md px-2 py-3 text-base ${
                  isActive ? "text-accent-deep" : "text-ink-soft"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
