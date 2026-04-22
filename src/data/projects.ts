/**
 * Projects — Chapter III. Each project has its own "mood" that takes over
 * the background when the visitor opens the card. Everything lives here so
 * Walid can edit prose/order without touching components.
 */

export type Mood = {
  label: string;
  accent: string; // hex — drives accent color inside the modal
  backdrop: string; // CSS background for the takeover layer
  texture: "arena" | "graph" | "organic"; // dynamic SVG layer to render
};

export type Project = {
  id: string;
  index: string; // "01", "02", "03"
  title: string;
  tagline: string;
  year: string;
  role: string;
  stack: readonly string[];
  summary: string;
  highlights: readonly string[];
  links: readonly { label: string; href: string }[];
  preview?: string; // hero image path
  gallery?: readonly string[];
  galleryAspect?: "portrait" | "landscape"; // screenshot orientation
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
};

export const projects: readonly Project[] = [
  {
    id: "loswakers",
    index: "01",
    title: "LosWakers",
    tagline: "Real-time ticketing for a basketball club.",
    year: "2025",
    role: "Solo — full-stack",
    stack: [".NET 8", "C#", "EF Core", "JWT", "SignalR", "REST", "HTML/CSS/JS"],
    summary:
      "A full-stack arena ticketing platform. Interactive seat map, live seat-locking across clients via SignalR, JWT auth with three roles, mock payment flow, and PDF + QR ticket generation.",
    highlights: [
      "Interactive stadium map with live seat states (free / held / paid)",
      "SignalR broadcasts seat locks so two clients never book the same seat",
      "JWT auth — Admin, Organizer, Client — scoped CRUD on events & venues",
      "Mock payment gateway → PDF ticket + QR code generated on confirm",
      "Organizer dashboard with live fill-rate & simulated revenue",
    ],
    links: [{ label: "GitHub", href: "https://github.com/weagit/LosWakers" }],
    preview: "/images/loswakers/image.png",
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
  },
  {
    id: "boutique-microservices",
    index: "02",
    title: "Boutique Microservices",
    tagline: "An e-commerce backend, split into two Spring Boot services.",
    year: "2025",
    role: "Solo — backend",
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
    links: [],
    mood: {
      label: "Architecture",
      accent: "#A3B8C9",
      backdrop:
        "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(163,184,201,0.14) 0%, rgba(10,10,10,0) 60%), linear-gradient(to bottom, #08090B 0%, #101418 100%)",
      texture: "graph",
    },
  },
  {
    id: "nutrisnap",
    index: "03",
    title: "NutriSnap",
    tagline: "Snap a meal. Read its nutrition.",
    year: "2025",
    role: "Solo — mobile + AI",
    stack: ["React Native", "Expo", "TypeScript", "Groq AI", "Node"],
    summary:
      "A mobile app that turns a photo of a meal into a nutrition breakdown. Capture, send to a vision model, parse structured macros back, store history. Built cross-platform with React Native + Expo.",
    highlights: [
      "Camera capture → AI vision call → structured macros in under 3 seconds",
      "Groq-hosted vision model for low-latency inference",
      "Persistent meal history with per-day macro totals",
      "Clean RN + Expo setup, TypeScript throughout",
      "Full demo video + architecture diagram in the report",
    ],
    links: [],
    preview: "/images/nutrisnap/IMG_4370.png",
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
  },
] as const;

export const projectsChapter = {
  chapter: "III.",
  title: "Selected work",
  sub: "Three chapters. Click one to step inside.",
} as const;
