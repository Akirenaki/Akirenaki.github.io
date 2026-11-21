// Ripples of Past Reverie: the extra questions behind the last divider in
// Heimarmene's Questions tab (components/companion/PastReverie.jsx).
//
// This is a passphrase-gated interface, NOT a security boundary. The site is
// static, so these records ship in the JavaScript bundle and a curious visitor
// can read them. The passphrase only decides whether the interface shows them.
//
// `access` holds public verification parameters only. The passphrase itself is
// never stored: `verifier` is what PBKDF2-HMAC-SHA-256 derives from its
// normalised form (lib/normalise-passphrase.js: case, spacing and punctuation
// ignored) with `salt`. Generate `salt`, `verifier` and `normalisation` locally
// with `node scripts/past-reverie-setup.mjs` (it prompts for the passphrase
// without echoing it and writes nothing to disk), then paste the printed lines
// below. If you change `iterations` or the normalisation rules, run the script
// again.
//
// Each ripple:
//   id        unique, lower-case kebab-case, and never the same as an id in
//             data/companion.js
//   question  the text on the button, and the visitor's side of the exchange
//   answer()  returns { text, links }, the same shape as data/companion.js.
//             `text` is plain text. A link is { label, to } for a page on this
//             site or { label, href } for an external address.
//   readFirst optional lock, by id only (see lib/past-reverie-locks.js):
//               readFirst: {
//                 questions: [],  // ripple ids, or public question ids from companion.js
//                 essays: [],     // slugs from data/writing.js
//                 sites: [],      // keys of RIPPLE_SITES below
//               }
//             Everything listed must be done before the ripple opens. Any of
//             the three lists may be left out. A question counts once it has
//             been picked, an essay once its page has been opened, a site once
//             its link has been clicked (honour system). Progress lives in
//             memory only, so a reload starts again.
//
// Ripples are independent of each other's answers: there is deliberately no
// `related` field. Locks are the only link between them.
// Run `node scripts/past-reverie-setup.mjs` to generate a new salt and verifier for a new passphrase, 
// then add new ripples to the `ripples` array. 
// The order of ripples in the array is the order they appear in the interface.

import { findLockProblems, findSiteProblems } from "../lib/past-reverie-locks.js";
import { writing } from "./writing.js";

// Websites a ripple can ask the visitor to open first, by id. Shown as a link in
// the sealed ripple's checklist. Example:
//   "some-site": { label: "Name shown to the visitor", href: "https://example.org/page" },
export const RIPPLE_SITES = {};

export const PAST_REVERIE = {
  access: {
    algorithm: "PBKDF2",
    hash: "SHA-256",
    iterations: 600000,
    salt: "SLbT3qQ0Ku3i/20cVbWHEqf/RimO2WURvHbhmcGt2i8=",
    verifier: "fLMB0J8H/oZz6azJeMGgHORl50eL1lXRvlsP2dmWCso=",
    normalisation: 1,
  },
  ripples: [
    {
      id: "ripple-01",
      question: "What is this section about?",
      answer: () => ({
        text: "“This is Renee speaking—not Heimarmene. In this questions, lies secrets that I wish my comrades would know, yet often would be to dangerous for the world to know.”",
        links: [],
      }),
    },
    {
      id: "ripple-02",
      question: "What do you think defines a woman?",
      answer: () => ({
        text: "“The category ‘woman’ is not reducible to a single necessary-and-sufficient biological property that cleanly includes all cis women while simultaenously exclude trans women.”",
        links: [],
      }),
    },
    {
      id: "ripple-03",
      question: "So, What is your gender identity?",
      readFirst: {
        questions: ["ripple-02"],
        essays: ["gender-analysis-middle-way"],
        sites: [],
      },
      answer: () => ({
        text: "“Regardless, there is also the conventional truth: I am a non-binary trans woman and I use she/they pronouns; the ‘he’ pronoun is only for camouflage. ”",
        links: [],
      }),
    },
  ],
};

export const RIPPLES_BY_ID = new Map(PAST_REVERIE.ripples.map((r) => [r.id, r]));

// ---- build-time validation ------------------------------------------------
// Runs whenever this module is loaded (build, tests), so a bad lock stops the
// build with a message instead of shipping a ripple that can never open.

(function validatePastReverie() {
  const problems = [
    ...findSiteProblems(RIPPLE_SITES),
    ...findLockProblems(PAST_REVERIE.ripples, {
      essaySlugs: new Set(writing.map((w) => w.slug)),
      siteIds: new Set(Object.keys(RIPPLE_SITES)),
    }),
  ];
  if (problems.length > 0) throw new Error(`past-reverie.js: ${problems.join("; ")}`);
})();
