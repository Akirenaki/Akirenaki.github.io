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

  tagline: "May this journey lead us starward!",
  roleSummary: "Aspiring Astrophysicist | Beginner Web Developer | Human Rights Activist",

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
    "Driven by a commitment to open science and the democratisation of research, I advocate for accessible scientific data infrastructure, transparent methodologies, and collaborative knowledge-sharing. I also engage in human rights advocacy, focusing on gender equity, LGBTQ+ rights, and racial justice.",
    "Alongside my core scientific and social focus, I specialise in information architecture and structural synthesis, regularly aggregating, cross-referencing, and reconciling disparate qualitative data sources to build unified, logically coherent systems. This strengthens my pattern recognition, systematic literature review, and technical documentation.",
  ],

  // Home summary - shorter restatement for the landing page, not LinkedIn text.
  homeSummary:
    "Aspiring astrophysicist focused on physical systems, computational modelling, statistical inference, and large-scale data analysis to derive insight from complex astronomical datasets. Dedicated to open science, accessible research infrastructure, transparent methodologies, and collaborative knowledge-sharing, while advocating for human rights.",

  education: {
    // Left as a placeholder per instruction - fill in your current program.
    institution: "SMA Negeri 1 Yogyakarta · AMS Afd. A",
    degree: "High School Diploma",
    graduation: "May 2027",
    image: "/assets/credentials/education-sma-negeri-1-yogyakarta.jpg",
    description: "Specialising in Mathematics and Natural Sciences (MIPA) with a concentration in physics and mathematics, with additional coursework in computer science, statistics, and astronomy.",
    bullets: [
      "Admitted to the high-performance Astronomy Olympiad class based on competitive placement testing.",
      "Focused on astronomy theory, astrophysics problem solving, and data analysis beyond standard curriculum."
    ],
  },

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
