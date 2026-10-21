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
//   links             { repo, demo, presentation, document }; each is an https URL
//                     or null. A null link renders no button, so a missing link
//                     never shows as a dead one. `presentation` is a slide deck
//                     (Google Slides, PDF, ...); `document` is a written report
//                     or paper (Google Docs, PDF, ...).
// Leave a list empty when it doesn't apply (a physical prototype has no
// language). Keep spellings identical across projects; the filter UI builds
// its options from whatever values appear here.
//
// Optional fields:
//   highlight  one line of recognition shown on the card ("Top 5 finalist ...")
//   scaleNote  one line on the case-study page about why the project is that size
//
// summary = short card text (what it is + the problem it addresses). It is also
// the page's meta description, so keep it to a few sentences.
//
// caseStudy = the longer write-up shown on /work/<slug>. Flagship projects get
// the full treatment; minis stay shorter on purpose. Each block's heading must be
// unique within its project. A good case study answers three questions in order:
// what is the problem, what was done about it, and what difference it makes (or
// could make). Where a result is a prototype or a first measurement, say so.
//
// cv = the same three answers, compressed for the printable CV (/print):
//   problem   one or two sentences on what was wrong or missing
//   approach  what was built or done, with the specifics that matter
//   impact    what changed, or could change, and the evidence for it
// The CV shows these three labelled lines for flagship and standard projects.
// A project without `cv` falls back to its `summary`. Keep personal details out
// of `cv`: it is a document people forward.

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
    links: { repo: "https://github.com/project-cherenkov/project-cherenkov-app", demo: "https://project-cherenkov-app.vercel.app/", presentation: null, document: null },
    summary:
      "Olympiad editorials are easy to read and still hard to understand. Cherenkov, built by a team of five, pairs every informatics, physics and astronomy editorial with a visualisation you can operate, and adds a study planner that works backwards from the exam date. Open source, in English and Indonesian, for students preparing for the Indonesian Science Olympiad (OSN).",
    cv: {
      problem:
        "Indonesian Science Olympiad (OSN) editorials in informatics, physics and astronomy are written as proofs that can be followed line by line without the underlying idea ever landing, and students have little guidance on which topic deserves the next hour of limited study time.",
      approach:
        "Co-founded a five-person team and lead development of an open-source platform in Next.js 15 and TypeScript. Every editorial is paired with an interactive visualisation, drawn by five reusable Canvas 2D and D3 engines, one of which runs visual Blockly programs in a sandboxed interpreter. A study planner estimates topic mastery with a time-decaying Bayesian Beta posterior, schedules reviews around the exam date using Region of Proximal Learning principles, and warns when the workload does not fit the time left. Equations are compiled to static HTML at build time, and the whole site is available in English and Indonesian.",
      impact:
        "Gives olympiad students something to operate instead of only something to read, and a plan that adapts to what they have actually learned. Writers add new scenes through a visual builder and a CMS without touching the rendering code, so content can grow beyond what the developers write themselves, and the public repository lets the platform be adapted to other olympiad subjects.",
    },
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
        heading: "The problem",
        text: "Preparing for the Indonesian Science Olympiad (OSN) in informatics, physics or astronomy means working through proofs and derivations that you can follow line by line without the idea ever clicking. A projectile derivation shows that a range formula is true; it rarely lets you feel why a steeper launch angle trades distance for height. Study time is also short, and without any measure of what you already know it is hard to tell which topic deserves the next hour. I have sat in the school Astronomy Olympiad class and now mentor its younger members, so both problems are familiar to me from the student side and the teaching side.",
      },
      {
        heading: "The idea",
        text: "The project is named after Cherenkov radiation, the blue glow that makes fast particles you cannot see detectable, and its principle is the same: make the invisible detectable. Every editorial is paired with something you can operate, so the structure behind a result becomes visible. The second half of the idea is measurement. If the platform can tell how well you know a topic, it can plan your time around it instead of leaving you to guess.",
      },
      {
        heading: "What students get",
        text: "Each editorial comes with a visualisation you can operate: step through a graph algorithm or change a projectile's launch conditions and watch what happens. The study planner estimates how well you know each topic from quiz results and builds a calendar of reviews ahead of the exam. When the workload does not fit the time left, it warns you instead of quietly producing a schedule that cannot be followed.",
      },
      {
        heading: "Interactive visualisations",
        text: "Five reusable Canvas 2D and D3 engines: a graph-array stepper, a trajectory sandbox, an orbital sandbox, a template-driven composed-scene engine and a programmable-scene engine. Programmable scenes run in a sandboxed block interpreter that evaluates visual Blockly programs frame by frame. Execution budgets and element caps mean a badly written scene cannot freeze a reader's browser, which is what makes it safe for writers who are not developers to contribute scenes. A visual scene builder lets them author new ones without writing rendering code.",
      },
      {
        heading: "Adaptive study planner",
        text: "In plain terms, each quiz result updates a running belief about how well you know a topic, and that belief fades with time the way memory does. Technically this is a Bayesian Beta posterior with time decay. Reviews are then scheduled with Region of Proximal Learning principles, which favour topics at the edge of what you can do over ones already secure or still out of reach, and they are anchored to the exam date. Editors write the confirmation quizzes and every question carries a difficulty label; an auto-graded quiz bank then updates the estimates according to the difficulty each stage targets.",
      },
      {
        heading: "Full-stack architecture",
        text: "Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS and shadcn/ui. Neon Serverless Postgres, Drizzle ORM and Better Auth handle authentication, personalised study plans and progress tracking.",
      },
      {
        heading: "Content pipeline and performance",
        text: "Equations are compiled to static HTML at build time with KaTeX and Velite typed MDX schemas, so readers never wait on client-side math rendering. Keystatic CMS runs in a local mode and a GitHub OAuth mode, with authorization checked in edge middleware, so editors can publish through a familiar interface while access stays controlled.",
      },
      {
        heading: "Localisation and team",
        text: "The whole site, including the in-app documentation and the syllabus mapping, is available in English and Indonesian (/en, /id) through next-intl. Cherenkov has five founders, with me as lead developer, and the repository is public.",
      },
      {
        heading: "Impact and where it can go",
        text: "Cherenkov is open source and bilingual, so a student needs only a browser. Because writers add scenes through the visual builder and the CMS rather than through the rendering code, the amount of content is limited by how many people contribute and not by how many developers there are. The visualisation engines are general (graph steppers, trajectory and orbital sandboxes) and the mastery model is organised per topic, so extending the platform to other olympiad subjects should be mostly a content task.",
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
      presentation: null,
      document: null,
    },
    summary:
      "One star can have several names: 51 Peg is also 51 Pegasi and HD 217014, and searching under the wrong one can miss its planets. Taraka Sutra resolves an object's identifiers through SIMBAD, matches it against the NASA Exoplanet Archive, and states plainly how sure it is, so that a failed lookup is never mistaken for a star with no planets.",
    cv: {
      problem:
        "Astronomical catalogues name the same object differently (a Bayer designation in one, a Henry Draper number in another), so a lookup under the wrong name returns nothing even when the data exists, and reconciling entries by hand is slow and easy to get wrong.",
      approach:
        "Built a full-stack asynchronous web application (FastAPI, httpx, SQLAlchemy, Alembic, PostgreSQL) that resolves an object through SIMBAD, expands its aliases, and matches planet hosts in the NASA Exoplanet Archive by identifier rather than by sky position. A five-state resolution engine reports exactly how certain each match is and sits behind a two-tier TTL cache (14 days for verified results, 1 hour for network failures). A strict boundary keeps the Gemini narrative and the Three.js 3D coordinate view from ever altering the scientific data. Also includes session authentication (bcrypt, CSRF protection), Fernet-encrypted personal API keys, sliding-window rate limiting and an automated pytest suite.",
      impact:
        "Replaces a manual cross-checking chore with one lookup whose confidence is stated and whose failures are visible, which matters most to students and hobbyists who cannot judge an unexplained match. Grew from a CS50x final project into a portfolio-scale system, and is the foundation for a planned conversational layer.",
    },
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
        text: "Astronomical catalogues each name objects in their own system. The same star can be a Bayer designation in one place and a Henry Draper number in another, so a lookup under the wrong name returns nothing even though the data exists. Anyone combining two catalogues has to work out by hand which entries describe the same object, and a mistake is quiet: a star looks planet-free because its planets are filed under a name nobody searched. Taraka Sutra, whose name pairs the Sanskrit words for star and thread, is built to tie those names together for students and hobbyists.",
      },
      {
        heading: "What it does",
        text: "You enter a name. The app resolves it through SIMBAD, expands the object's known aliases, and looks up matching planet hosts in the NASA Exoplanet Archive. Matching is by identifier and alias, not by position on the sky. Every result carries an explicit confidence state, so an uncertain match never passes for a certain one. Optional plain-language summaries and a 3D coordinate view are there for readers who are not specialists.",
      },
      {
        heading: "Honest about uncertainty",
        text: "A lookup can fail for different reasons: the name matched nothing, two objects fit equally well, or the network simply did not answer. Reporting all of those as 'not found' would mislead, so an explicit five-state resolution engine separates them: RESOLVED, PARTIAL, AMBIGUOUS, UNRESOLVED and LOOKUP_FAILED. The distinction between 'no' and 'could not ask' matters most, and it also drives caching. A two-tier TTL cache keeps verified results for 14 days but network or transport failures for only 1 hour, so an upstream outage stays contained and a failed lookup is retried soon instead of being remembered for two weeks.",
      },
      {
        heading: "Asynchronous web architecture",
        text: "FastAPI, Uvicorn and httpx run the name-based resolutions against external astronomical endpoints without blocking. It started as the CS50x final project, and I pushed it past the course's synchronous Flask and SQLite patterns into async execution, TAP/ADQL queries, client-side 3D rendering and production-style database migrations.",
      },
      {
        heading: "Architectural decoupling",
        text: "A language model is useful for explaining a result to a non-specialist, but it should never be the source of one. Deterministic SQL/ADQL resolution pipelines are therefore kept strictly apart from the presentation layers. The Gemini narrative and the Three.js visualisation sit on the presentation side, so neither can change the scientific data underneath, and a wrong sentence from the model can never become a wrong row in the database.",
      },
      {
        heading: "A 3D view of the sky",
        text: "The coordinate view is written with Three.js and uses custom transforms between equatorial, horizontal and ecliptic coordinates, so a reader can see where an object sits for an observer at a chosen latitude and local sidereal time. It belongs to the presentation layer: it displays what the resolver already established and never feeds anything back.",
      },
      {
        heading: "Authentication and data protection",
        text: "Session-based cookie authentication with bcrypt password hashing and CSRF verification on every mutating route. Users can supply their own Gemini API key, which is encrypted at rest with Fernet. Signed-in users can save favourite objects and keep their own AI summaries without disturbing the shared cached result.",
      },
      {
        heading: "Database modelling and traffic control",
        text: "An asynchronous relational schema built with SQLAlchemy and Alembic migrations. SIMBAD and the NASA Exoplanet Archive are shared public services, so the app is built to be a considerate client: sliding-window rate limiting, based on event logging, protects the upstream services and caps Gemini API usage.",
      },
      {
        heading: "Testing and hardening",
        text: "An automated pytest suite of more than 200 tests covers the resolver, the cache, authentication, rate limiting and the front end. Repeated review passes have turned up real defects, among them a cache-expiry bug that would have re-queried the upstream services indefinitely and two routes that bypassed the rate limiter. Each was fixed together with a regression test.",
      },
      {
        heading: "Impact and next steps",
        text: "The value is time and trust. A student gets a cross-catalogue answer from one lookup, with a stated confidence and a visible failure mode when an upstream service is down. Because the resolver is separate from its interfaces, other front ends can sit on top of it, and the Astronomy Object Chat Assistant is a decoupled prototype of a conversational layer for exactly that purpose. A hosted demo is planned.",
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
    links: { repo: null, demo: null, presentation: "https://canva.link/mit94dhb6kk40uk", document: "https://docs.google.com/document/d/1R0dAcxLPMbcEnnX94fn_tGCD5EA6XCZ5N7tAJ9ujUc0/edit?usp=sharing" },
    summary:
      "The karst soil of Gunungkidul is alkaline (around pH 8) and poor for crops, while local fishers usually pay to throw away fish remains. FISHCOM ferments that waste into an acidic liquid fertiliser (pH 4) that brought alkaline karst soil toward neutral (pH 7), and proposes a circular-economy model in which the waste stops being a disposal cost.",
    cv: {
      problem:
        "The alkaline karst soil of Gunungkidul (about pH 8) is poor for crops, while fish remains are a disposal cost for the fishers and fish auction facilities (TPI) that produce them.",
      approach:
        "Researched and co-authored a study following a nine-stage Borg & Gall R&D model: field sampling across three coastal hydrological zones at Pantai Baron, then a 14-day anaerobic fermentation of fish viscera into a liquid organic fertiliser (POC).",
      impact:
        "The fertiliser came out acidic (pH 4) and lowered alkaline karst soil (pH 8) toward neutral (pH 7). The study proposes a circular-economy model that turns a waste-management cost for fish auction facilities into an input for farmers on degraded soils.",
    },
    stack: {
      visible: ["Field Research", "pH Analysis"],
      hidden: ["Borg & Gall R&D Model", "Circular Economy Design"],
    },
    caseStudy: [
      {
        heading: "Two problems, one idea",
        text: "Gunungkidul sits on karst, limestone terrain whose soil is alkaline. In strongly alkaline soil many nutrients become harder for plants to absorb, which makes the land unsuitable for most crops. Meanwhile, the fish processed along the coast leaves viscera and other remains that fishers and fish auction facilities (TPI) usually have to pay to dispose of. FISHCOM asks whether the second problem can be used to treat the first.",
      },
      {
        heading: "Why fermented fish waste",
        text: "Fermenting organic material without oxygen produces organic acids, so the liquid that results is acidic. That is the property the project wants: an amendment that comes from material rich in organic matter and that also pulls soil pH down. Fish remains are also already produced locally, so the raw material does not have to be brought in.",
      },
      {
        heading: "Methodology",
        text: "We followed a nine-stage Borg & Gall R&D model, with field sampling across three coastal hydrological zones at Pantai Baron and a 14-day anaerobic fermentation of fish viscera into a liquid organic fertiliser (POC).",
      },
      {
        heading: "Key results",
        text: "The fertiliser came out acidic at pH 4 and lowered high-alkalinity karst soil (pH 8) toward neutral (pH 7). Because pH is logarithmic, that one-unit shift is a tenfold change in acidity. The result shows the fertiliser can correct the soil chemistry. Whether crops then grow better is a separate question, and crop trials over a growing season are the natural next test.",
      },
      {
        heading: "Who benefits",
        text: "Farmers on degraded Gunungkidul soils would get a fertiliser that improves nutrient availability, made from material that used to be a disposal cost. For fish auction facilities, we propose a circular-economy model that cuts coastal waste-management spending. If it holds up beyond the pH result, the same arrangement turns one community's waste into another community's input.",
      },
    ],
  },
  {
    slug: "corgein",
    title: "CORGEIN: Household-Scale Incinerator Filter Prototype Based on Electrostatic Precipitation",
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
    links: { repo: null, demo: null, presentation: "https://canva.link/p34z80qun2pxlha", document: null },
    summary:
      "Where I live, a lot of people burn their trash, and the smoke hits me hard: I have a dust allergy and a body that gets sick easily. CORGEIN is a filter for small household incinerators. It charges smoke and fly-ash particles with high voltage and catches them on plates before they reach the air.",
    cv: {
      problem:
        "Burning household waste is routine in my area, and the smoke and fly ash from incomplete combustion drift into neighbouring homes. A fix that depends on everyone stopping is unlikely to work, so the aim was to make the burning less harmful.",
      approach:
        "Led a three-person team that designed CORGEIN, a filter for small household incinerators based on electrostatic precipitation: high voltage ionises airborne smoke and fly-ash particles, and charged collection plates capture them before the exhaust reaches the air. Researched the problem, mapped the system and tested the prototype repeatedly, keeping the design cost-effective and practical for residential use.",
      impact:
        "Reached the top 5 of about 200 teams in the M-Fest 2026 national STEM competition and presented to an expert panel at ITB. The concept is a retrofit that cuts particulate emissions without asking households to change their habits, aligned with the UN Sustainable Development Goals for clean air and sustainable communities.",
    },
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
        heading: "How the physics works",
        text: "Power stations and factories have long used electrostatic precipitators to clean their exhaust. A high voltage creates ions that give the particles in the smoke an electric charge, and the charged particles are then pulled onto oppositely charged plates, where they stick instead of leaving with the air. The engineering question for this project was whether that principle could be shrunk to household scale without the cost and complexity of the industrial version.",
      },
      {
        heading: "Built for households, not labs",
        text: "We researched the problem, mapped the structure of the system and tested the prototype repeatedly. Cost mattered as much as capture, because the households that burn waste are the ones least able to buy industrial equipment, so the design stays cost-effective and practical for residential use. It is aligned with the UN Sustainable Development Goals for clean air and sustainable communities.",
      },
      {
        heading: "M-Fest 2026",
        text: "We built the prototype as a 3-person team for M-Fest 2026, the national STEM competition run by HMM ITB. The preliminary round was a proctored nationwide elimination on mathematics and physics mechanics, and the final asked each team to develop a solution with a Design Thinking framework. Out of about 200 teams across Indonesia we reached the top 5, pitched CORGEIN to a panel of expert judges at the ITB Ganesha campus and answered their questions on the spot.",
      },
      {
        heading: "Impact and what comes next",
        text: "CORGEIN is a prototype, and its value is the concept: a retrofit that reduces particulate emissions without asking anyone to stop burning. Turning it into something a household could rely on means measuring how much particulate it captures across different waste mixes and burn conditions, and what the plates and the high-voltage supply cost. Those numbers would show whether the idea can leave the competition stage.",
      },
    ],
  },
  {
    slug: "starship-rocket",
    title: "Starship Rocket: Unguided Two-Stage Retropropulsive Landing",
    dateRange: "Aug 2026 - Sep 2026",
    role: "Co-designer",
    scale: "standard",
    filters: {
      domain: ["Aerospace", "Physics", "Engineering"],
      type: ["Simulation"],
      framework: [],
      language: [],
    },
    featured: true,
    priority: false,
    scaleNote: "A focused simulation project with a clear question: how close can pre-timed burns alone get to a soft landing? Made for the BIRST 2026 Level 3 challenge.",
    links: { repo: "https://github.com/Akirenaki/Starship-V3-Rocket", demo: null, presentation: null, document: null },
    summary:
      "Rockets that land on their engines normally rely on active guidance. For the BIRST 2026 Level 3 challenge we simulated a Falcon 9 Crew-9 launch with no parachutes and no steering, only burns timed in advance, to see what that costs: touchdown at 15 to 17 m/s against a 5 m/s target, and about 0.9 km of wind drift.",
    cv: {
      problem:
        "Landing a rocket stage on its own engines normally relies on active guidance. The BIRST 2026 Level 3 challenge asks for a simulated Falcon 9 Crew-9 launch from Cape Canaveral that reaches a 3,000 m apogee and lands both stages propulsively.",
      approach:
        "Co-designed a two-stage vehicle in OpenRocket with one teammate, taking the strictest version of the task: no parachutes, no active stability control, only burns timed in advance. Recreated the SLC-40 launch site in OpenWind with a 30-layer wind profile (3.1 to 14.4 m/s), viewed the trajectories in Google Earth through OpenEarth, and used custom swept fins as grid-fin analogues.",
      impact:
        "Hit the apogee target to within 0.03 m (2,999.97 m against 3,000.00 m) and stayed subsonic (peak Mach 0.973). Landing missed the 5.0 m/s specification, at 16.7 m/s for the upper stage and 14.9 m/s for the booster, with 0.86 to 0.95 km of wind drift. The measured miss shows what fixed-delay burns and uncorrected crosswind cost, and why closed-loop guidance exists.",
    },
    stack: {
      visible: ["OpenRocket", "OpenWind"],
      hidden: ["OpenEarth / Google Earth", "Retropropulsive landing", "Wind modelling"],
    },
    caseStudy: [
      {
        heading: "The question",
        text: "The BIRST 2026 Level 3 (Falcon Rocket) task is to simulate a Falcon 9 Crew-9 launch from Cape Canaveral, reach a 3,000 m apogee and land both stages on their own engines. Real landings close a loop: sensors measure the descent and the vehicle adjusts continuously. We took the strictest version of the task and removed that loop, with no parachutes, no active stability control and only burns timed in advance, to ask what the loop is worth. How close can fixed timing alone get to a soft landing? I designed it with one teammate.",
      },
      {
        heading: "What we found",
        text: "Ascent worked. The rocket reached 2,999.97 m against the 3,000.00 m target, within 3 cm, and peaked at Mach 0.973, so it stayed subsonic. Landing missed the 5.0 m/s speed specification: the upper stage touched down at 16.7 m/s and the booster at 14.9 m/s, roughly three times the target, because fixed-delay ignition over-corrected the vertical momentum. Uncompensated crosswinds also carried both stages 0.86 to 0.95 km downwind.",
      },
      {
        heading: "Why fixed timing falls short",
        text: "We traced the touchdown miss to the ignition delays. They are chosen before launch, so no burn can respond to how the descent actually unfolds, and any small difference between the planned and the real fall goes straight into the touchdown speed. The wind result has the same cause: nothing in the vehicle senses the crosswind or actively steers against it, so the wind sets the drift.",
      },
      {
        heading: "How it was built",
        text: "A Loki K627LR ascent motor (1,526 N·s) set the apogee. The Cape Canaveral (SLC-40) site was recreated in OpenWind with a 30-layer extended ISA wind profile (crosswinds of 3.1 to 14.4 m/s), and the trajectories were viewed in Google Earth through OpenEarth. Burns from an AeroTech HP-H195NT (upper stage) and a Cesaroni 168H410-14A (booster) fire at fixed delays of 51.5 s and 65.0 s after launch, with custom swept fins standing in for Falcon 9's grid fins.",
      },
      {
        heading: "What the miss is worth",
        text: "A simulation that lands softly would show only that it can be done. One that misses by a measured amount shows what each omitted system is responsible for: about three times the target touchdown speed and nearly a kilometre of drift are the price of flying open-loop. That gives a baseline against which any added guidance can be judged.",
      },
      {
        heading: "What we would try next",
        text: "Better burn timing, different motor choices and launch-angle compensation for wind are the changes we would try next.",
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
      presentation: "https://canva.link/dsrlnulr2c1mef4",
      document: null,
    },
    summary:
      "A trebuchet's range depends on sling length, release angle and counterweight mass, and those interact in ways that are hard to see on paper. We modelled the physics, built a simulator anyone can tune in the browser, and tested a real prototype to find where the energy goes (43.8% efficiency).",
    cv: {
      problem:
        "A trebuchet's range depends on interacting variables (sling length, release angle and counterweight mass), and an ideal model ignores the energy a real machine loses.",
      approach:
        "Derived trajectory and force equations from classical mechanics, programmed a browser simulator for tuning the variables, and built and tested a physical prototype.",
      impact:
        "Measured a system efficiency of 43.8%, so more than half of the counterweight's energy never reaches the projectile; the simulator lets anyone explore the trade-offs.",
    },
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
        text: "Classical mechanics (rotational torque, moment of inertia, conservation of energy and projectile motion) gave the theoretical trajectory and force equations, which in turn gave us a prediction to test.",
      },
      {
        heading: "Interactive simulation",
        text: "A web-based JavaScript simulation lets anyone change sling length, launch angle and counterweight mass in real time and watch the trajectory update, so the effect of each variable can be seen by changing it instead of re-solving the equations.",
      },
      {
        heading: "Empirical data and efficiency",
        text: "We built and tested a physical prototype to collect launch data. Analysis gave a system efficiency of η = 43.8% and identified the factors behind the lost energy. Efficiency here is the share of the counterweight's energy that reaches the projectile, so the other 56.2% measures everything the ideal model leaves out. We co-authored a presentation and dataset that set out the fixed and independent variables and the findings.",
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
    links: { repo: null, demo: null, presentation: null, document: null },
    summary:
      "Exoplanet data comes as large tables that take time to analyse by hand. This AI agent workflow, built in Langflow for the IBM SkillsBuild University Education initiative with Hacktiv8, turns raw data inputs into structured analysis automatically.",
    cv: {
      problem:
        "Raw exoplanet data arrives as large tables, and turning it into something a reader can use means repeating the same analysis steps by hand.",
      approach:
        "Designed an end-to-end AI agent workflow in Langflow, with prompt engineering and agent orchestration, that takes raw data in and returns structured analysis.",
      impact:
        "Scored 97.50/100 in the IBM SkillsBuild University Education programme's judging (with Hacktiv8), and was followed in August by the retrieval-based Astronomy Object Chat Assistant.",
    },
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
        heading: "What it does",
        text: "The workflow is built in Langflow, a visual tool for assembling AI agent pipelines. Raw data goes in, an orchestrated agent works through it, and a structured analysis comes out, with prompt engineering shaping what the agent does at each step. It was built for the IBM SkillsBuild University Education initiative, in collaboration with Hacktiv8.",
      },
      {
        heading: "Results",
        text: "Final score of 97.50/100: 98.00 for Execution & Functionality, 98.00 for System Design & Architecture, 98.00 for Background & Impact and 96.00 for Creativity & Innovation. It exercised AI agent orchestration, workflow design in Langflow, prompt engineering, system architecture and data analysis. It was also the first of two AI builds on astronomical data: this agent workflow in May, and in August a retrieval-based chat assistant over star data.",
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
    links: { repo: "https://github.com/Akirenaki/astronomy-rag-chatbot", demo: null, presentation: null, document: null },
    summary:
      "General-purpose chatbots can make up details about a specific star. This assistant answers questions about the 50 brightest named stars in the HYG database using only the records it retrieves, and tells you when a star or fact is not in its data.",
    cv: {
      problem:
        "General-purpose chatbots can produce fluent, unsupported answers about a specific star, which is hard for a learner to spot and easy to repeat.",
      approach:
        "Built a retrieval-augmented generation pipeline in Python with LangChain, Chroma and the Gemini API over a subset of the HYG stellar database, with system-prompt guardrails that confine answers to retrieved records and a Streamlit chat that keeps session history for follow-up questions.",
      impact:
        "Every answer traces to a record in the dataset, and a missing record produces an honest refusal. Completed as the final project of the Hacktiv8 x AVPN course on LLM tools and the Gemini API, and serves as a decoupled prototype for a conversational layer on Taraka Sutra.",
    },
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
      {
        heading: "What it leaves out, on purpose",
        text: "It runs over a fixed, curated dataset, with no live SIMBAD or Exoplanet Archive calls, no shared deployment and no per-user rate limiting. Those were kept out of scope to finish within the deadline of the Hacktiv8 x AVPN course on LLM-based tools and the Gemini API, for which this was the final project. The aim was to prove the retrieval-and-guardrail pattern in isolation before it goes near a larger system.",
      },
      {
        heading: "Where it leads",
        text: "The assistant is a decoupled prototype for a future chat layer on top of Taraka Sutra. The pattern it proves, answer only from retrieved records and say so when nothing is retrieved, is the one that would carry over.",
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
