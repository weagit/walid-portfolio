/**
 * Chapter IV — Journey. EN + Belgian FR.
 * Each entry has a tag so the UI colors internships vs school vs comps.
 */

export type JourneyEntry = {
  id: string;
  tag: "experience" | "education" | "competition";
  kind: string;
  org: string;
  role: string;
  location: string;
  period: string;
  lead: string;
  points: readonly string[];
  meta?: readonly string[];
};

type JourneyContent = {
  chapter: string;
  title: string;
  sub: string;
  closing: string;
  entries: readonly JourneyEntry[];
};

export const journeyContent: { en: JourneyContent; fr: JourneyContent } = {
  en: {
    chapter: "IV.",
    title: "Journey",
    sub: "Where I've been, and the direction it's pointing.",
    closing:
      "Next chapter: a Master's. Stepping deeper into the space between business and engineering.",
    entries: [
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
    ],
  },
  fr: {
    chapter: "IV.",
    title: "Parcours",
    sub: "D'où je viens — et la direction que ça prend.",
    closing:
      "Prochain chapitre : un Master. M'avancer plus avant, à la croisée du métier et de l'ingénierie.",
    entries: [
      {
        id: "accenture",
        tag: "experience",
        kind: "Stage",
        org: "Accenture",
        role: "Stagiaire Développement Full-Stack · Services Financiers",
        location: "Bruxelles",
        period: "Jan — Mai 2026",
        lead: "Conformité réglementaire en assurance, prise en charge de bout en bout par une équipe Agile de quatre personnes.",
        points: [
          "Tickets Jira gérés de bout en bout — analyse, implémentation, VAL, mise en production — la logique métier est validée avec le Tech Lead avant tout code.",
          "Livraison multi-stack : Vue.js, Java / Spring Boot, un moteur de calcul en R, Azure et Azure DevOps.",
          "Contribution à la migration Vue 2 → Vue 3 : cadrage, analyse d'impact, déploiement.",
          "Présent dans les rituels Agile, en échange quotidien avec les analystes fonctionnels, la cybersécurité et le design.",
        ],
        meta: ["Vue.js", "Spring Boot", "R", "Azure", "Agile"],
      },
      {
        id: "helb",
        tag: "education",
        kind: "Bachelier",
        org: "HELB — Haute École Libre de Bruxelles",
        role: "Informatique · dernière année",
        location: "Bruxelles",
        period: "2023 — 2026",
        lead: "Fondamentaux d'ingénierie complétés par des cours d'analyse des systèmes, de data science, d'ERP et de gestion de projet.",
        points: [
          "Full-stack, mobile, conception orientée objet, bases de données, réseaux.",
          "Analyse des systèmes, data science, ERP, gestion de projet — tout le vocabulaire côté analyste.",
          "Trois années de projets qui aboutissent aux travaux mis en avant dans ce portfolio.",
        ],
        meta: ["Analyse des systèmes", "Data science", "ERP", "Gestion de projet"],
      },
      {
        id: "odoo-hackathon",
        tag: "competition",
        kind: "Hackathon",
        org: "Odoo Hackathon",
        role: "Participant · équipe de quatre",
        location: "Belgique",
        period: "2024",
        lead: "Classés 4èmes. Un week-end à résoudre vite et bien, sous pression.",
        points: [
          "Cadrage, conception et livraison d'un projet collaboratif en moins de 48 heures.",
          "Gestion de projet, répartition des tâches et prises de décision rapides.",
        ],
        meta: ["Travail d'équipe", "Livraison rapide", "Cadrage"],
      },
      {
        id: "dominique-pire",
        tag: "education",
        kind: "Secondaire",
        org: "Institut Dominique Pire",
        role: "Sciences générales",
        location: "Belgique",
        period: "2018 — 2023",
        lead: "Filière scientifique — mathématiques, physique, chimie, biologie.",
        points: [],
      },
    ],
  },
};
