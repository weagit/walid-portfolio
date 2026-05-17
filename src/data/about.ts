/**
 * Chapter II — About. EN + Belgian FR. Same intent, not literal translation.
 */

type AboutContent = {
  chapter: string;
  lead: string;
  paragraphs: readonly string[];
  languages: readonly string[];
  keywords: readonly string[];
  langsLabel: string;
};

export const aboutContent: { en: AboutContent; fr: AboutContent } = {
  en: {
    chapter: "II.",
    lead: "Based in the Brussels periphery. Full-stack developer in the making.",
    paragraphs: [
      "Currently building at Accenture, finishing my final year at HELB Ilya Prigogine.",
      "Comfortable across Java / Spring Boot, C# / .NET, React, React Native, and Python. Equally at ease in backend architecture, web, and mobile.",
      "Disciplined about delivery. Humble about learning. Every day in this field teaches me something I didn't know yesterday.",
    ],
    languages: ["French", "Spanish", "Arabic", "English", "Dutch"],
    keywords: [
      "Accenture",
      "HELB",
      "Java",
      "Spring",
      "Boot",
      "C#",
      ".NET",
      "React",
      "Native",
      "Python",
      "backend",
      "web",
      "mobile",
    ],
    langsLabel: "Languages spoken",
  },
  fr: {
    chapter: "II.",
    lead: "Établi en périphérie bruxelloise. Développeur full-stack en construction.",
    paragraphs: [
      "J'évolue actuellement chez Accenture tout en achevant ma dernière année à la HELB Ilya Prigogine.",
      "À l'aise avec Java / Spring Boot, C# / .NET, React, React Native et Python, aussi bien en architecture backend qu'en développement web et mobile.",
      "Exigeant dans l'exécution. Humble face à l'apprentissage. Chaque journée passée dans ce métier m'enseigne ce que j'ignorais encore la veille.",
    ],
    languages: ["Français", "Espagnol", "Arabe", "Anglais", "Néerlandais"],
    keywords: [
      "Accenture",
      "HELB",
      "Java",
      "Spring",
      "Boot",
      "C#",
      ".NET",
      "React",
      "Native",
      "Python",
      "backend",
      "web",
      "mobile",
      "architecture",
      "exécution",
    ],
    langsLabel: "Langues parlées",
  },
};
