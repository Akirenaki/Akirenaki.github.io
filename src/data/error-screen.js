// The corrupted error screen: the 404 page and the fallback for any other error
// (components/CorruptedScreen.jsx). Everything a visitor reads on it lives here,
// so you can reword it without touching any component.
//
// Two screens:
//   notFound  shown for any address that matches no page (src/pages/NotFound.jsx)
//   error     shown when a page crashes (the ErrorBoundary in src/root.jsx)
//
// Each screen:
//   code      the large glitching characters. Anything short works: "404", "???".
//   heading   the page's <h1>
//   body      one or two plain sentences saying what happened and what to do
//   cta       the main button: { label, to } for a page on this site. The error
//             screen's button reloads the page instead, so it only has a label.
//   flavour   your extra lines. One is picked at random after the page loads, and
//             "Show another fragment" swaps it for a different one. Write as many
//             as you like (at least one). {path} becomes the address the visitor
//             asked for, e.g. /work/nothing-here. The error screen has no
//             address, so {path} is simply left out there.
//
// Keep `heading` and `body` literal: they tell a visitor what went wrong. Put
// the voice in `flavour`.

export const ERROR_SCREEN = {
  notFound: {
    code: "404",
    heading: "Nothing is stored at this address",
    body: "This page was corrupted, moved, or never existed. The pages that do exist are one step back.",
    cta: { label: "Return to the home page", to: "/" },
    flavour: [
      "The Black Tide has reached {path}, leaving nothing behind but corrupted remnants.",
      "Heimarmene searched through every entry of Vectors of Fate. {path} is not on any of them.",
      "Some light arrives long after its star has gone. Perhaps {path} too has disappeared a long time ago.",
      "Some say that Akivili the Trailblaze fell trying to find {path} on the Imaginary Tree.",
      "Even Heimarmene (Fate) cannot guide you to a slate that was never carved.",
    ],
  },
  error: {
    code: "ERR",
    heading: "This page broke while loading",
    body: "Something went wrong on this page, and it is not your doing. Reloading usually fixes it; if it does not, the home page still works.",
    cta: { label: "Reload the page" },
    homeLabel: "Return to the home page",
    flavour: [
      "The Destruction Equation spread further than expected. A reload usually quells it.",
      "Something in the signal tore. Nothing of yours was lost.",
      "The ripples reached this page before it finished forming.",
    ],
  },
  // The button that swaps the flavour line.
  anotherLabel: "Show another fragment",
};

// Fills {path} into a flavour line. With no path the token and the space
// before it are dropped, so a line never ends up reading "lived at  did not".
export function fillFlavour(line, path) {
  if (path) return line.replaceAll("{path}", path);
  return line.replaceAll(/\s?\{path\}/g, "");
}

// A random index that differs from `current` whenever there is a choice.
export function pickFragment(count, current = -1, random = Math.random) {
  if (count <= 1) return 0;
  let next = Math.floor(random() * count);
  if (next === current) next = (next + 1) % count;
  return next;
}
