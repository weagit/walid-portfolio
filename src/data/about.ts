/**
 * About section content — separate file so Walid can edit prose easily.
 */

export const about = {
  chapter: "II.",
  lead: "Based in Brussels. Full-stack developer in the making.",
  paragraphs: [
    "Currently building at Accenture, finishing my final year at HELB Ilya Prigogine.",
    "Comfortable across Java / Spring Boot, C# / .NET, React, React Native, and Python. Equally at ease in backend architecture, web, and mobile.",
    "Disciplined about delivery. Humble about learning. Every day in this field teaches me something I didn't know yesterday.",
  ],
  languages: ["French", "Spanish", "Arabic", "English", "Dutch"],
  // Words inside paragraphs that get the hover accent underline.
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
} as const;
