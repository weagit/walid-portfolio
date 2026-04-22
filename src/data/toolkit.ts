/**
 * Chapter V — Toolkit. Two sides of the same person.
 * Build = the technical craft. Bridge = the analyst vocabulary.
 */

export type ToolGroup = {
  id: "build" | "bridge";
  label: string;
  lead: string;
  items: readonly { name: string; note?: string }[];
};

export const toolkit: readonly ToolGroup[] = [
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
];

export const toolkitLanguages: readonly { name: string; level: string }[] = [
  { name: "French", level: "Native" },
  { name: "Spanish", level: "Native" },
  { name: "Arabic", level: "Native" },
  { name: "English", level: "Fluent" },
  { name: "Dutch", level: "Basic" },
];

export const toolkitChapter = {
  chapter: "V.",
  title: "Toolkit",
  sub: "Two sides. Same person.",
} as const;
