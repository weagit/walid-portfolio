# Walid El Aidouni El Idrissi — Portfolio

Personal portfolio site. Six-chapter scroll narrative covering background,
projects, experience and toolkit.

**Live:** https://walid-portfolio-nu.vercel.app

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4 (CSS-first `@theme`)
- Motion for animation
- next/font — Cinzel, Cormorant Garamond, Geist, Geist Mono

## Structure

```
src/
├── app/          # Routes, layout, global styles
├── components/   # Section components + shared UI
├── data/         # Centralized content (profile, projects, journey, toolkit)
└── lib/          # Motion variants, helpers
```

All content is centralized in `src/data/` — no prose scattered across
components. Edit a single file to update a chapter.

## Local development

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # production build
npm run start       # serve built output
```

---

© 2026 Walid El Aidouni El Idrissi. All rights reserved.
