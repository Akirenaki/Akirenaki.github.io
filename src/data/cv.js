// Content for the printable CV at /print.
//
// The CV is a curated, two-page document, not a dump of every record on the
// site. Everything that is specific to it - the display name, which projects
// appear and in what order, the condensed bullets, which awards and which
// single certification are shown - lives here, so the shared data files
// (profile.js, projects.js, experience.js, awards.js) stay untouched and keep
// feeding Home, About and Work in full.
//
// Canonical facts that may change later (project titles, date ranges, links;
// SAT and IELTS results) are still read from the shared records by slug or
// name. Condensed wording and the condensed roles are stored here.
//
// Spelling follows the CV brief: modelling, visualisation, organisation,
// programme, fertiliser.

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
  displayName: "Renee Astraea",
  headline: "Astrophysics · Scientific Software · Data Analysis",
  summary:
    "Secondary-school student interested in astrophysics, computational methods, and astronomical data analysis. Builds scientific software and interactive tools, with experience in collaborative research, physics modelling, student instruction, and technical project leadership.",
  // Printed as a link to the portfolio homepage. Location, email, LinkedIn and
  // GitHub are read from profile.js; nothing else from profile.contact is used.
  portfolioLabel: "akirenaki.github.io",
};

export const cvEducation = [
  {
    institution: "SMA Negeri 1 Yogyakarta",
    detail: "High School Diploma",
    date: "Expected May 2027",
    note: "Mathematics and Natural Sciences (MIPA); Astronomy Olympiad class.",
  },
  {
    institution: "HarvardX — CS50x: Introduction to Computer Science",
    detail: null,
    date: "Completed 2026",
    note: null,
  },
];

// Names must match `name` in testScores (awards.js). Only the overall score and
// date are printed; section scores stay on the About page.
export const cvTests = [
  { name: "SAT", showMax: true },
  { name: "IELTS Academic", showMax: false },
];

// Order is the order printed. `role` replaces the broader role string in
// projects.js; title and dates are read from the project record by slug.
// `links` lists optional small secondary links, keyed by projects.js `links`.
export const cvProjects = [
  {
    slug: "astronomical-multi-catalog-identifier-matcher",
    role: "Developer · CS50x capstone project",
    links: ["repo"],
    bullets: [
      "Built an asynchronous FastAPI application that resolves astronomical object identifiers and aliases through SIMBAD, then matches host-star records against the NASA Exoplanet Archive.",
      "Implemented five-state resolution reporting, caching, authentication, rate limiting, and automated tests; kept deterministic catalogue matching separate from AI-generated explanations and visualisation.",
    ],
  },
  {
    slug: "project-cherenkov",
    role: "Co-founder & Lead Developer",
    links: ["repo", "demo"],
    bullets: [
      "Co-founded a five-person team and lead development of an open-source, bilingual platform for Indonesian Science Olympiad preparation, pairing informatics, physics, and astronomy editorials with interactive visualisations.",
      "Led development of a platform with seven interactive visualisation engines and a topic-based study planner using a time-decaying Bayesian Beta model; the planner's mastery parameters remain provisional and have not been calibrated against student outcomes.",
    ],
  },
  {
    slug: "starship-rocket",
    role: "Co-designer",
    links: [],
    bullets: [
      "Co-designed a two-stage vehicle simulation for the BIRST 2026 Level 3 challenge, comparing simulated performance with mission targets under modelled wind conditions; results were computational simulations, not a physical flight.",
    ],
  },
  {
    slug: "fishcom",
    role: "Researcher & Co-author",
    links: ["document"],
    bullets: [
      "Co-authored an exploratory study using a nine-stage Borg & Gall R&D framework; sampled soil across three coastal zones at Pantai Baron and fermented fish viscera for 14 days to produce liquid organic fertiliser.",
      "Recorded a fertiliser pH change from 6 to 4 after fermentation. The sampled soil's initial pH was 8; the report does not document a post-treatment soil-pH measurement or a crop-growth trial.",
    ],
  },
  {
    slug: "corgein",
    role: "Team Lead · Three-person team",
    links: [],
    bullets: [
      "Led a three-person team in designing and demonstrating a household-scale electrostatic-precipitator prototype; prepared the presentation and presented the concept to an expert panel at ITB.",
    ],
  },
  {
    slug: "exoplanet-data-insight-assistant",
    role: "Developer",
    links: [],
    bullets: [
      "Built a Langflow-based workflow for exoplanet data analysis as part of the IBM SkillsBuild University Education initiative with Hacktiv8; scored 97.50/100 in the programme's evaluation.",
    ],
  },
];

export const LINK_LABELS = {
  repo: "Repository",
  demo: "Demo",
  presentation: "Presentation",
  document: "Report",
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

// Newest first.
export const cvAwards = [
  {
    title: "Top-five finalist",
    detail: "HMM ITB Mechanical Festival STEM Competition — among approximately 200 teams",
    date: "May 2026",
  },
  {
    title: "Scholar's Laureate",
    detail: "Immerse Education Essay Competition — Philosophy category; 50% partial scholarship",
    date: "February 2026",
  },
  {
    title: "Semifinalist",
    detail: "New Primagama Mencari Juara — Physics Category",
    date: "January 2026",
  },
  {
    title: "Honours List",
    detail: "Immerse Education Essay Competition",
    date: "October 2025",
  },
];

export const cvCertification = {
  label: "Selected certification",
  text: "AI Agent for Data Analysis — Hacktiv8 × IBM",
  date: "July 2026",
};

// Plain groups, no proficiency levels. Only technologies with practical use in
// the portfolio projects are listed.
export const cvSkills = [
  { label: "Programming", items: "Python, TypeScript, JavaScript, SQL, C" },
  { label: "Frameworks & data", items: "FastAPI, Next.js, React, PostgreSQL, SQLAlchemy, Drizzle ORM" },
  { label: "Development & visualisation", items: "Git, Three.js, Canvas 2D, Langflow" },
  { label: "Languages", items: "Indonesian (native); English (IELTS Academic 7.5)" },
];
