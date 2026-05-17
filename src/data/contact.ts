/**
 * Chapter VI — Contact. Closing chapter, EN + Belgian FR.
 */

type ContactContent = {
  chapter: string;
  title: string;
  lead: string;
  closing: string;
  // Labels surfaced inside the section
  emailLabel: string;
  locationLabel: string;
  preferredLabel: string;
  preferredValue: string;
  socialLabel: string;
  bookACall: string;
  copyEmail: string;
  copied: string;
};

export const contactContent: { en: ContactContent; fr: ContactContent } = {
  en: {
    chapter: "VI.",
    title: "Contact",
    lead: "Based in the Brussels periphery. Reading — and building — toward what comes next.",
    closing: "Open to what comes next.",
    emailLabel: "Email",
    locationLabel: "Location",
    preferredLabel: "Preferred",
    preferredValue: "Email or LinkedIn",
    socialLabel: "Social",
    bookACall: "Get in touch",
    copyEmail: "Copy email",
    copied: "Copied",
  },
  fr: {
    chapter: "VI.",
    title: "Contact",
    lead: "Établi en périphérie bruxelloise. J'apprends — et je construis — en direction de ce qui vient.",
    closing: "Ouvert à ce qui vient.",
    emailLabel: "E-mail",
    locationLabel: "Localisation",
    preferredLabel: "Préféré",
    preferredValue: "E-mail ou LinkedIn",
    socialLabel: "Réseaux",
    bookACall: "Prendre contact",
    copyEmail: "Copier l'e-mail",
    copied: "Copié",
  },
};
