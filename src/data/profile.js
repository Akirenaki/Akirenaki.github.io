// Edit this file to update hero, bio, contact links, and languages.
// Nothing here is fetched or generated - it's the single source of truth
// for the text that appears across Home, About, and Contact.

export const profile = {
  // Hero: two names, preferred one shown larger (see Hero.jsx / About.jsx).
  // ASSUMPTION: "legal" is set to the LinkedIn header name (Narendra Maldini)
  // rather than the full formal name - swap this if you meant the longer one.
  nameLegal: "Narendra Maldini",
  namePreferred: "Renee Astraea",
  tagline: "May this journey lead us starward!",
  roleSummary: "Astrophysics student & software developer",

  location: "Yogyakarta, Indonesia",

  // Core technical domains - shown as a brief strip on Home, linking through
  // to About/Work. Kept honest to what's actually been built, not aspirational.
  coreDomains: [
    "Astronomical Data Pipelines",
    "Full-Stack Web Systems",
    "Embedded Systems & IoT",
    "Applied Statistics & Modelling",
  ],

  // About bio - reproduced from the LinkedIn "About" section, her own words.
  bioParagraphs: [
    "I am an aspiring astrophysicist dedicated to investigating physical systems through computational modelling, statistical inference, and large-scale data analysis. My objective is to contribute to observational and computational research by leveraging quantitative methodologies to extract insights from complex astronomical datasets.",
    "Driven by a commitment to open science and the democratisation of research, I advocate for accessible scientific data infrastructure, transparent methodologies, and collaborative knowledge-sharing. I also engage in human rights advocacy, focusing on gender equity, LGBTQ+ rights, and racial justice.",
    "Alongside my core scientific and social focus, I specialise in information architecture and structural synthesis, regularly aggregating, cross-referencing, and reconciling disparate qualitative data sources to build unified, logically coherent systems. This strengthens my pattern recognition, systematic literature review, and technical documentation.",
  ],

  // Home summary - shorter restatement for the landing page, not LinkedIn text.
  homeSummary:
    "I build the software layer underneath observational astronomy: identifier resolution across mismatched catalogues, interactive visualisations for physics education, and the occasional piece of hardware to go with it.",

  education: {
    // Left as a placeholder per instruction - fill in your current program.
    institution: "[INSTITUTION NAME]",
    degree: "[DEGREE]",
    graduation: "[EXPECTED GRADUATION DATE]",
  },

  languages: [
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
