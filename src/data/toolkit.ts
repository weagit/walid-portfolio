/**
 * Chapter V — Toolkit. Build = the technical craft. Bridge = the analyst side.
 * EN + Belgian FR.
 */

export type ToolGroup = {
  id: "build" | "bridge";
  label: string;
  lead: string;
  items: readonly { name: string; note?: string }[];
};

type ToolkitContent = {
  chapter: string;
  title: string;
  sub: string;
  groups: readonly ToolGroup[];
  languages: readonly { name: string; level: string }[];
  languagesLabel: string;
};

export const toolkitContent: { en: ToolkitContent; fr: ToolkitContent } = {
  en: {
    chapter: "V.",
    title: "Toolkit",
    sub: "Two sides. Same person.",
    languagesLabel: "Languages",
    groups: [
      {
        id: "build",
        label: "Build",
        lead: "The craft — shipping software end to end.",
        items: [
          { name: "Java / Spring Boot", note: "Backend, REST, JPA" },
          { name: "C# / .NET", note: "MAUI, MVVM, MVC" },
          { name: "React / React Native", note: "Web & mobile" },
          { name: "Vue.js", note: "2 → 3 migration" },
          { name: "Python", note: "Scripts, ML tooling" },
          { name: "SQL / PostgreSQL" },
          { name: "Azure / DevOps" },
          { name: "Docker" },
        ],
      },
      {
        id: "bridge",
        label: "Bridge",
        lead: "The translation — between stakeholders and engineering.",
        items: [
          { name: "Requirements gathering", note: "User stories, acceptance criteria" },
          { name: "Process modeling", note: "UML, BPMN basics" },
          { name: "Functional specifications" },
          { name: "Agile / Scrum", note: "Daily rituals, refinements, VAL" },
          { name: "Stakeholder communication" },
          { name: "Impact analysis", note: "Scoping, rollout" },
          { name: "ERP fundamentals" },
          { name: "Data science fundamentals" },
        ],
      },
    ],
    languages: [
      { name: "French", level: "Native" },
      { name: "Spanish", level: "Native" },
      { name: "Arabic", level: "Native" },
      { name: "English", level: "Fluent" },
      { name: "Dutch", level: "Basic" },
    ],
  },
  fr: {
    chapter: "V.",
    title: "Boîte à outils",
    sub: "Deux facettes. Une seule personne.",
    languagesLabel: "Langues",
    groups: [
      {
        id: "build",
        label: "Build",
        lead: "Le métier — livrer du logiciel de bout en bout.",
        items: [
          { name: "Java / Spring Boot", note: "Backend, REST, JPA" },
          { name: "C# / .NET", note: "MAUI, MVVM, MVC" },
          { name: "React / React Native", note: "Web & mobile" },
          { name: "Vue.js", note: "Migration 2 → 3" },
          { name: "Python", note: "Scripts, outillage ML" },
          { name: "SQL / PostgreSQL" },
          { name: "Azure / DevOps" },
          { name: "Docker" },
        ],
      },
      {
        id: "bridge",
        label: "Bridge",
        lead: "Le pont — entre les parties prenantes et l'ingénierie.",
        items: [
          { name: "Recueil des besoins", note: "User stories, critères d'acceptation" },
          { name: "Modélisation des processus", note: "UML, bases du BPMN" },
          { name: "Spécifications fonctionnelles" },
          { name: "Agile / Scrum", note: "Rituels, refinements, VAL" },
          { name: "Communication avec les parties prenantes" },
          { name: "Analyse d'impact", note: "Cadrage, déploiement" },
          { name: "Fondamentaux ERP" },
          { name: "Fondamentaux data science" },
        ],
      },
    ],
    languages: [
      { name: "Français", level: "Natif" },
      { name: "Espagnol", level: "Natif" },
      { name: "Arabe", level: "Natif" },
      { name: "Anglais", level: "Courant" },
      { name: "Néerlandais", level: "Notions" },
    ],
  },
};
