// Content for the printable CV at /print.
//
// The CV is a curated, two-page document, not a dump of every record on the
// site. CV-specific wording and groupings live here, while selected records are
// read from the shared data files.
//
// What the CV selects is data-driven, so it cannot drift from the rest of the
// site:
//   - Projects: every project in projects.js whose `scale` is "flagship" or
//     "standard" is included automatically; "mini" projects never are. Titles,
//     date ranges and links are read from the project record. Condensed
//     wording lives in `cvProjectWording` below (optional; a project without an
//     entry falls back to its own `cv` lines, then to its `summary`).
//   - Awards: every entry in awards.js is included automatically, newest
//     first. An entry can set `cv: { title, detail }` for tighter CV wording,
//     or `cv: false` to leave it off the CV.
//   - Certifications: the entry in awards.js marked `onCV: true` is included.
//   - Test scores are read from awards.js, including any newly added records.
// Teaching, leadership and service entries and skills groups are curated here,
// because their wording and grouping differ from the full records.
//
// Spelling follows the CV brief: modelling, visualisation, organisation,
// programme, fertiliser.

import { projects } from "./projects.js";
import { awards, certifications, testScores } from "./awards.js";
import { profile } from "./profile.js";

// "Jun 2026 - Present" -> "June 2026 – Present". The shared records abbreviate
// months and use a plain hyphen; the CV prints full month names and en dashes.
const MONTHS = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Sept: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

export function formatCvDate(text = "") {
  return text
    .replace(/\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)\b/g, (m) => MONTHS[m])
    .replace(/\s+-\s+/g, " – ");
}

export const cvProfile = {
  displayName: profile.preferredNameHome,
  headline: "Astrophysics · Scientific Software · Data Analysis",
  summary:
    "Secondary-school student interested in astrophysics, computational methods, and astronomical data analysis. Builds scientific software and interactive tools, with experience in collaborative research, physics modelling, student instruction, and technical project leadership.",
};

export const cvEducation = profile.education.map((education) => ({
  institution: education.institution,
  detail: education.degree,
  date: education.dateLabel,
}));

// Print the overall scores from awards.js; section scores stay on the About page.
export const cvTestScores = testScores.map((test) => ({
  name: test.name,
  score: `${test.value.toFixed(test.decimals)}/${test.max.toFixed(test.decimals)}`,
  date: formatCvDate(test.date),
}));

// Only these project scales appear on the CV (see SCALES in projects.js).
// Flagship projects print first, then standard ones; within a scale the order
// is the order in projects.js.
const CV_SCALES = ["flagship", "standard"];

// Optional condensed wording, keyed by project slug. `role` replaces the
// broader role string in projects.js; `bullets` replace the automatic text;
// `links` lists the project links to print, keyed by projects.js `links`
// (default: every available project link).
const cvProjectWording = {
  "astronomical-multi-catalog-identifier-matcher": {
    role: "Developer · CS50x capstone project",
    bullets: [
      "Built an asynchronous FastAPI application that resolves astronomical object identifiers and aliases through SIMBAD, then matches host-star records against the NASA Exoplanet Archive.",
      "Implemented five-state resolution reporting, caching, authentication, rate limiting, and automated tests; kept deterministic catalogue matching separate from AI-generated explanations and visualisation.",
    ],
  },
  "project-cherenkov": {
    role: "Co-founder & Lead Developer",
    bullets: [
      "Co-founded a five-person team and lead development of an open-source, bilingual platform for Indonesian Science Olympiad preparation, pairing informatics, physics, and astronomy editorials with interactive visualisations.",
      "Led development of a platform with seven interactive visualisation engines and a topic-based study planner using a time-decaying Bayesian Beta model; the planner's mastery parameters remain provisional and have not been calibrated against student outcomes.",
    ],
  },
  fishcom: {
    role: "Researcher & Co-author",
    bullets: [
      "Co-authored an exploratory study using a nine-stage Borg & Gall R&D framework; sampled soil across three coastal zones at Pantai Baron and fermented fish viscera for 14 days to produce liquid organic fertiliser.",
      "Recorded a fertiliser pH change from 6 to 4 after fermentation. The sampled soil's initial pH was 8; the report does not document a post-treatment soil-pH measurement or a crop-growth trial.",
    ],
  },
  corgein: {
    role: "Team Lead · Three-person team",
    bullets: [
      "Led a three-person team in designing and demonstrating a household-scale electrostatic-precipitator prototype; prepared the presentation and presented the concept to an expert panel at ITB.",
    ],
  },
};

// Fallback for a project with no condensed wording: its own CV lines from
// projects.js, or its summary if it has none.
function automaticBullets(project) {
  if (project.cv) {
    return [
      project.cv.problem && `Problem: ${project.cv.problem}`,
      project.cv.approach && `Approach: ${project.cv.approach}`,
      project.cv.impact && `Impact: ${project.cv.impact}`,
    ].filter(Boolean);
  }
  return [project.summary];
}

// Resolved, print-ready project entries. Nothing here is typed by hand per
// project except the optional wording above.
export const cvProjects = CV_SCALES.flatMap((scale) =>
  projects.filter((project) => project.scale === scale),
).map((project) => {
  const wording = cvProjectWording[project.slug] ?? {};
  return {
    slug: project.slug,
    title: project.title,
    dateRange: project.dateRange,
    role: wording.role ?? project.role,
    links: (wording.links ?? Object.keys(project.links ?? {}))
      .map((key) => ({ key, url: project.links?.[key] }))
      .filter((link) => link.url),
    bullets: wording.bullets ?? automaticBullets(project),
  };
});

export const LINK_LABELS = {
  repo: "Repository",
  demo: "Demo",
  presentation: "Presentation",
  document: "Report",
  video: "Video",
};

// Newest first. `group` entries are rendered under one organisation heading
// with compact sub-entries, so the organisation is not repeated on every line.
// The IDR 40 million community funding for GIAT is deliberately omitted: it was
// the event's funding, not an amount raised or managed personally.
export const cvExperience = [
  {
    title: "Astronomy Olympiad Mentor",
    org: "SMA Negeri 1 Yogyakarta",
    date: "July 2026 – Present",
    bullets: [
      "Mentor junior members of the school's Astronomy Olympiad class in mathematical foundations and introductory astrophysics for OSN preparation.",
      "Teach functions, trigonometry, vectors, and calculus through OSN-style problems; develop progressive exercises to strengthen mathematical reasoning and physical intuition.",
    ],
  },
  {
    title: "Astronomy Olympiad Class Member & School Representative",
    org: "SMA Negeri 1 Yogyakarta",
    date: "July 2024 – August 2026",
    bullets: [
      "Selected for the school's advanced Astronomy Olympiad class through competitive placement testing; represented the school at city- and provincial-level OSN competitions.",
    ],
  },
  {
    org: "Pengurus Oeamat Harian (POH) — School Student Organisation",
    group: [
      {
        title: "Community Advocacy & Liturgical Communications Officer",
        date: "November 2024 – Present",
        bullets: [
          "Led the organisation's Masjid Department, coordinating educational sessions, routine services, and event logistics.",
        ],
      },
      {
        title: "Supply Chain & Distribution Chief, GIAT 1446 H",
        date: "May 2025 – June 2025",
        bullets: [
          "Coordinated volunteer deployment, packaging, and last-mile distribution of perishable goods, using demographic records to guide household allocation.",
        ],
      },
      {
        title: "Master of Ceremonies, GRT 1446 H",
        date: "February 2025 – March 2025",
        bullets: [
          "Served as primary master of ceremonies for a school gathering of more than 300 attendees, managing programme timing and transitions.",
        ],
      },
    ],
  },
];

// "Jun 2026" -> a sortable number, so the CV stays newest-first even if an
// award is added out of order in awards.js. Unparseable dates sort last.
const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateKey(text = "") {
  const match = text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{4})\b/);
  return match ? Number(match[2]) * 12 + MONTH_ORDER.indexOf(match[1]) : -1;
}

// Every award in awards.js, newest first. Wording falls back to the award's
// own title and issuer when it has no `cv` override.
export const cvAwards = awards
  .filter((award) => award.cv !== false)
  .map((award, index) => ({
    title: award.cv?.title ?? award.title,
    detail: award.cv?.detail ?? award.issuer,
    date: formatCvDate(award.date),
    key: dateKey(award.date),
    index,
  }))
  .sort((a, b) => b.key - a.key || a.index - b.index)
  .map(({ title, detail, date }) => ({ title, detail, date }));

const cvCertifications = certifications.filter((certification) => certification.onCV);
if (cvCertifications.length !== 1) {
  throw new Error(`cv.js: expected exactly one certification with onCV: true, found ${cvCertifications.length}`);
}
export const cvCertification = cvCertifications[0];

// Plain groups, no proficiency levels. Only technologies with practical use in
// the portfolio projects are listed.
export const cvSkills = [
  { label: "Programming", items: "Python, TypeScript, JavaScript, SQL, C" },
  { label: "Frameworks & data", items: "FastAPI, Next.js, React, PostgreSQL, SQLAlchemy, Drizzle ORM" },
  { label: "Development & visualisation", items: "Git, Three.js, Canvas 2D, Langflow" },
  { label: "Languages", items: "Indonesian (native); English (IELTS Academic 7.5)" },
];
