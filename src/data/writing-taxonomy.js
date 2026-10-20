// The one place tags are defined. Entries in writing.js refer to tags by id,
// so a concept is never spelled two ways, and the build fails loudly (see
// validateWriting in writing.js) if an entry uses an id that isn't defined
// here or files it under the wrong group.
//
// Structure
//   FACET   a top-level filter on /writing (Subject, Topic, Character).
//           Facet keys are also the URL parameters: /writing?subject=philosophy
//   GROUP   where tags actually live. Most facets have one group; Character has
//           two (fictional and real), which is what makes the filter hierarchical.
//           A group's `key` is the key an entry uses in its own `tags` object.
//           A group's `label` is only shown when its facet has more than one.
//   TAG     { id, label, original?, originalLang? }
//             id            lower-case ASCII kebab-case, unique across the WHOLE file
//             label         the English term
//             original      the term in its source language, when there is a useful one
//             originalLang  BCP 47 tag for `original`, used as the lang attribute
//                           ("de", "ar", "sa-Latn" for romanised Sanskrit)
//           Sanskrit terms use IAST for `original` (Pratītyasamutpāda, Śūnyatā) with
//           the English term as `label`. Proper names with no useful translation
//           (Madhyamaka Buddhism, people, characters) use `label` only.
//
// To add a new facet, add an object to FACETS. Nothing else in the code names a
// facet: the filter, the entry-page tag list and the URL parameters are all
// built from this array. Tags nobody uses yet are simply not shown on /writing.
// Tag order here is the display order.

export const FACETS = [
  {
    key: "subject",
    label: "Subject",
    groups: [
      {
        key: "subject",
        tags: [
          { id: "ethics", label: "Ethics" },
          { id: "oceanography", label: "Oceanography" },
          { id: "philosophy", label: "Philosophy" },
          { id: "religious-studies", label: "Religious studies" },
          { id: "sociology", label: "Sociology" },
        ],
      },
    ],
  },
  {
    key: "topic",
    label: "Topic",
    groups: [
      {
        key: "topic",
        tags: [
          { id: "artificial-intelligence", label: "Artificial intelligence" },
          { id: "barzakh", label: "Barzakh", original: "بَرْزَخ", originalLang: "ar" },
          { id: "biological-naturalism", label: "Biological naturalism" },
          { id: "confirmation-bias", label: "Confirmation bias" },
          { id: "consciousness", label: "Consciousness" },
          {
            id: "dependent-origination",
            label: "Dependent origination",
            original: "Pratītyasamutpāda",
            originalLang: "sa-Latn",
          },
          { id: "emergentism", label: "Emergentism" },
          { id: "emptiness", label: "Emptiness", original: "Śūnyatā", originalLang: "sa-Latn" },
          { id: "estuarine-circulation", label: "Estuarine circulation" },
          { id: "falsifiability", label: "Falsifiability" },
          { id: "fermi-paradox", label: "Fermi paradox" },
          { id: "functionalism", label: "Functionalism" },
          { id: "gender", label: "Gender" },
          { id: "hard-problem-of-consciousness", label: "Hard problem of consciousness" },
          { id: "kardashev-scale", label: "Kardashev scale" },
          { id: "integrated-information-theory", label: "Integrated information theory" },
          { id: "madhyamaka-buddhism", label: "Madhyamaka Buddhism" },
          { id: "moral-status", label: "Moral status" },
          { id: "quranic-exegesis", label: "Quranic exegesis" },
          { id: "scientific-miracle-claims", label: "Scientific-miracle claims" },
          {
            id: "self-surpassing",
            label: "Self-surpassing",
            original: "Selbstüberwindung",
            originalLang: "de",
          },
          { id: "underdetermination", label: "Underdetermination" },
          { id: "zombie-argument", label: "Zombie argument" },
        ],
      },
    ],
  },
  {
    key: "character",
    label: "Character",
    groups: [
      {
        key: "characterFictional",
        label: "Fictional",
        tags: [
          { id: "il-dottore", label: "Il Dottore" },
          { id: "zarathustra", label: "Zarathustra" }
        ],
      },
      {
        key: "characterReal",
        label: "Real",
        tags: [
          { id: "bentham", label: "Jeremy Bentham" },
          { id: "chalmers", label: "David Chalmers" },
          { id: "dennett", label: "Daniel Dennett" },
          { id: "ibn-kathir", label: "Ibn Kathir" },
          { id: "kim", label: "Jaegwon Kim" },
          { id: "karl-marx", label: "Karl Marx" },
          { id: "koch", label: "Christof Koch" },
          { id: "nietzsche", label: "Friedrich Nietzsche" },
          { id: "pliny-the-elder", label: "Pliny the Elder" },
          { id: "putnam", label: "Hilary Putnam" },
          { id: "searle", label: "John Searle" },
          { id: "tononi", label: "Giulio Tononi" },
        ],
      },
    ],
  },
];

// ---- derived lookups (no need to edit below this line) -------------------

export const GROUP_KEYS = FACETS.flatMap((f) => f.groups.map((g) => g.key));

// id -> { ...tag, group, facet }
export const TAGS_BY_ID = new Map(
  FACETS.flatMap((facet) =>
    facet.groups.flatMap((group) => group.tags.map((tag) => [tag.id, { ...tag, group: group.key, facet: facet.key }])),
  ),
);

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Catches typos in this file at build time rather than as a silent filter bug.
(function validateTaxonomy() {
  const seen = new Set();
  const facetKeys = new Set();
  const groupKeys = new Set();
  for (const facet of FACETS) {
    if (facetKeys.has(facet.key)) throw new Error(`writing-taxonomy: duplicate facet key "${facet.key}"`);
    facetKeys.add(facet.key);
    for (const group of facet.groups) {
      if (groupKeys.has(group.key)) throw new Error(`writing-taxonomy: duplicate group key "${group.key}"`);
      groupKeys.add(group.key);
      for (const tag of group.tags) {
        if (!ID_PATTERN.test(tag.id)) throw new Error(`writing-taxonomy: tag id "${tag.id}" must be lower-case ASCII kebab-case`);
        if (seen.has(tag.id)) throw new Error(`writing-taxonomy: tag id "${tag.id}" is defined twice`);
        seen.add(tag.id);
        if (tag.original && !tag.originalLang) {
          throw new Error(`writing-taxonomy: tag "${tag.id}" has an original term but no originalLang`);
        }
      }
    }
  }
})();
