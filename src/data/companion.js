// Heimarmene's interactive FAQ. Edit this file to change the questions.
//
// Answers are built from the same data files the pages use (profile.js,
// projects.js, writing.js, awards.js), so a figure or title cannot drift
// away from what the site itself says. Only the wording around them is
// written here. Heimarmene speaks as a guide to the site, in the third person.
//
// Each question:
//   id        unique, lower-case kebab-case
//   group     one of GROUPS below
//   question  the text on the button, and the visitor's side of the exchange
//   related   up to three ids offered as follow-ups after the answer
//   answer()  returns { text, links }. `text` is plain text. Each link is
//             { label, to } for a page on this site (a #section is fine) or
//             { label, href } for an external address.

import { profile } from "./profile";
import { projects, getBigFeaturedProject } from "./projects";
import { writing, getBigFeaturedWriting } from "./writing";
import { testScores, technicalStack } from "./awards";
import { TAGS_BY_ID } from "./writing-taxonomy";

export const GROUPS = [
  { id: "about", label: "About Renee" },
  { id: "work", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

const firstName = profile.preferredNameHome.split(" ")[0];

// The first `count` sentences of a paragraph, so a long summary stays readable.
function lead(text, count) {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!sentences) return text;
  return sentences.slice(0, count).join("").trim();
}

const projectBySlug = (slug) => projects.find((p) => p.slug === slug);

export const COMPANION_QUESTIONS = [
  {
    id: "about-focus",
    group: "about",
    question: `What does ${firstName} work on?`,
    related: ["work-start", "about-study", "contact-how"],
    answer: () => ({
      text: `${profile.roleSummary.split(" | ").join(", ")}. The core areas are ${profile.coreDomains.join("; ")}.`,
      links: [{ label: "Read the About page", to: "/about" }],
    }),
  },
  {
    id: "about-study",
    group: "about",
    question: `Where does ${firstName} study?`,
    related: ["about-tests", "about-tools", "writing-start"],
    answer: () => {
      const current = profile.education[0];
      return {
        text: `${current.institution}: ${current.degree} (${current.dateLabel}). ${current.description}`,
        links: [{ label: "See education", to: "/about#education" }],
      };
    },
  },
  {
    id: "about-tests",
    group: "about",
    question: "What are the test scores?",
    related: ["about-study", "about-tools", "contact-how"],
    answer: () => ({
      text: testScores
        .map((t) => `${t.name}: ${t.value.toFixed(t.decimals)} out of ${t.max.toFixed(t.decimals)} (${t.date})`)
        .join(". ") + ".",
      links: [{ label: "See the section breakdown", to: "/about#test-scores" }],
    }),
  },
  {
    id: "about-tools",
    group: "about",
    question: "Which tools are used day to day?",
    related: ["work-start", "work-all", "about-focus"],
    answer: () => ({
      text: `Daily: ${technicalStack.daily.join(", ")}.`,
      links: [{ label: "See the full stack", to: "/about#stack" }],
    }),
  },
  {
    id: "work-start",
    group: "work",
    question: "Which project should I look at first?",
    related: ["work-cherenkov", "work-astro", "work-all"],
    answer: () => {
      const big = getBigFeaturedProject();
      return {
        text: `The lead project is “${big.title}”. Role: ${big.role}. ${lead(big.summary, 1)}`,
        links: [{ label: "Open the case study", to: `/work/${big.slug}` }],
      };
    },
  },
  {
    id: "work-cherenkov",
    group: "work",
    question: "What is Project Cherenkov?",
    related: ["work-astro", "work-start", "work-all"],
    answer: () => {
      const p = projectBySlug("project-cherenkov");
      return { text: p.summary, links: [{ label: "Open the case study", to: `/work/${p.slug}` }] };
    },
  },
  {
    id: "work-astro",
    group: "work",
    question: "What has been built with astronomical data?",
    related: ["work-cherenkov", "work-start", "about-tools"],
    answer: () => {
      const p = projectBySlug("astronomical-multi-catalog-identifier-matcher");
      return { text: lead(p.summary, 3), links: [{ label: "Open the case study", to: `/work/${p.slug}` }] };
    },
  },
  {
    id: "work-all",
    group: "work",
    question: "How many projects are there?",
    related: ["work-start", "work-cherenkov", "about-tools"],
    answer: () => {
      const featured = projects.filter((p) => p.featured).length;
      return {
        text: `${projects.length} projects so far, ${featured} of them featured. The Work page can be filtered by domain, type, framework and language.`,
        links: [{ label: "Browse all projects", to: "/work" }],
      };
    },
  },
  {
    id: "writing-about",
    group: "writing",
    question: `What does ${firstName} write about?`,
    related: ["writing-start", "work-start", "contact-how"],
    answer: () => {
      const subjects = [
        ...new Set(writing.flatMap((w) => w.tags?.subject ?? []).map((id) => TAGS_BY_ID.get(id)?.label).filter(Boolean)),
      ].map((s) => s.toLowerCase());
      const list = subjects.length > 1 ? `${subjects.slice(0, -1).join(", ")} and ${subjects.at(-1)}` : subjects.join("");
      return {
        text: `${writing.length} essays so far, covering ${list}. Each essay has its full text on its own page, with a PDF and a Google Docs link.`,
        links: [{ label: "Browse the writing", to: "/writing" }],
      };
    },
  },
  {
    id: "writing-start",
    group: "writing",
    question: "Which essay should I read first?",
    related: ["writing-about", "work-start", "contact-how"],
    answer: () => {
      const big = getBigFeaturedWriting();
      return {
        text: `The featured essay is “${big.title}” (${big.wordCount} words).`,
        links: [{ label: "Read the essay", to: `/writing/${big.slug}` }],
      };
    },
  },
  {
    id: "contact-how",
    group: "contact",
    question: `How can I get in touch with ${firstName}?`,
    related: ["contact-elsewhere", "work-start", "writing-about"],
    answer: () => ({
      text: `The quickest way is email: ${profile.contact.email}. The Contact page also has a message form.`,
      links: [
        { label: "Open the Contact page", to: "/contact" },
        { label: "Send an email", href: `mailto:${profile.contact.email}` },
      ],
    }),
  },
  {
    id: "contact-elsewhere",
    group: "contact",
    question: "Where else can I find the work online?",
    related: ["contact-how", "work-start", "about-tools"],
    answer: () => ({
      text: "Code is on GitHub, data work is on Kaggle, and the professional profile is on LinkedIn.",
      links: [
        { label: "GitHub", href: profile.contact.github.url },
        { label: "Kaggle", href: profile.contact.kaggle.url },
        { label: "LinkedIn", href: profile.contact.linkedin },
      ],
    }),
  },
];

export const QUESTIONS_BY_ID = new Map(COMPANION_QUESTIONS.map((q) => [q.id, q]));
