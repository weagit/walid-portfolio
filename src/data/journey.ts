/**
 * Chapter IV — Journey. Experience + Education, interleaved chronologically.
 * Each entry has a "tag" so the UI can color-mark internships vs school vs
 * competitions without hardcoding anything in the component.
 */

export type JourneyEntry = {
  id: string;
  tag: "experience" | "education" | "competition";
  kind: string; // e.g. "Internship", "Bachelor's", "Hackathon"
  org: string;
  role: string;
  location: string;
  period: string;
  lead: string; // one-line summary, serif italic
  points: readonly string[];
  meta?: readonly string[]; // small-caps chips (stack, context)
};

export const journey: readonly JourneyEntry[] = [
  {
    id: "accenture",
    tag: "experience",
    kind: "Internship",
    org: "Accenture",
    role: "Fullstack Development Intern · Financial Services",
    location: "Brussels",
    period: "Jan — May 2026",
    lead: "Regulatory compliance in insurance, owned end-to-end by a four-person Agile team.",
    points: [
      "Jira tickets end-to-end — analysis, implementation, VAL, production — business logic validated with the Tech Lead before any code.",
      "Multi-stack delivery across Vue.js, Java / Spring Boot, an R calculation engine, Azure and Azure DevOps.",
      "Contributing to the Vue 2 → Vue 3 migration: scoping, impact analysis, rollout.",
      "Active in Agile rituals, exchanging daily with functional analysts, cybersecurity and design teams.",
    ],
    meta: ["Vue.js", "Spring Boot", "R", "Azure", "Agile"],
  },
  {
    id: "helb",
    tag: "education",
    kind: "Bachelor's degree",
    org: "HELB — Haute École Libre de Bruxelles",
    role: "Computer Science · final year",
    location: "Brussels",
    period: "2023 — 2026",
    lead: "Engineering fundamentals alongside coursework in systems analysis, data science, ERP and project management.",
    points: [
      "Full-stack, mobile, object-oriented design, databases, networks.",
      "Systems analysis, data science, ERP, project management — the analyst-side vocabulary.",
      "Three years of project work culminating in this portfolio's showcased builds.",
    ],
    meta: ["Systems analysis", "Data science", "ERP", "Project management"],
  },
  {
    id: "odoo-hackathon",
    tag: "competition",
    kind: "Hackathon",
    org: "Odoo Hackathon",
    role: "Participant · team of four",
    location: "Belgium",
    period: "2024",
    lead: "Ranked 4th overall. A weekend of rapid problem-solving under pressure.",
    points: [
      "Scoped, built and shipped a collaborative project in under 48 hours.",
      "Practiced project management, division of work and rapid decision-making.",
    ],
    meta: ["Teamwork", "Rapid delivery", "Scoping"],
  },
  {
    id: "dominique-pire",
    tag: "education",
    kind: "High School",
    org: "Institut Dominique Pire",
    role: "General Sciences",
    location: "Belgium",
    period: "2018 — 2023",
    lead: "Scientific track — mathematics, physics, chemistry, biology.",
    points: [],
  },
];

export const journeyChapter = {
  chapter: "IV.",
  title: "Journey",
  sub: "Where I've been, and the direction it's pointing.",
  closing:
    "Next chapter: a Master's. Stepping deeper into the space between business and engineering.",
} as const;
