/**
 * Centralized profile data.
 * Single source of truth — edit once, updates everywhere.
 */

export const profile = {
  name: {
    short: "Walid E.A E.I",
    full: "Walid El Aidouni El Idrissi",
  },
  quote: "Work for it",
  photo: "/images/pfpWalid.png",
  statue: "/images/sculpture.png",
  location: "Brussels, Belgium",
  contact: {
    email: "walidelidrissi011@gmail.com",
    linkedin:
      "https://www.linkedin.com/in/walid-el-aidouni-el-idrissi-06bab8330/",
    github: "https://github.com/weagit",
  },
} as const;
