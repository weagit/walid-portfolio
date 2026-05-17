/**
 * Centralized profile data. Locale-aware fields live under `i18n`,
 * everything else (paths, URLs, full name) is locale-neutral.
 */

export const profile = {
  name: {
    short: "Walid E.A E.I",
    full: "Walid El Aidouni El Idrissi",
  },
  // The signature stays in English on purpose — it's a tagline, not prose.
  quote: "Work for it",
  photo: "/images/pfpWalid.png",
  statue: "/images/sculpture.png",
  contact: {
    email: "walidelidrissi011@gmail.com",
    linkedin:
      "https://www.linkedin.com/in/walid-el-aidouni-el-idrissi-06bab8330/",
    github: "https://github.com/weagit",
  },
  i18n: {
    en: { location: "Brussels Periphery" },
    fr: { location: "Périphérie bruxelloise" },
  },
} as const;
