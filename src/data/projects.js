// Each project card + case-study page is generated from one entry here.
// stack.visible = always-shown chips; stack.hidden = tucked behind "show more".
// links left null where no repo/demo exists yet - don't fabricate a URL, just
// fill it in here when one exists and it'll appear automatically.
//
// How a project is classified (all of it drives the filters on /work):
//   scale             "flagship" | "standard" | "mini" - see SCALES below
//   filters.domain    what field it belongs to; a project can have several
//   filters.type      what kind of thing it is (web app, prototype, ...); can have several
//   filters.framework frameworks / orchestration libraries it is built on
//   filters.language  programming languages it is written in
//   Live and Repo are not stored: they come from links.demo and links.repo
//   (see isLive / hasRepo below), so they can never drift out of sync.
// Leave a list empty when it doesn't apply (a physical prototype has no
// language). Keep spellings identical across projects; the filter UI builds
// its options from whatever values appear here.
//
// Optional fields:
//   highlight  one line of recognition shown on the card ("Top 5 finalist ...")
//   scaleNote  one line on the case-study page about why the project is that size
//
// summary = short card text (what it is + the problem it addresses).
// caseStudy = the longer write-up. Flagship projects get the full treatment;
// minis stay short on purpose.

export const SCALES = {
  flagship: {
    label: "Flagship",
    description: "A long-running, complex project, and one of my most important.",
  },
  standard: {
    label: "Standard",
    description: "A focused project with a clear goal.",
  },
  mini: {
    label: "Mini",
    description: "A short build to test and prove a skill.",
  },
};

export const projects = [
  {
    slug: "project-cherenkov",
    title: "Project Cherenkov",
    dateRange: "Jun 2026 - Present",
    role: "Co-creator & lead developer",
    scale: "flagship",
    filters: {
      domain: ["Astronomy", "Education", "Physics"],
      type: ["Web App"],
      framework: ["Next.js"],
      language: ["TypeScript"],
    },
    featured: true,
    priority: false,
    links: { repo: "https://github.com/project-cherenkov/project-cherenkov-app", demo: "https://project-cherenkov-app.vercel.app/" },
    summary:
      "Olympiad proofs are easy to read and still hard to understand. Cherenkov pairs every informatics, physics and astronomy editorial with an interactive visualisation you can change yourself, and adds a study planner that schedules reviews around the exam date. Open source, in English and Indonesian.",
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
        heading: "Why it exists",
        text: "Preparing for the Indonesian Science Olympiad (OSN) in informatics, physics or astronomy means working through proofs and derivations that you can follow line by line without the idea ever clicking. Study time is also short, and it is hard to tell which topic deserves the next hour. We built Cherenkov for students in that position.",
      },
      {
        heading: "What students get",
        text: "Each editorial comes with a visualisation you can operate: step through a graph algorithm or change a projectile's launch conditions and watch what happens. The study planner estimates how well you know each topic from quiz results and builds a calendar of reviews ahead of the exam. When the workload does not fit the time left, it warns you.",
      },
      {
        heading: "Full-stack architecture",
        text: "Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS and shadcn/ui. Neon Serverless Postgres, Drizzle ORM and Better Auth handle authentication, personalised study plans and progress tracking.",
      },
      {
        heading: "Interactive visualisations",
        text: "Five reusable Canvas 2D and D3 engines: a graph-array stepper, a trajectory sandbox, an orbital sandbox, a template-driven composed-scene engine and a programmable-scene engine. Programmable scenes run in a sandboxed block interpreter that evaluates visual Blockly programs frame by frame, with execution budgets and element caps. A visual scene builder lets writers author new ones.",
      },
      {
        heading: "Adaptive study planner",
        text: "Topic mastery is estimated with a Bayesian Beta posterior that decays over time to model forgetting. Reviews are scheduled with Region of Proximal Learning principles and anchored to the exam date, and an auto-graded quiz bank updates the estimates according to the difficulty each stage targets.",
      },
      {
        heading: "Content pipeline and performance",
        text: "Equations are compiled to static HTML at build time with KaTeX and Velite typed MDX schemas, so readers never wait on client-side math rendering. Keystatic CMS runs in a local mode and a GitHub OAuth mode, with authorization checked in edge middleware.",
      },
      {
        heading: "Localisation",
        text: "The whole site, including the in-app documentation and the syllabus mapping, is available in English and Indonesian (/en, /id) through next-intl.",
      },
    ],
  },
  {
    slug: "astronomical-multi-catalog-identifier-matcher",
    title: "Taraka Sutra: Astronomy Multi-Catalog Identifier Matcher",
    dateRange: "May 2026 - Present",
    role: "Developer (CS50x capstone project)",
    scale: "flagship",
    filters: {
      domain: ["Astronomy", "Data Science"],
      type: ["Web App"],
      framework: ["FastAPI"],
      language: ["Python", "JavaScript"],
    },
    featured: true,
    priority: true,
    links: {
      repo: "https://github.com/Akirenaki/astronomy-multi-catalog-identifier-matcher",
      demo: null,
    },
    summary:
      "One star can have several names: 51 Peg is also 51 Pegasi and HD 217014, and searching under the wrong one can miss its planets. Taraka Sutra matches an object across SIMBAD and the NASA Exoplanet Archive by identifier, then says plainly how sure it is of the match.",
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
        heading: "One star, many names",
        text: "Astronomical catalogues each name objects in their own system. The same star can be a Bayer designation in one place and a Henry Draper number in another, so a lookup under the wrong name returns nothing even though the data exists. Sorting out which entries describe the same object takes a lot of manual cross-checking, and that is the gap Taraka Sutra fills for students and hobbyists.",
      },
      {
        heading: "What it does",
        text: "You enter a name. The app resolves it through SIMBAD, expands the object's known aliases, and looks up matching planet hosts in the NASA Exoplanet Archive. Matching is by identifier and alias, not by position on the sky. Every result carries an explicit confidence state, so an uncertain match never passes for a certain one. Optional plain-language summaries and a 3D coordinate view are there for readers who are not specialists.",
      },
      {
        heading: "Asynchronous web architecture",
        text: "FastAPI, Uvicorn and httpx run the name-based resolutions against external astronomical endpoints without blocking. It started as the CS50x final project, and I pushed it past the course's synchronous Flask and SQLite patterns into async execution, TAP/ADQL queries, client-side 3D rendering and production-style database migrations.",
      },
      {
        heading: "Architectural decoupling",
        text: "Deterministic SQL/ADQL resolution pipelines are kept strictly apart from the presentation layers. The Gemini narrative and the Three.js visualisation sit on the presentation side, so neither can change the scientific data underneath.",
      },
      {
        heading: "State machine and fault tolerance",
        text: "An explicit five-state resolution engine (RESOLVED, PARTIAL, AMBIGUOUS, UNRESOLVED, LOOKUP_FAILED) sits behind a two-tier TTL cache: 14 days for verified queries and 1 hour for network or transport failures. An upstream outage stays contained, and a failed lookup is retried soon rather than remembered for two weeks.",
      },
      {
        heading: "Authentication and data protection",
        text: "Session-based cookie authentication with bcrypt password hashing, CSRF verification on every mutating route, and Fernet encryption for users' personal API keys at rest.",
      },
      {
        heading: "Database modelling and traffic control",
        text: "An asynchronous relational schema built with SQLAlchemy and Alembic migrations. Sliding-window rate limiting, based on event logging, protects the upstream services and caps Gemini API usage.",
      },
    ],
  },
  {
    slug: "fishcom",
    title: "FISHCOM: Fish Waste Optimisation for Sustainable Agriculture on Alkaline Soils",
    dateRange: "Feb 2026 - Jun 2026",
    role: "Researcher & co-author",
    scale: "standard",
    filters: {
      domain: ["Environmental Science"],
      type: ["Research"],
      framework: [],
      language: [],
    },
    featured: true,
    priority: false,
    links: { repo: null, demo: null },
    summary:
      "The karst soil of Gunungkidul is alkaline (around pH 8) and poor for crops, while local fishers usually pay to throw away fish remains. FISHCOM ferments that waste into an acidic liquid fertiliser (pH 4) that brought alkaline karst soil toward neutral (pH 7).",
    stack: {
      visible: ["Field Research", "pH Analysis"],
      hidden: ["Borg & Gall R&D Model", "Circular Economy Design"],
    },
    caseStudy: [
      {
        heading: "Two problems, one idea",
        text: "Gunungkidul's karst soil is alkaline, which makes it unsuitable for crops. Meanwhile, the fish processed along the coast leaves viscera and other remains that fishers and fish auction facilities (TPI) usually have to pay to dispose of. FISHCOM asks whether the second problem can be used to treat the first.",
      },
      {
        heading: "Methodology",
        text: "We followed a nine-stage Borg & Gall R&D model, with field sampling across three coastal hydrological zones at Pantai Baron and a 14-day anaerobic fermentation of fish viscera into a liquid organic fertiliser (POC).",
      },
      {
        heading: "Key results",
        text: "The fertiliser came out acidic at pH 4 and lowered high-alkalinity karst soil (pH 8) toward neutral (pH 7).",
      },
      {
        heading: "Who benefits",
        text: "Farmers on degraded Gunungkidul soils would get a fertiliser that improves nutrient availability, made from material that used to be a disposal cost. For fish auction facilities, we propose a circular-economy model that cuts coastal waste-management spending.",
      },
    ],
  },
  {
    slug: "corgein",
    title: "CORGEIN: Household-Scale Incinerator Filter Prototype (ESP-Based)",
    dateRange: "Jan 2026 - May 2026",
    role: "Team lead (3-person team)",
    scale: "standard",
    filters: {
      domain: ["Engineering", "Environmental Science"],
      type: ["Prototype"],
      framework: [],
      language: [],
    },
    featured: true,
    priority: false,
    highlight: "Top 5 finalist out of about 200 teams, M-Fest 2026 STEM Competition",
    links: { repo: null, demo: null },
    summary:
      "Where I live, a lot of people burn their trash, and the smoke hits me hard: I have a dust allergy and a body that gets sick easily. CORGEIN is a filter for small household incinerators. It charges smoke and fly-ash particles with high voltage and catches them on plates before they reach the air.",
    stack: {
      visible: ["Hardware Prototyping", "Electrostatics"],
      hidden: ["High-Voltage Ionisation", "Design Thinking"],
    },
    caseStudy: [
      {
        heading: "Why this one is personal",
        text: "Burning trash is routine in my area, mostly in lower-income households, and the smoke drifts into everyone's homes. For most people that is an annoyance. For me it means getting sick, because of my dust allergy and a body that does not take much to knock down. We did not want a fix that depends on everyone stopping, so my team and I aimed at making the burning less harmful.",
      },
      {
        heading: "What it does",
        text: "CORGEIN adds an electrostatic precipitator (ESP) to a small-scale incinerator. High voltage ionises the airborne particles, charged plates capture them, and the fly ash and smoke soot are trapped before the exhaust reaches the atmosphere.",
      },
      {
        heading: "Built for households, not labs",
        text: "We researched the problem, mapped the structure of the system and tested the prototype repeatedly, keeping it cost-effective and practical for residential use. The design is aligned with the UN Sustainable Development Goals for clean air and sustainable communities.",
      },
      {
        heading: "M-Fest 2026",
        text: "We built the prototype as a 3-person team for M-Fest 2026, the national STEM competition run by HMM ITB. Out of about 200 teams across Indonesia we reached the top 5, pitched CORGEIN to a panel of expert judges at the ITB Ganesha campus and answered their questions on the spot.",
      },
    ],
  },
  {
    slug: "trebuchet-mechanical-systems",
    title: "Empirical & Theoretical Analysis of Multi-Variable Mechanical Systems",
    dateRange: "May 2026 - Jun 2026",
    role: "Co-developer",
    scale: "mini",
    scaleNote: "A focused Grade 11 physics build pairing classical mechanics theory with an interactive simulator and an empirical prototype.",
    filters: {
      domain: ["Engineering", "Physics"],
      type: ["Prototype", "Research", "Simulation"],
      framework: [],
      language: ["JavaScript"],
    },
    featured: false,
    priority: false,
    links: {
      repo: null,
      demo: "https://akirenaki.github.io/Physics-Trebuchet-Simulation-Grade-11/",
    },
    summary:
      "A trebuchet's range depends on sling length, release angle and counterweight mass, and those interact in ways that are hard to see on paper. We modelled the physics, built a simulator anyone can tune in the browser, and tested a real prototype to find where the energy goes (43.8% efficiency).",
    stack: {
      visible: ["JavaScript", "Physics Modelling"],
      hidden: ["Trajectory Simulation", "Experimental Design"],
    },
    caseStudy: [
      {
        heading: "Theory versus the real machine",
        text: "A trebuchet has several variables that affect each other: sling length, launch angle and counterweight mass. Working out their combined effect from equations alone is slow, and a real machine loses energy in ways an ideal model leaves out. For this Grade 11 physics project we wanted a way to explore those trade-offs and to check the theory against measurements from a machine we built.",
      },
      {
        heading: "Mathematical modelling",
        text: "Classical mechanics (rotational torque, moment of inertia, conservation of energy and projectile motion) gave the theoretical trajectory and force equations.",
      },
      {
        heading: "Interactive simulation",
        text: "A web-based JavaScript simulation lets anyone change sling length, launch angle and counterweight mass in real time and watch the trajectory update.",
      },
      {
        heading: "Empirical data and efficiency",
        text: "We built and tested a physical prototype to collect launch data. Analysis gave a system efficiency of η = 43.8% and identified the factors behind the lost energy. We co-authored a presentation and dataset that set out the fixed and independent variables and the findings.",
      },
    ],
  },
  {
    slug: "exoplanet-data-insight-assistant",
    title: "Exoplanet Data Insight Assistant Highlighter",
    dateRange: "May 2026",
    role: "Developer",
    scale: "mini",
    filters: {
      domain: ["Astronomy", "AI & Machine Learning", "Data Science"],
      type: ["AI Workflow"],
      framework: ["Langflow"],
      language: [],
    },
    featured: false,
    priority: false,
    highlight: "Scored 97.50/100 in the programme's judging",
    scaleNote: "A one-month build to test designing an AI agent workflow in Langflow.",
    links: { repo: null, demo: null },
    summary:
      "Exoplanet data comes as large tables that take time to analyse by hand. This AI agent workflow, built in Langflow for the IBM SkillsBuild University Education initiative with Hacktiv8, turns raw data inputs into structured analysis automatically.",
    stack: {
      visible: ["Langflow", "AI Agent Orchestration"],
      hidden: ["Prompt Engineering", "System Architecture", "Data Analysis"],
    },
    caseStudy: [
      {
        heading: "The problem",
        text: "Raw exoplanet data arrives as big tables of measurements, and getting from there to something a reader can use means repeating the same analysis steps. This workflow automates that path, from raw data input to a structured output, with scalable agent logic that streamlines complex data-analysis workflows.",
      },
      {
        heading: "Results",
        text: "Final score of 97.50/100: 98.00 for Execution & Functionality, 98.00 for System Design & Architecture, 98.00 for Background & Impact and 96.00 for Creativity & Innovation. It exercised AI agent orchestration, workflow design in Langflow, prompt engineering, system architecture and data analysis.",
      },
    ],
  },
  {
    slug: "starship-rocket",
    title: "Starship Rocket: Unguided Two-Stage Retropropulsive Landing",
    dateRange: "Aug 2026 - Sep 2026",
    role: "Co-designer",
    scale: "mini",
    filters: {
      domain: ["Aerospace", "Physics"],
      type: ["Simulation"],
      framework: [],
      language: [],
    },
    featured: false,
    priority: false,
    scaleNote: "A short build to test rocket simulation and retropropulsion modelling, made for the BIRST 2026 Level 3 challenge.",
    links: { repo: "https://github.com/Akirenaki/Starship-V3-Rocket", demo: null },
    summary:
      "Rockets that land on their engines normally rely on active guidance. For the BIRST 2026 Level 3 challenge we simulated a Falcon 9 Crew-9 launch with no parachutes and no steering, only burns timed in advance, to see what that costs: touchdown at 15 to 17 m/s against a 5 m/s target, and about 0.9 km of wind drift.",
    stack: {
      visible: ["OpenRocket", "OpenWind"],
      hidden: ["OpenEarth / Google Earth", "Retropropulsive landing", "Wind modelling"],
    },
    caseStudy: [
      {
        heading: "The question",
        text: "The BIRST 2026 Level 3 (Falcon Rocket) task is to simulate a Falcon 9 Crew-9 launch from Cape Canaveral, reach a 3,000 m apogee and land both stages on their own engines. We took the strictest version of that: no parachutes, no active stability control, only burns timed in advance. How close can fixed timing alone get to a soft landing?",
      },
      {
        heading: "What we found",
        text: "Ascent worked. The rocket reached 2,999.97 m against the 3,000.00 m target and peaked at Mach 0.973, so it stayed subsonic. Landing missed the 5.0 m/s speed specification: the upper stage touched down at 16.7 m/s and the booster at 14.9 m/s, because fixed-delay ignition over-corrected the vertical momentum. Uncompensated crosswinds also carried both stages 0.86 to 0.95 km downwind. Better burn timing, different motor choices and launch-angle compensation for wind are the changes we would try next.",
      },
      {
        heading: "How it was built",
        text: "A Loki K627LR ascent motor (1,526 N·s) set the apogee. The Cape Canaveral (SLC-40) site was recreated in OpenWind with a 30-layer extended ISA wind profile (crosswinds of 3.1 to 14.4 m/s), and the trajectories were viewed in Google Earth through OpenEarth. Burns from an AeroTech HP-H195NT (upper stage) and a Cesaroni 168H410-14A (booster) fire at fixed delays of 51.5 s and 65.0 s after launch, with custom swept fins standing in for Falcon 9's grid fins.",
      },
    ],
  },
  {
    slug: "astronomy-object-chat-assistant",
    title: "Astronomy Object Chat Assistant",
    dateRange: "Aug 2026",
    role: "Developer",
    scale: "mini",
    filters: {
      domain: ["Astronomy", "AI & Machine Learning"],
      type: ["Web App"],
      framework: ["LangChain", "Streamlit"],
      language: ["Python"],
    },
    featured: false,
    priority: false,
    scaleNote: "A short build to test a full retrieval-augmented generation (RAG) pipeline from data to chat interface.",
    links: { repo: "https://github.com/Akirenaki/astronomy-rag-chatbot", demo: null },
    summary:
      "General-purpose chatbots can make up details about a specific star. This assistant answers questions about the 50 brightest named stars in the HYG database using only the records it retrieves, and tells you when a star or fact is not in its data.",
    stack: {
      visible: ["Python", "LangChain", "Streamlit", "Chroma"],
      hidden: ["Gemini API", "pandas", "HYG stellar database", "RAG"],
    },
    caseStudy: [
      {
        heading: "The problem",
        text: "Ask a language model about a specific star and it can produce a fluent answer that nothing supports. For someone learning astronomy that is hard to spot and easy to repeat. This assistant is built so that every answer comes from a record in its dataset, and a missing record produces an honest \"I don't have that\" instead of a guess.",
      },
      {
        heading: "How it answers",
        text: "pandas turns a subset of the HYG stellar database into one document per star, converting distance from parsecs to light-years, and Chroma stores the vectors. A question is embedded with gemini-embedding-001, the four most similar star records come back, and gemini-3.6-flash writes the answer from those records and the recent conversation. System-prompt guardrails keep it inside the retrieved context, and a Streamlit chat keeps session history so follow-up questions make sense.",
      },
    ],
  },
];

// Live / Repo are derived from links so the filter always matches the buttons
// shown on each card.
export const isLive = (project) => Boolean(project.links?.demo);
export const hasRepo = (project) => Boolean(project.links?.repo);

export const featuredProjects = projects.filter((p) => p.featured);

export function getBigFeaturedProject(featuredList = featuredProjects) {
  if (!featuredList || featuredList.length === 0) return null;
  const priorityProject = featuredList.find((p) => p.priority);
  return priorityProject || featuredList[0];
}

export function getOrderedFeaturedProjects(featuredList = featuredProjects) {
  const bigProject = getBigFeaturedProject(featuredList);
  if (!bigProject) return featuredList;
  return [bigProject, ...featuredList.filter((p) => p.slug !== bigProject.slug)];
}
