// Awards & competitions, newest first. Shown in full on About; the printable CV
// (/print) reads this list too, so a new entry here appears on the CV with no
// further edit. Optional `cv: { title, detail }` sets tighter CV wording
// (otherwise the CV prints `title` and `issuer`); `cv: false` keeps an entry off
// the CV. `image` points at a file under public/assets/credentials/; until the
// file exists the page shows a "Photo pending" placeholder.
export const awards = [
  {
    title: "OSIFOG / BIRST 2026 (Level III, International) - Silver Tier, Rank 16",
    issuer: "Olimpíada Brasileira de Simulação de Foguetes (OSIFOG) | Brazilian International Rocket Simulation Tournament (BIRST)",
    date: "Sep 2026",
    image: "/assets/credentials/award-osifog-birst-silver.jpg",
    credentialId: "",
    credentialUrl: "",
    detail:
      "Silver tier, ranked 16th at the international level (Level III, Falcon rocket) with a score of −3,150,147.609, as team Semoga Menang 6767 with the Starship V3 two-stage retropropulsive landing simulation. Medals are awarded by tier, not by position. The organisers note that the score is an internal metric used to order projects, and that a negative score can still rank among the best in the world.",
    cv: {
      title: "Silver tier, ranked 16th",
      detail: "OSIFOG / BIRST 2026 Rocket Simulation Tournament, Level III (international)",
    },
  },
  {
    title: "OSN-K Astronomy (City Level, SMA) - 3rd Place",
    issuer: "Dinas Pendidikan, Pemuda, dan Olahraga DIY",
    date: "Jun 2026",
    image: "/assets/credentials/award-osn-k-astronomi-juara-3.jpg",
    credentialId: "",
    credentialUrl: "",
    detail:
      "Third place in Astronomy at the Yogyakarta city-level National Science Olympiad (OSN-K), run online by the Indonesian Talent Development Agency (BPTI) with the DIY Education Office.",
    cv: {
      title: "Third place",
      detail: "OSN-K Astronomy, Yogyakarta city level (SMA)",
    },
  },
  {
    title: "HMM ITB Mechanical Festival - STEM Competition Finalist",
    issuer: "HMM ITB (Institut Teknologi Bandung)",
    date: "May 2026",
    image: "/assets/credentials/award-hmm-itb-mechanical-festival.jpg",
    credentialId: "",
    credentialUrl: "",
    detail:
      "Top 5 national finalist out of ~200 teams; led a 3-person team through a Design Thinking challenge addressing SDG-aligned clean energy, sanitation, and infrastructure problems, presented before an expert panel at ITB Ganesha.",
    cv: {
      title: "Top-five finalist",
      detail: "HMM ITB Mechanical Festival STEM Competition — among approximately 200 teams",
    },
  },
  {
    title: "Immerse Education Essay Competition - Scholar's Laureate",
    issuer: "Immerse Education",
    date: "Feb 2026",
    image: "/assets/credentials/award-immerse-scholar-laureate.jpg",
    credentialId: "",
    credentialUrl: "",
    detail:
      "50% partial scholarship for an essay in the Philosophy category, evaluated by a panel from leading universities.",
    cv: {
      title: "Scholar's Laureate",
      detail: "Immerse Education Essay Competition — Philosophy category; 50% partial scholarship",
    },
  },
  {
    title: "Semifinalist of New Primagama Mencari Juara Physics Category",
    issuer: "New Primagama",
    date: "Jan 2026",
    image: "/assets/credentials/award-new-primagama.jpg",
    credentialId: "",
    credentialUrl: "",
    detail:
      "Semifinalist in the Physics category of the New Primagama Mencari Juara competition.",
    cv: {
      title: "Semifinalist",
      detail: "New Primagama Mencari Juara — Physics Category",
    },
  },
  {
    title: "Immerse Education Essay Competition - Honours List",
    issuer: "Immerse Education",
    date: "Oct 2025",
    image: "/assets/credentials/award-immerse-honours-list.jpg",
    credentialId: "",
    credentialUrl: "",
    cv: {
      title: "Honours List",
      detail: "Immerse Education Essay Competition",
    },
  },
  {
    title: "Finalist of New Primagama Mencari Juara Physics Category",
    issuer: "New Primagama",
    date: "Jan 2025",
    image: "/assets/credentials/award-new-primagama-finalist.jpg",
    credentialId: "",
    credentialUrl: "",
    cv: {
      title: "Finalist",
      detail: "New Primagama Mencari Juara — Physics Category",
    },
  }
];

// Set `onCV` to true for the single certification selected for the printable CV.
export const certifications = [
  {
    title: "LLM-Based Tools & Gemini API Integration for Data Scientists",
    issuer: "Hacktiv8 x AVPN",
    date: "Sept 2026",
    onCV: false,
    image: "/assets/credentials/certification-llm-based-tools-gemini-api-integration.jpg",
    credentialId: "09904/H8/CSR/MBA2/IX/2026",
    credentialUrl: "https://students.hacktiv8.com/certificates/5278ee5d-3179-4ded-878a-f4b0f87c4eca",
  },
  {
    title: "AI Agent for Data Analysis",
    issuer: "Hacktiv8 x IBM",
    date: "Jul 2026",
    onCV: true,
    image: "/assets/credentials/certification-ai-agent-data-analysis.jpg",
    credentialId: "00918/H8/CSR/ISUE/V/2026",
    credentialUrl: "https://students.hacktiv8.com/certificates/3bafb54b-78ee-42e7-aae4-19faf2505ec6",
  },
  {
    title: "AI Literacy",
    issuer: "IBM",
    date: "May 2026",
    onCV: false,
    image: "/assets/credentials/certification-ai-literacy.jpg",
    credentialId: "7522a184-3d1b-4667-82ee-c0e7e0072669",
    credentialUrl: "https://www.credly.com/badges/7522a184-3d1b-4667-82ee-c0e7e0072669/",
  },
  {
    title: "Getting Started with Data",
    issuer: "IBM",
    date: "May 2026",
    onCV: false,
    image: "/assets/credentials/certification-getting-started-with-data.jpg",
    credentialId: "bfc792bf-500c-4f2a-b6af-e907e2d940f6",
    credentialUrl: "https://www.credly.com/badges/bfc792bf-500c-4f2a-b6af-e907e2d940f6",
  },
  {
    title: "Intro to Data Analytics",
    issuer: "RevoU",
    date: "May 2026",
    onCV: false,
    image: "/assets/credentials/certification-intro-to-data-analytics.jpg",
    credentialId: "DAMC-110526-01-1-00178",
    credentialUrl: "https://drive.google.com/file/d/1aeAPANmi7liEMRlyydGqnS8lrhoMY2ep/view?pli=1",
  },
  {
    title: "Introduction to Software Engineering",
    issuer: "RevoU",
    date: "May 2026",
    onCV: false,
    image: "/assets/credentials/certification-introduction-to-software-engineering.jpg",
    credentialId: "CCSE 270426-01-1-00009",
    credentialUrl: "https://drive.google.com/file/d/1JCPZAtDwT-EUjwUjE8x12bnEj64OrleU/view?pli=1",
  },
  {
    title: "Intro to SQL",
    issuer: "Kaggle",
    date: "Mar 2026",
    onCV: false,
    image: "/assets/credentials/certification-intro-to-sql.jpg",
    credentialId: "",
    credentialUrl: "https://www.kaggle.com/learn/certification/reneeastraea/intro-to-sql",
  },
  {
    title: "Python",
    issuer: "Kaggle",
    date: "Mar 2026",
    onCV: false,
    image: "/assets/credentials/certification-python.jpg",
    credentialId: "",
    credentialUrl: "https://www.kaggle.com/learn/certification/reneeastraea/python",
  },
];

// Technical stack for the About page - "daily" vs "worked with", drawn from
// what's actually used across the projects in projects.js plus other known work.
export const technicalStack = {
  daily: ["Python", "TypeScript / JavaScript", "FastAPI", "Next.js / React", "SQL", "Git"],
  workedWith: [
    "PostgreSQL",
    "SQLAlchemy",
    "Drizzle ORM",
    "Google Gemini API",
    "Langflow",
    "Tailwind CSS",
    "C (incl. low-level constructs)",
    "ESP32 / embedded sensors",
  ],
};

// Standardised tests, shown in the "Test scores" section of the About page.
// `value` and `max` are numbers (they size the small bars); `decimals` is how
// many decimal places to show, so IELTS reads 7.5 / 9.0 and the SAT reads
// 1440 / 1600. Each section carries its own `max`.
export const testScores = [
  {
    name: "SAT",
    fullName: "Scholastic Assessment Test",
    date: "Oct 2026",
    value: 1440,
    max: 1600,
    decimals: 0,
    sections: [
      { label: "Reading & Writing", value: 720, max: 800, decimals: 0 },
      { label: "Math", value: 720, max: 800, decimals: 0 },
    ],
  },
  {
    name: "IELTS Academic",
    fullName: "International English Language Testing System",
    date: "Sep 2026",
    value: 7.5,
    max: 9,
    decimals: 1,
    sections: [
      { label: "Reading", value: 8.5, max: 9, decimals: 1 },
      { label: "Listening", value: 8.0, max: 9, decimals: 1 },
      { label: "Writing", value: 7.0, max: 9, decimals: 1 },
      { label: "Speaking", value: 6.5, max: 9, decimals: 1 },
    ],
  },
];
