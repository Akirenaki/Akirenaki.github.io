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
  pronouns: "she/they",

  tagline: "Faith offers no refuge to those lost in ignorance",
  roleSummary: "Aspiring Astrophysicist | Independent Web Developer | Human Rights Activist",

  location: "Yogyakarta, Indonesia",

  // Core technical domains - shown as a brief strip on Home, linking through
  // to About/Work. Kept honest to what's actually been built, not aspirational.
  coreDomains: [
    "Astronomical Data Pipelines",
    "Full-Stack Web Systems (FastAPI, Next.js)",
    "Applied Statistics & Modelling",
    "Astrophysics",
  ],

  // About bio - reproduced from the LinkedIn "About" section, her own words.
  bioParagraphs: [
    "I am an aspiring astrophysicist dedicated to investigating physical systems through computational modelling, statistical inference, and large-scale data analysis. My objective is to contribute to observational and computational research by leveraging quantitative methodologies to extract insights from complex astronomical datasets.",
    "Driven by a commitment to open science and the democratisation of research, I advocate for accessible scientific data infrastructure, transparent methodologies, and collaborative knowledge-sharing. I also engage in philosophy and human rights advocacy, focusing on gender equity, LGBTQ+ rights, and racial justice.",
    "Alongside my core scientific and social focus, I specialise in information architecture and structural synthesis, regularly aggregating, cross-referencing, and reconciling disparate qualitative data sources to build unified, logically coherent systems, which strengthens my pattern recognition, systematic literature review, and technical documentation.",
    "Though I am legally known as Raden Bagus Narendra Tsaqiif Aryasuta Maldini, I operate professionally and academically as Renee Astraea.",
  ],

  // Home summary - shorter restatement for the landing page, not LinkedIn text.
  homeSummary:
    "Aspiring astrophysicist focused on physical systems, computational modelling, statistical inference, and large-scale data analysis to derive insight from complex astronomical datasets. Dedicated to open science, accessible research infrastructure, transparent methodologies, and collaborative knowledge-sharing, while advocating for human rights.",

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
      image: "/assets/credentials/education-cs50x.jpg",
      description: "Completed CS50x, Harvard's introduction to computer science, covering core algorithms, memory management, database design, and asynchronous web applications.",
      bullets: [
        "Task score 100/100, with the final project Taraka Sutra, a full-stack astronomical cross-catalogue matching web app (FastAPI, SIMBAD and the NASA Exoplanet Archive, Three.js).",
        "Worked in Python, C, SQL, JavaScript, Flask and FastAPI, with PostgreSQL, SQLAlchemy and Alembic, and tested with pytest.",
      ],
    },
  ],

  languages: [
    { name: "Indonesian", level: "Native" },
    { name: "English", level: "Professional working proficiency" },
    { name: "Japanese", level: "Professional working proficiency" },
  ],

  contact: {
    email: "narendramal4869@gmail.com",
    whatsapp: "+62 856-4711-9201",
    linkedin: "https://www.linkedin.com/in/renee-astraea/",
    github: { label: "Akirenaki", url: "https://github.com/Akirenaki" },
    instagram: {
      label: "heavychainthatdoesfreezemybone",
      url: "https://www.instagram.com/heavychainthatdoesfreezemybone/",
    },
    kaggle: { label: "reneeastraea", url: "https://www.kaggle.com/reneeastraea" },
  },
};
