// Each project card + case-study page is generated from one entry here.
// stack.visible = always-shown chips; stack.hidden = tucked behind "show more".
// links left null where no repo/demo exists yet - don't fabricate a URL, just
// fill it in here when one exists and it'll appear automatically.

export const projects = [
  {
    slug: "project-cherenkov",
    title: "Project Cherenkov",
    dateRange: "Jun 2026 - Present",
    role: "Co-creator & lead developer",
    tags: ["Web App", "Education", "Open Source", "Astronomy"],
    featured: true,
    links: { repo: "https://github.com/project-cherenkov/project-cherenkov-app", demo: "https://project-cherenkov-app.vercel.app/" },
    summary:
      "An open-source editorial archive and study planner spanning informatics, physics, and astronomy; every write-up is paired with a working, bespoke interactive visualisation so students can manipulate variables directly instead of reading about them.",
    stack: {
      visible: ["Next.js", "TypeScript", "Drizzle ORM", "PostgreSQL"],
      hidden: [
        "shadcn/ui",
        "Tailwind CSS",
        "Better Auth",
        "Canvas 2D",
        "KaTeX",
        "Keystatic CMS",
        "next-intl",
      ],
    },
    caseStudy: [
      {
        heading: "Full-stack architecture",
        text: "Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and shadcn/ui. Neon Serverless Postgres, Drizzle ORM, and Better Auth handle authentication, personalised study plans, and progress tracking.",
      },
      {
        heading: "Interactive visualisations",
        text: "Reusable Canvas 2D / D3 visualisation engines - a graph-array stepper, trajectory sandbox, orbital sandbox, and a template-driven composed-scene engine - plus a custom visual scene-builder authoring tool.",
      },
      {
        heading: "Content pipeline & performance",
        text: "Static compile-time math rendering via KaTeX/Velite with typed MDX schemas, so there's zero runtime math-rendering overhead. Keystatic CMS runs in both local and GitHub-OAuth-backed production modes.",
      },
      {
        heading: "Localisation & accessibility",
        text: "Full internationalisation via next-intl, supporting English and Indonesian (/en, /id).",
      },
    ],
  },
  {
    slug: "astronomical-multi-catalog-identifier-matcher",
    title: "Astronomical Multi-Catalog Identifier Matcher",
    dateRange: "May 2026 - Present",
    role: "Developer (CS50x capstone project)",
    tags: ["Astronomy", "Backend", "CS50x", "FastAPI", "Async Python"],
    featured: true,
    links: {
      repo: "https://github.com/Akirenaki/astronomy-multi-catalog-identifier-matcher",
      demo: null,
    },
    summary:
      "An asynchronous Python web application that resolves name-based celestial object identifiers across mismatched external catalogues - SIMBAD and the NASA Exoplanet Archive - built as a CS50x capstone and extended well past the course's scope.",
    stack: {
      visible: ["FastAPI", "Async Python", "PostgreSQL", "Three.js"],
      hidden: [
        "SQLAlchemy",
        "Alembic",
        "Gemini API",
        "ADQL / TAP",
        "Uvicorn",
      ],
    },
    caseStudy: [
      {
        heading: "Asynchronous web architecture",
        text: "FastAPI, Uvicorn, and httpx execute name-based celestial object resolutions against external astronomical endpoints.",
      },
      {
        heading: "Architectural decoupling",
        text: "A strict separation between deterministic SQL/ADQL resolution pipelines and non-deterministic presentation layers, so the LLM narrative engine (Gemini API) and the Three.js 3D coordinate visualisation can never modify the underlying scientific data.",
      },
      {
        heading: "State machine & fault tolerance",
        text: "An explicit five-state resolution engine - RESOLVED, PARTIAL, AMBIGUOUS, UNRESOLVED, LOOKUP_FAILED - backed by a dual-tier TTL cache (14 days for verified queries, 1 hour for network/transport failures) to isolate upstream outages gracefully.",
      },
      {
        heading: "Authentication & data protection",
        text: "Session-based cookie authentication with bcrypt password hashing, CSRF token verification on mutating routes, and Fernet symmetric encryption for personal API keys at rest.",
      },
      {
        heading: "Database modelling & traffic control",
        text: "An asynchronous relational schema via SQLAlchemy and Alembic migrations, with sliding-window rate limiting via event logging to protect upstream services and govern API consumption.",
      },
    ],
  },
  {
    slug: "trebuchet-mechanical-systems",
    title: "Empirical & Theoretical Analysis of Multi-Variable Mechanical Systems",
    dateRange: "May 2026 - Jun 2026",
    role: "Co-developer",
    tags: ["Physics", "Simulation"],
    featured: false,
    links: {
      repo: null,
      demo: "https://akirenaki.github.io/Physics-Trebuchet-Simulation-Grade-11/",
    },
    summary:
      "A physics and mechanical engineering research project evaluating trebuchet dynamics through both theoretical calculation and physical empirical testing, pairing classical mechanics with a hand-built prototype.",
    stack: {
      visible: ["JavaScript", "Physics Modelling"],
      hidden: ["Trajectory Simulation", "Experimental Design"],
    },
    caseStudy: [
      {
        heading: "Mathematical modelling",
        text: "Applied classical mechanics - rotational torque, moment of inertia, conservation of energy, projectile motion - to derive theoretical trajectory and force equations.",
      },
      {
        heading: "Interactive simulation",
        text: "A web-based JavaScript simulation for real-time parameter tuning (sling length, launch angle, counterweight mass) with trajectory visualisation.",
      },
      {
        heading: "Empirical data & efficiency",
        text: "Built and tested a physical prototype to collect launch data, analysing system efficiency (η = 43.8%) and the factors behind energy loss.",
      },
    ],
  },
  {
    slug: "fishcom",
    title: "FISHCOM: Fish Waste Optimisation for Sustainable Agriculture on Alkaline Soils",
    dateRange: "Feb 2026 - Jun 2026",
    role: "Researcher & co-author",
    tags: ["Environmental Science", "Field Research"],
    featured: false,
    links: { repo: null, demo: null },
    summary:
      "Formulated and evaluated a liquid organic fertiliser derived from fish viscera waste to amend soil chemistry in alkaline karst environments, proposing a circular-economy model for coastal waste.",
    stack: {
      visible: ["Field Research", "pH Analysis"],
      hidden: ["Borg & Gall R&D Model", "Circular Economy Design"],
    },
    caseStudy: [
      {
        heading: "Methodology",
        text: "A 9-stage Borg & Gall R&D model, with field sampling across three coastal hydrological zones at Pantai Baron and a 14-day anaerobic fermentation process.",
      },
      {
        heading: "Key results",
        text: "Produced an acidic liquid organic fertiliser (pH 4) that lowered high-alkalinity karst soil (pH 8) toward neutral (pH 7).",
      },
      {
        heading: "Strategic value",
        text: "A circular-economy model to cut coastal waste-management costs for local fish auction facilities (TPI) while improving nutrient availability in degraded Gunungkidul soils.",
      },
    ],
  },
  {
    slug: "corgein",
    title: "CORGEIN: Household-Scale Incinerator Filter Prototype (ESP-Based)",
    dateRange: "Jan 2026 - May 2026",
    role: "Team member (3-person team)",
    tags: ["Hardware", "Sustainability", "Environmental Science"],
    featured: true,
    links: { repo: null, demo: null },
    summary:
      "An eco-friendly filtration prototype to mitigate hazardous air pollution from incomplete household waste combustion, aligned with UN Sustainable Development Goals for clean air.",
    stack: {
      visible: ["Hardware Prototyping", "Electrostatics"],
      hidden: ["High-Voltage Ionisation", "Design Thinking"],
    },
    caseStudy: [
      {
        heading: "Innovation & engineering",
        text: "CORGEIN integrates an Electrostatic Precipitator (ESP) mechanism to trap particulate matter - fly ash and smoke soot - from small-scale incinerators before it escapes into the atmosphere.",
      },
      {
        heading: "Technical methodology",
        text: "High-voltage ionisation principles charge airborne particles and capture them on collection plates, reducing hazardous emissions from domestic open-burning.",
      },
      {
        heading: "Design thinking application",
        text: "Comprehensive research, structural mapping, and rigorous testing to keep the prototype cost-effective and practical for residential deployment.",
      },
    ],
  },
  {
    slug: "exoplanet-data-insight-assistant",
    title: "Exoplanet Data Insight Assistant Highlighter",
    dateRange: "May 2026",
    role: "Developer",
    tags: ["AI Workflow", "Astronomy", "Data Analysis"],
    featured: true,
    links: { repo: null, demo: null },
    summary:
      "An end-to-end AI agent workflow for exoplanet data analysis, built for the IBM SkillsBuild University Education initiative in collaboration with Hacktiv8 - scored 97.50/100 by the programme's judging panel.",
    stack: {
      visible: ["Langflow", "AI Agent Orchestration"],
      hidden: ["Prompt Engineering", "System Architecture", "Data Analysis"],
    },
    caseStudy: [
      {
        heading: "Key achievements",
        text: "Final score of 97.50/100 - 98.00 in Execution & Functionality, 98.00 in System Design & Architecture, 98.00 in Background & Impact, 96.00 in Creativity & Innovation.",
      },
      {
        heading: "Core competencies",
        text: "AI agent orchestration, workflow design via Langflow, prompt engineering, system architecture, and data analysis.",
      },
      {
        heading: "Impact",
        text: "Scalable agent logic that streamlines complex data-analysis workflows, bridging raw data inputs with structured, automated outputs.",
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
