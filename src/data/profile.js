// Edit this file to update hero, bio, contact links, and languages.
// Nothing here is fetched or generated - it's the single source of truth
// for the text that appears across Home, About, and Contact.

export const profile = {
  // Four name categories across Home and CV:
  legalNameHome: "Legal Name: Raden Bagus Narendra Tsaqiif Aryasuta Maldini",
  preferredNameHome: "Renee Astraea",
  legalNameCV: "Raden Bagus Narendra Tsaqiif Aryasuta Maldini",
  preferredNameCV: "Preferred Name: Renee Astraea",

  // Aliases for convenience/backwards compatibility:
  nameLegalHome: "Legal Name: Raden Bagus Narendra Tsaqiif Aryasuta Maldini",
  namePreferredHome: "Renee Astraea",
  nameLegalCV: "Raden Bagus Narendra Tsaqiif Aryasuta Maldini",
  namePreferredCV: "Preferred Name: Renee Astraea",
  nameLegal: "Legal Name: Raden Bagus Narendra Tsaqiif Aryasuta Maldini",
  namePreferred: "Renee Astraea",

  // Shown on Home, About and the printable CV. One value, so the three
  // pages cannot drift apart. Delete this line to remove it everywhere.
  pronouns: "she/they/he",

  tagline: "Faith offers no refuge to those lost in ignorance",
  roleSummary: "Aspiring Astrophysicist, Independent Web Developer, Human Rights Activist",

  location: "Yogyakarta, Indonesia",

  // Set `enabled` to false when the portrait is a personal photograph.
  portraitNotice: {
    enabled: true,
    subject: "Cyrene",
    subjectType: "fictional character",
    source: "Honkai: Star Rail",
    sourceLink: "https://static.wikia.nocookie.net/houkai-star-rail/images/7/72/Character_Cyrene_Eidolon_3.png/revision/latest/scale-to-width-down/1000?cb=20251029074641",
  },

  // Core technical domains - shown as a brief strip on Home, linking through
  // to About/Work. Kept honest to what's actually been built, not aspirational.
  coreDomains: [
    "Astronomical Data Pipelines",
    "Full-Stack Web Systems (FastAPI, Next.js)",
    "Astrophysics",
    "Human Rights Advocacy",
  ],

  // About bio - 
  bioParagraphs: [
    "I am Renee Astraea, an aspiring astrophysicist and independent developer interested in applying computational methods to astronomical research. My interests include astronomical data analysis, scientific software, statistical methods, and the use of programming to investigate physical phenomena.",
    "My projects explore ways to make scientific information and technology more accessible. Taraka Sutra is an astronomy application that resolves alternative catalogue identifiers to retrieve information across astronomical databases. I also co-founded Project Cherenkov, an open-source bilingual learning platform that combines Olympiad materials with interactive visualisations for students in informatics, physics, and astronomy.",
    "Beyond science and software, I write about philosophy, particularly questions concerning the mind, identity, and the foundations of knowledge. This portfolio brings these interests together through project case studies, technical documentation, and independent writing.",
    "Though I am legally known as Raden Bagus Narendra Tsaqiif Aryasuta Maldini, I operate professionally and academically as Renee Astraea.",
  ],

  // Home summary - shorter restatement for the landing page, not LinkedIn text.
  homeSummary:
    "Aspiring astrophysicist interested in physical systems and the use of computational modelling, statistical methods, and astronomical data analysis. I build scientific software and interactive tools, with interests in open science, accessible research infrastructure, transparent methods, and collaborative knowledge-sharing, alongside human-rights advocacy.",

  // Newest-first is not required: list the current programme first, then
  // completed courses. `dateLabel` is the line shown on About ("Expected May 2027",
  // "Completed 2026"); `graduation` is the short date on the printable CV.
  // `image` falls back to a labelled placeholder until the file exists in
  // assets-src/credentials/ (see README, "Adding and Uploading Media").
  education: [
    {
      institution: "SMA Negeri 1 Yogyakarta · AMS Afd. A",
      degree: "High School Diploma",
      graduation: "May 2027",
      dateLabel: "Expected May 2027",
      image: "/assets/credentials/education-sma-negeri-1-yogyakarta.jpg",
      description: "Specialising in Mathematics and Natural Sciences (MIPA) with a concentration in physics and mathematics, with additional coursework in computer science, statistics, and astronomy.",
      bullets: [
        "Admitted to the high-performance Astronomy Olympiad class based on competitive placement testing.",
        "Focused on astronomy theory, astrophysics problem solving, and data analysis beyond standard curriculum.",
      ],
    },
    {
      institution: "HarvardX - CS50x",
      degree: "Certificate in CS50x: Introduction to Computer Science",
      graduation: "2026",
      dateLabel: "Completed 2026",
      image: null,
      description: "Completed CS50x, Harvard's introduction to computer science, covering core algorithms, memory management, database design, and asynchronous web applications.",
      bullets: [
        "Final project Taraka Sutra, a full-stack astronomical cross-catalogue matching web app (FastAPI, SIMBAD and the NASA Exoplanet Archive, Three.js).",
        "Worked in Python, C, SQL, JavaScript, Flask and FastAPI, with PostgreSQL, SQLAlchemy and Alembic, and tested with pytest.",
      ],
    },
  ],

  languages: [
    { name: "Indonesian", level: "Native" },
    { name: "English", level: "Professional working proficiency" },
  ],

  contact: {
    email: "narendramal4869@gmail.com",
    casualEmail: "renedepetrichor4869@gmail.com",
    whatsapp: "+62 856-4711-9201",
    hoyolab: "https://www.hoyolab.com/accountCenter/postList?id=346278097",
    linkedin: "https://www.linkedin.com/in/renee-astraea/",
    github: { 
      label: "Akirenaki", 
      url: "https://github.com/Akirenaki" },
    instagram: {
      label: "heavychainthatdoesfreezemybone",
      url: "https://www.instagram.com/heavychainthatdoesfreezemybone/",
    },
    kaggle: { 
      label: "reneeastraea", 
      url: "https://www.kaggle.com/reneeastraea" },
  },
};
