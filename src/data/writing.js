// Each piece on /writing and /writing/<slug> is generated from one entry here,
// the same way projects.js drives /work. This file is also imported by plain
// Node (react-router.config.js for the prerender list, scripts/build-sitemap.mjs
// for the sitemap), so imports from this folder need the explicit ".js" ending.
//
// ALL SITE TEXT IS ENGLISH: titles, summaries, labels, notes. That holds even for
// a piece whose full text is in another language; `language` states the language
// of the full text and nothing else here is translated or quoted from it. The
// documents themselves are never edited by this site.
//
// Fields
//   slug         URL segment (/writing/<slug>); unique
//   title        English title
//   section      "academic" | "creative"; each entry belongs to exactly one.
//                A section with no entries is not rendered.
//   status       "finished" | "ongoing", or null when not yet recorded (the
//                label is simply left out until it is set)
//   featured     true = also listed under "Featured writing" on Home
//   priority     optional; with `featured`, takes the large first slot on Home,
//                exactly as for projects
//   wordCount    integer for the body of the piece: headings included; the
//                title, tab names, the reference list and URLs in it excluded.
//                Counted from the supplied document as whitespace-separated
//                tokens containing a letter or digit (the Indonesian text for
//                an Indonesian piece). Recount after any substantial edit.
//   language     language of the full text: "English" | "Indonesian"
//   summary      English, three to five sentences, stating the actual argument
//   tags         ids from writing-taxonomy.js, filed under the group keys defined
//                there: { subject, topic, characterFictional, characterReal }.
//                Shown on the entry page, deliberately not on the index.
//   pdf          { path, lastEdited }. The downloadable copy. path is a site path
//                under /essays/. For an essay with a Markdown file, scripts/build-pdfs.mjs
//                generates that PDF at build time (nothing to commit); an entry with no
//                Markdown file needs its PDF committed under public/essays/. lastEdited
//                is ISO 8601 with the +07:00 (WIB) offset and is the "Last edited" stamp.
//
// The full text is not a field here: it is src/essays/<slug>.md, a Markdown
// export of the Google Doc, rendered on the entry page (see lib/essay-text.js).
// wordCount is checked against that file by scripts/check-essays.mjs.
//   otherVersions  [{ label, language, url, embedUrl?, note }]. Versions not shown
//                above (translations, alternative drafts). A version without a
//                `url` is not rendered, so a missing link never shows as a dead
//                one. embedUrl is a Google Docs "Publish to web" link; when set,
//                the live text is embedded and labelled as the current text.
//   googleDocUrl  https link to the piece as a Google Doc, or null. When set, the
//                entry page shows an "Online document" section under the PDF,
//                saying the online copy may be the more current or relevant one.
//                When null the section is not rendered (no dead links).
//   sources      four or five key references, plain text. Omitted from the page
//                when empty.
//   rights       one-line notice; keep in step with the site footer unless a
//                licence is chosen for that piece.
//
// Order: entries are shown in the order of this array (within their section),
// as with projects. Previous/next links on an entry page follow the same order.

import { FACETS, GROUP_KEYS, TAGS_BY_ID } from "./writing-taxonomy.js";

export const SECTIONS = {
  academic: { label: "Academic writing" },
  creative: { label: "Creative writing" },
};

export const STATUSES = {
  finished: "Finished",
  ongoing: "Ongoing",
};

// BCP 47 codes for schema.org's inLanguage.
export const LANGUAGE_CODES = {
  English: "en",
  Indonesian: "id",
};

export const writing = [
  {
    slug: "self-surpassing-il-dottore",
    title: "Can the Pursuit of Power Constitute Self-Surpassing? A Nietzschean Reading of Il Dottore",
    section: "academic",
    status: "ongoing",
    featured: false,
    wordCount: 514,
    language: "English",
    summary:
      "Nietzsche's Zarathustra treats the will to truth as a form of will to power, and describes life as something that continually surpasses itself, even turning against its own creations. The essay asks whether Dottore's pursuit of knowledge changes who he is, or only makes him more ruthless in serving the same aim. It tests that question against three episodes: his erasure of his own Segments, his claimed calm towards setbacks, and his acceptance of the end of his final experiment. In each it finds a shift in priorities without clear proof that his understanding of himself has changed. The conclusion is that surpassing oneself need not mean abandoning an aim, but that it stays unresolved whether the aim has changed Dottore or has absorbed even the prospect of failure.",
    tags: {
      subject: ["philosophy"],
      topic: ["self-surpassing"],
      characterFictional: ["il-dottore", "zarathustra"], 
      characterReal: ["nietzsche"],
    },
    pdf: { path: "/essays/self-surpassing-il-dottore.pdf", lastEdited: "2026-10-20T00:18:44+07:00" },
    otherVersions: [],
    googleDocUrl: null,
    sources: [
      "Friedrich Nietzsche, Thus Spake Zarathustra, Part II, ‘Self-Surpassing’, translated by Thomas Common (Project Gutenberg, eBook no. 1998)",
      "HoYoverse, ‘Where Our Space and Time Intersect’, Genshin Impact, Version Luna IV",
      "HoYoverse, ‘Truth Amongst the Pages of Purana’, Genshin Impact, Version Luna VII",
      "HoYoverse, ‘Where the Boat of Consciousness Lies’, Genshin Impact, Version 3.2",
    ],
    rights: "All rights reserved",
  },
  {
    slug: "gender-analysis-middle-way",
    title: "Gender Analysis using the Lens of the Middle Way",
    section: "academic",
    status: "finished",
    featured: false,
    wordCount: 586,
    language: "English",
    summary:
      "A search for a single necessary and sufficient criterion of gender assumes that gender has an intrinsic nature such a criterion could capture. Using the Madhyamaka arguments from emptiness and dependent origination, the essay argues that every candidate criterion (chromosomes, anatomy, hormones, social role, self-identification) depends on further conditions and concepts, so none can be an ultimate foundation. Because dependence and intrinsic essence exclude each other, gender has no essence. Gender categories nonetheless remain valid and useful as conventions in law, medicine and everyday life. The position is therefore neither essentialism nor nihilism: gender tracks real patterns, but is a conventional designation rather than an intrinsically existing thing.",
    tags: {
      subject: ["philosophy", "sociology"],
      topic: ["dependent-origination", "madhyamaka-buddhism", "emptiness", "gender"],
      characterFictional: [],
      characterReal: [],
    },
    pdf: { path: "/essays/gender-analysis-middle-way.pdf", lastEdited: "2026-07-26T18:51:12+07:00" },
    otherVersions: [],
    googleDocUrl: null,
    // The supplied document has no reference list, so there is nothing to show yet.
    sources: [],
    rights: "All rights reserved",
  },
  {
    slug: "quran-barrier-between-two-seas",
    title: "Analysing Scientific Miracles in the Qur’an: A Barrier Between Two Seas",
    section: "academic",
    status: "finished",
    featured: false,
    wordCount: 2363,
    language: "English",
    summary:
      "Fresh and salt water really can stratify, but a real phenomenon is not a prediction. This essay asks whether the “two seas” verses (Qur’an 55:19–20 and 25:53) are specific and non-obvious enough to count as scientific foreknowledge, and finds that the modern reading supplies most of the detail itself. It tests the claim against what ancient observers could see for themselves, against classical exegesis such as Ibn Kathir’s geographical reading of the separation, and against the meaning of barzakh, which is far broader than “halocline”. It concludes that the verses can reasonably be read as theological description of the natural world that is compatible with oceanography without predicting it.",
    tags: {
      subject: ["religious-studies", "philosophy", "oceanography"],
      topic: [
        "scientific-miracle-claims",
        "falsifiability",
        "underdetermination",
        "confirmation-bias",
        "quranic-exegesis",
        "estuarine-circulation",
        "barzakh",
      ],
      characterFictional: [],
      characterReal: ["ibn-kathir", "pliny-the-elder"],
    },
    pdf: { path: "/essays/quran-barrier-between-two-seas.pdf", lastEdited: "2026-10-20T00:22:36+07:00" },
    otherVersions: [],
    googleDocUrl: null,
    sources: [
      "Qur’an 55:19–20 and 25:53, on the two seas and the barzakh",
      "NOAA Ocean Service, on estuaries",
      "Pliny the Elder, Natural History, on the Bosphorus currents",
      "Ibn Kathir, tafsir of 55:19",
    ],
    rights: "All rights reserved",
  },
  {
    slug: "artificial-consciousness-nature-of-mind",
    title: "Artificial Consciousness and the Nature of the Mind",
    section: "academic",
    status: "finished",
    featured: false,
    wordCount: 539,
    language: "English",
    summary:
      "If an artificial system could suffer, denying it moral consideration solely because it lacks a biological brain would be a moral failure, not merely a technical judgement. The essay asks whether that exclusion reflects a principled theory of mind or only the limits of current explanation. Surveying functionalism, biological naturalism and emergentism, it argues that none gives principled grounds for treating a biological substrate as metaphysically necessary rather than merely sufficient, given what we currently know. Because the uncertainty is real and the moral risk is asymmetric, it concludes that restraint is safer than dismissal, and that denying artificial consciousness reflects epistemic caution rather than philosophical necessity.",
    tags: {
      subject: ["philosophy", "ethics"],
      topic: [
        "consciousness",
        "artificial-intelligence",
        "functionalism",
        "biological-naturalism",
        "emergentism",
        "integrated-information-theory",
        "zombie-argument",
        "moral-status",
        "hard-problem-of-consciousness",
      ],
      characterFictional: [],
      characterReal: ["putnam", "chalmers", "dennett", "searle", "kim", "tononi", "koch", "bentham"],
    },
    pdf: { path: "/essays/artificial-consciousness-nature-of-mind.pdf", lastEdited: "2026-10-20T00:37:26+07:00" },
    otherVersions: [],
    googleDocUrl: null,
    sources: [
      "H. Putnam, Mind, Language and Reality (1975)",
      "D. J. Chalmers, The Conscious Mind: In Search of a Fundamental Theory (1996)",
      "J. R. Searle, ‘Minds, Brains, and Programs’ (1980)",
      "G. Tononi and C. Koch, ‘Consciousness: Here, There and Everywhere?’ (2015)",
      "B. Milinkovic and J. Aru, ‘On Biological and Artificial Consciousness: A Case for Biological Computationalism’ (2026)",
    ],
    rights: "All rights reserved",
  },
  {
    slug: "response-seven-heavens-universe-of-angels",
    title: "A Response to ‘The Secret of the Seven Heavens and the Universe of Angels’",
    section: "academic",
    status: "finished",
    featured: false,
    wordCount: 1067, // Indonesian text, after the redactions became "Anda"; excludes the title, the source line and the closing reading list
    language: "Indonesian",
    summary:
      "This essay responds to a presentation that tries to reconcile Islamic cosmology with science, linking the seven heavens, the angels and the Isra’ Mi’raj to the Fermi paradox and the Kardashev scale. It argues that the case rests on a category error (applying a scale for physical civilisations to metaphysical beings), on equivocation over words such as energy and dimension, and on an argument from ignorance. It adds that the central claims are unfalsifiable and that the reading of the number seven is inconsistent. It closes by suggesting the presentation answers a sincere wish to hold faith and reason together, but does so at the cost of both.",
    tags: {
      subject: ["philosophy", "religious-studies"],
      topic: ["fermi-paradox", "kardashev-scale", "falsifiability", "scientific-miracle-claims", "kardashev-scale"],
      characterFictional: [],
      characterReal: ["karl-marx"],
    },
    pdf: { path: "/essays/response-seven-heavens-universe-of-angels.pdf", lastEdited: "2026-10-20T00:27:34+07:00" },
    otherVersions: [],
    googleDocUrl: null,
    sources: [],
    rights: "All rights reserved",
  },
];

// ---- ordering and Home, mirroring projects.js ------------------------------

export const featuredWriting = writing.filter((w) => w.featured);

export function getBigFeaturedWriting(featuredList = featuredWriting) {
  if (!featuredList || featuredList.length === 0) return null;
  const priorityEntry = featuredList.find((w) => w.priority);
  return priorityEntry || featuredList[0];
}

export function getOrderedFeaturedWriting(featuredList = featuredWriting) {
  const big = getBigFeaturedWriting(featuredList);
  if (!big) return featuredList;
  return [big, ...featuredList.filter((w) => w.slug !== big.slug)];
}

export const entriesInSection = (sectionKey) => writing.filter((w) => w.section === sectionKey);

// ---- display helpers (deterministic: same output at prerender and in the browser) ----

export const formatWordCount = (n) => `${new Intl.NumberFormat("en-GB").format(n)} words`;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// "2026-10-17T14:30:00+07:00" -> "17 October 2026, 14:30 WIB". Parsed from the
// string rather than through Intl, so no time-zone conversion can creep in.
export function formatLastEdited(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}, ${m[4]}:${m[5]} WIB`;
}

// The small facts line used on cards and on the entry page.
export function entryMeta(entry) {
  return [
    `Full text: ${entry.language}`,
    formatWordCount(entry.wordCount),
    entry.status ? STATUSES[entry.status] : null,
  ].filter(Boolean);
}

// ---- build-time validation ------------------------------------------------
// Runs whenever this module is loaded (build, prerender list, sitemap), so a
// mistake in an entry stops the build with a message instead of shipping.

(function validateWriting() {
  const slugs = new Set();
  for (const w of writing) {
    const where = `writing.js: "${w.slug}"`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(w.slug)) throw new Error(`${where}: slug must be lower-case kebab-case`);
    if (slugs.has(w.slug)) throw new Error(`${where}: duplicate slug`);
    slugs.add(w.slug);
    if (!SECTIONS[w.section]) throw new Error(`${where}: section must be one of ${Object.keys(SECTIONS).join(", ")}`);
    if (w.status !== null && !STATUSES[w.status]) throw new Error(`${where}: status must be finished, ongoing or null`);
    if (!LANGUAGE_CODES[w.language]) throw new Error(`${where}: language must be one of ${Object.keys(LANGUAGE_CODES).join(", ")}`);
    if (!Number.isInteger(w.wordCount) || w.wordCount <= 0) throw new Error(`${where}: wordCount must be a positive integer`);
    if (!w.summary?.trim()) throw new Error(`${where}: summary is required`);
    if (!/^\/essays\/[^/]+\.pdf$/.test(w.pdf?.path ?? "")) throw new Error(`${where}: pdf.path must look like /essays/<name>.pdf`);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+07:00$/.test(w.pdf?.lastEdited ?? "")) {
      throw new Error(`${where}: pdf.lastEdited must be ISO 8601 with the +07:00 offset`);
    }
    for (const key of Object.keys(w.tags ?? {})) {
      if (!GROUP_KEYS.includes(key)) throw new Error(`${where}: unknown tag group "${key}"`);
    }
    for (const key of GROUP_KEYS) {
      for (const id of w.tags?.[key] ?? []) {
        const tag = TAGS_BY_ID.get(id);
        if (!tag) throw new Error(`${where}: tag "${id}" is not defined in writing-taxonomy.js`);
        if (tag.group !== key) throw new Error(`${where}: tag "${id}" belongs under "${tag.group}", not "${key}"`);
      }
    }
    if (w.googleDocUrl !== null && w.googleDocUrl !== undefined && !/^https:\/\/(docs|drive)\.google\.com\//.test(w.googleDocUrl)) {
      throw new Error(`${where}: googleDocUrl must be an https://docs.google.com/ (or drive.google.com) link, or null`);
    }
    for (const v of w.otherVersions ?? []) {
      if (!v.label || !v.language || !v.note) throw new Error(`${where}: each otherVersions item needs label, language and note`);
      if (v.url !== null && !/^https:\/\//.test(v.url ?? "")) throw new Error(`${where}: otherVersions url must be https:// or null`);
      if (v.embedUrl && !/^https:\/\//.test(v.embedUrl)) throw new Error(`${where}: embedUrl must be https://`);
    }
  }
  // FACETS is referenced so an empty/broken taxonomy import fails here, not later.
  if (!FACETS.length) throw new Error("writing.js: taxonomy has no facets");
})();

// Tag ids an entry carries within one facet (the union of the facet's groups),
// so "any character" matches fictional and real alike.
export const tagIdsInFacet = (entry, facet) => facet.groups.flatMap((g) => entry.tags[g.key] ?? []);
