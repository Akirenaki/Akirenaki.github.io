import { useState } from "react";
import { NavLink } from "react-router-dom";
import { profile } from "../data/profile";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-blush/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
        <NavLink to="/" className="font-display text-lg font-medium text-ink" onClick={() => setOpen(false)}>
          {profile.namePreferred}
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
                  isActive ? "text-accent" : "text-ink-soft hover:text-ink"
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
                  isActive ? "text-accent" : "text-ink-soft"
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
