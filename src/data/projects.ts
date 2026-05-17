/**
 * Projects — Chapter III. Each project has its own "mood" that takes over
 * the background when the visitor opens the card. EN + Belgian FR.
 *
 * Locale-neutral fields: id, index, year, stack, links, gallery, schema, mood.
 * Locale-specific: title, tagline, role, summary, highlights.
 */

export type Mood = {
  label: string;
  accent: string;
  backdrop: string;
  texture: "arena" | "graph" | "organic";
};

type ProjectI18n = {
  title: string;
  tagline: string;
  role: string;
  summary: string;
  highlights: readonly string[];
  moodLabel: string; // localized version of mood.label
};

export type Project = {
  id: string;
  index: string;
  year: string;
  stack: readonly string[];
  links: readonly { label: string; href: string }[];
  preview?: string;
  tileFocus?: "top" | "center" | "bottom";
  fallbackTile?: "architecture" | "arena" | "fresh";
  gallery?: readonly string[];
  galleryAspect?: "portrait" | "landscape";
  schema?: {
    services: readonly {
      name: string;
      port: string;
      tables: readonly string[];
      endpoints: number;
    }[];
    db: string;
    restCalls: readonly string[];
  };
  mood: Mood;
  i18n: { en: ProjectI18n; fr: ProjectI18n };
};

export const projects: readonly Project[] = [
  {
    id: "loswakers",
    index: "01",
    year: "2025",
    stack: [".NET 8", "C#", "EF Core", "JWT", "SignalR", "REST", "HTML/CSS/JS"],
    links: [{ label: "GitHub", href: "https://github.com/weagit/LosWakers" }],
    preview: "/images/loswakers/image.png",
    tileFocus: "center",
    gallery: [
      "/images/loswakers/image.png",
      "/images/loswakers/image1.png",
      "/images/loswakers/image3.png",
      "/images/loswakers/image4.png",
      "/images/loswakers/image5.png",
      "/images/loswakers/image6.png",
      "/images/loswakers/image7.png",
      "/images/loswakers/image8.png",
      "/images/loswakers/image10.png",
      "/images/loswakers/image99.png",
    ],
    galleryAspect: "landscape",
    mood: {
      label: "Arena",
      accent: "#F2C94C",
      backdrop:
        "radial-gradient(ellipse 60% 50% at 30% 25%, rgba(139,92,246,0.22) 0%, rgba(10,10,10,0) 60%), radial-gradient(ellipse 55% 45% at 75% 75%, rgba(242,201,76,0.18) 0%, rgba(10,10,10,0) 55%), linear-gradient(to bottom, #0A0614 0%, #140B1F 100%)",
      texture: "arena",
    },
    i18n: {
      en: {
        title: "LosWakers",
        tagline: "Real-time ticketing for a basketball club.",
        role: "Solo — full-stack",
        moodLabel: "Arena",
        summary:
          "A full-stack arena ticketing platform. Interactive seat map, live seat-locking across clients via SignalR, JWT auth with three roles, mock payment flow, and PDF + QR ticket generation.",
        highlights: [
          "Interactive stadium map with live seat states (free / held / paid)",
          "SignalR broadcasts seat locks so two clients never book the same seat",
          "JWT auth — Admin, Organizer, Client — scoped CRUD on events & venues",
          "Mock payment gateway → PDF ticket + QR code generated on confirm",
          "Organizer dashboard with live fill-rate & simulated revenue",
        ],
      },
      fr: {
        title: "LosWakers",
        tagline: "Billetterie en temps réel pour un club de basket.",
        role: "Solo — full-stack",
        moodLabel: "Arène",
        summary:
          "Plateforme de billetterie d'arène full-stack. Plan de salle interactif, verrouillage des sièges en temps réel entre clients via SignalR, authentification JWT à trois rôles, paiement simulé, génération de billets PDF + QR.",
        highlights: [
          "Plan du stade interactif avec l'état des sièges en direct (libre / réservé / payé)",
          "SignalR diffuse les verrous de sièges — deux clients ne peuvent jamais réserver la même place",
          "Authentification JWT — Admin, Organisateur, Client — CRUD limité aux événements et aux lieux",
          "Passerelle de paiement simulée → génération d'un billet PDF + QR code à la confirmation",
          "Tableau de bord organisateur avec taux de remplissage et revenus simulés en direct",
        ],
      },
    },
  },
  {
    id: "boutique-microservices",
    index: "02",
    year: "2025",
    stack: [
      "Java 17",
      "Spring Boot 3.4",
      "Spring Data JPA",
      "PostgreSQL 17",
      "Maven",
      "JUnit 5",
      "Mockito",
      "Lombok",
    ],
    links: [],
    fallbackTile: "architecture",
    schema: {
      services: [
        {
          name: "Product-Service",
          port: "8080",
          tables: ["categories", "products"],
          endpoints: 11,
        },
        {
          name: "Order-Service",
          port: "8081",
          tables: ["orders", "order_lines"],
          endpoints: 8,
        },
      ],
      db: "product_service_db · PostgreSQL 17",
      restCalls: [
        "GET /api/products/{id}",
        "GET /api/products/{id}/check-stock",
        "POST /api/products/{id}/decrease-stock",
        "POST /api/products/{id}/increase-stock",
      ],
    },
    mood: {
      label: "Architecture",
      accent: "#A3B8C9",
      backdrop:
        "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(163,184,201,0.14) 0%, rgba(10,10,10,0) 60%), linear-gradient(to bottom, #08090B 0%, #101418 100%)",
      texture: "graph",
    },
    i18n: {
      en: {
        title: "Boutique Microservices",
        tagline: "An e-commerce backend, split into two Spring Boot services.",
        role: "Solo — backend",
        moodLabel: "Architecture",
        summary:
          "Backend-only e-commerce decomposed into Product-Service (8080) and Order-Service (8081). They share a PostgreSQL instance but stay independent — Order-Service calls Product-Service over REST for stock checks and atomic stock adjustments. No UI on purpose: the architecture is the product.",
        highlights: [
          "Strict layered architecture — Controller → DTO → Service → DAO → Repository → Entity",
          "Synchronous REST via RestTemplate; Order-Service never touches product tables directly",
          "Atomic stock ops with @Modifying queries — UPDATE ... WHERE stock >= :qty prevents race conditions",
          "unit_price stored on order lines → historical pricing preserved if product prices change",
          "Order status lifecycle: PENDING → VALIDATED → SHIPPED → DELIVERED (or CANCELLED)",
          "78 tests total — @WebMvcTest controllers, Mockito services, RestTemplate integration tests",
          "Global @RestControllerAdvice → consistent JSON error envelopes",
        ],
      },
      fr: {
        title: "Boutique Microservices",
        tagline: "Un back-end e-commerce, découpé en deux services Spring Boot.",
        role: "Solo — backend",
        moodLabel: "Architecture",
        summary:
          "E-commerce purement back-end, découpé en Product-Service (8080) et Order-Service (8081). Ils partagent une instance PostgreSQL tout en restant indépendants — Order-Service appelle Product-Service en REST pour vérifier le stock et l'ajuster de façon atomique. Pas d'UI, c'est volontaire : l'architecture est le produit.",
        highlights: [
          "Architecture en couches strictes — Controller → DTO → Service → DAO → Repository → Entity",
          "REST synchrone via RestTemplate — Order-Service ne touche jamais directement aux tables produits",
          "Opérations de stock atomiques avec @Modifying — UPDATE ... WHERE stock >= :qty évite les race conditions",
          "unit_price stocké sur chaque ligne de commande → la tarification reste historique même si le prix change",
          "Cycle de vie d'une commande : PENDING → VALIDATED → SHIPPED → DELIVERED (ou CANCELLED)",
          "78 tests au total — controllers en @WebMvcTest, services en Mockito, intégration RestTemplate",
          "@RestControllerAdvice global → enveloppes d'erreur JSON cohérentes partout",
        ],
      },
    },
  },
  {
    id: "nutrisnap",
    index: "03",
    year: "2025",
    stack: ["React Native", "Expo", "TypeScript", "Groq AI", "Node"],
    links: [],
    preview: "/images/nutrisnap/IMG_4370.png",
    tileFocus: "top",
    gallery: [
      "/images/nutrisnap/IMG_4370.png",
      "/images/nutrisnap/IMG_4372.png",
      "/images/nutrisnap/IMG_4373.png",
      "/images/nutrisnap/IMG_4374.png",
      "/images/nutrisnap/IMG_4375.png",
      "/images/nutrisnap/IMG_4376.png",
      "/images/nutrisnap/IMG_4384.png",
    ],
    galleryAspect: "portrait",
    mood: {
      label: "Fresh",
      accent: "#7EC8E3",
      backdrop:
        "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(126,200,227,0.20) 0%, rgba(10,10,10,0) 60%), radial-gradient(ellipse 50% 40% at 50% 80%, rgba(180,240,220,0.10) 0%, rgba(10,10,10,0) 55%), linear-gradient(to bottom, #060D12 0%, #0A151A 100%)",
      texture: "organic",
    },
    i18n: {
      en: {
        title: "NutriSnap",
        tagline: "Snap a meal. Read its nutrition.",
        role: "Solo — mobile + AI",
        moodLabel: "Fresh",
        summary:
          "A mobile app that turns a photo of a meal into a nutrition breakdown. Capture, send to a vision model, parse structured macros back, store history. Built cross-platform with React Native + Expo.",
        highlights: [
          "Camera capture → AI vision call → structured macros in under 3 seconds",
          "Groq-hosted vision model for low-latency inference",
          "Persistent meal history with per-day macro totals",
          "Clean RN + Expo setup, TypeScript throughout",
          "Full demo video + architecture diagram in the report",
        ],
      },
      fr: {
        title: "NutriSnap",
        tagline: "Prenez votre repas en photo. Lisez sa valeur nutritionnelle.",
        role: "Solo — mobile + IA",
        moodLabel: "Frais",
        summary:
          "Une application mobile qui transforme la photo d'un repas en analyse nutritionnelle. On capture, on envoie à un modèle de vision, on parse des macros structurées, on garde l'historique. Cross-plateforme avec React Native + Expo.",
        highlights: [
          "Capture caméra → appel vision IA → macros structurées en moins de 3 secondes",
          "Modèle de vision hébergé sur Groq pour une inférence à faible latence",
          "Historique persistant des repas avec totaux journaliers par macro",
          "Setup propre RN + Expo, TypeScript de bout en bout",
          "Démo vidéo complète + schéma d'architecture dans le rapport",
        ],
      },
    },
  },
] as const;

type ProjectsChapter = {
  chapter: string;
  title: string;
  sub: string;
  // UI strings used inside the modal/picker
  pickHint: string;
  yearLabel: string;
  roleLabel: string;
  stackLabel: string;
  galleryLabel: string;
  closeLabel: string;
  stepInside: string;
  galleryHint: string;
  endOfStory?: string;
};

export const projectsChapterContent: { en: ProjectsChapter; fr: ProjectsChapter } = {
  en: {
    chapter: "III.",
    title: "Selected work",
    sub: "Three chapters. Click one to step inside.",
    pickHint: "Pick a chapter · click a card to step inside",
    yearLabel: "Year",
    roleLabel: "Role",
    stackLabel: "Stack",
    galleryLabel: "Gallery",
    closeLabel: "Close",
    stepInside: "Step inside",
    galleryHint: "Click any image to zoom · drag to scroll · hover pauses",
  },
  fr: {
    chapter: "III.",
    title: "Travaux sélectionnés",
    sub: "Trois chapitres. Sélectionnez-en un pour y entrer.",
    pickHint: "Sélectionnez un chapitre · cliquez une carte pour y entrer",
    yearLabel: "Année",
    roleLabel: "Rôle",
    stackLabel: "Stack",
    galleryLabel: "Galerie",
    closeLabel: "Fermer",
    stepInside: "Entrer",
    galleryHint: "Cliquez une image pour l'agrandir · glissez pour faire défiler · le survol met en pause",
  },
};
