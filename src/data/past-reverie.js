// Ripples of Past Reverie: the extra questions behind the last divider in
// Heimarmene's Questions tab (components/companion/PastReverie.jsx).
//
// This is a passphrase-gated interface, NOT a security boundary. The site is
// static, so these records ship in the JavaScript bundle and a curious visitor
// can read them. The passphrase only decides whether the interface shows them.
//
// `access` holds public verification parameters only. The passphrase itself is
// never stored: `verifier` is what PBKDF2-HMAC-SHA-256 derives from it with
// `salt`. Generate both locally with `node scripts/past-reverie-setup.mjs`
// (it prompts for the passphrase without echoing it and writes nothing to
// disk), then paste the printed `salt` and `verifier` below. If you change
// `iterations`, run the script again.
//
// Each ripple:
//   id        unique, lower-case kebab-case, and never the same as an id in
//             data/companion.js
//   question  the text on the button, and the visitor's side of the exchange
//   answer()  returns { text, links }, the same shape as data/companion.js.
//             `text` is plain text. A link is { label, to } for a page on this
//             site or { label, href } for an external address.
//
// Ripples are independent: there is deliberately no `related` field.

export const PAST_REVERIE = {
  access: {
    algorithm: "PBKDF2",
    hash: "SHA-256",
    iterations: 600000,
    salt: "X61MItJz6bQRWvIy7FqC0xfgxNpEioThaA7aBWjRVGo=",
    verifier: "Eo4MGoEuvOn794e2u/lcntHjli24IG9WCf2jqqeZrDY=",
  },
  ripples: [
    {
      id: "ripple-01",
      question: "What is this section about?",
      answer: () => ({
        text: "In this questions, lies secrets that I wish my comrades would know, yet often would be to dangerous for the world to know",
        links: [],
      }),
    },
    {
      id: "ripple-02",
      question: "What do you think defines a woman?",
      answer: () => ({
        text: "The category ‘woman’ is not reducible to a single necessary-and-sufficient biological property that cleanly includes all cis women while simultaenously exclude trans women.",
        links: [],
      }),
    },
    {
      id: "ripple-03",
      question: "So, What is your gender identity?",
      answer: () => ({
        text: "Regardless, there is also the conventional truth: I am a non-binary trans woman and I use she/they pronouns; the \"he\" pronoun is only for camouflage. ",
        links: [],
      }),
    },
  ],
};

export const RIPPLES_BY_ID = new Map(PAST_REVERIE.ripples.map((r) => [r.id, r]));
