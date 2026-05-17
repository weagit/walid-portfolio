"use client";

/**
 * Floating pill navigation — fixed at the top, centered, with a soft glass
 * pill body and an animated accent dot marking the active chapter.
 *
 * Inspired by the floating dock-style nav from oscarhernandez.vercel.app.
 * Adapted to the portfolio's monochrome steel theme: the active accent dot
 * picks up our accent color, hover glow uses the same.
 *
 * Active chapter is detected with IntersectionObserver — the visible section
 * stays highlighted as the user scrolls. Smooth-scrolls on click.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocale, useSetLocale, type Locale } from "@/lib/i18n";

type Item = { id: string; en: string; fr: string };

const items: readonly Item[] = [
  { id: "hero", en: "Home", fr: "Accueil" },
  { id: "about", en: "About", fr: "À propos" },
  { id: "projects", en: "Projects", fr: "Projets" },
  { id: "journey", en: "Journey", fr: "Parcours" },
  { id: "toolkit", en: "Toolkit", fr: "Outils" },
  { id: "contact", en: "Contact", fr: "Contact" },
];

export default function PillNav() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const [active, setActive] = useState<string>("hero");
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  // Track active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visible.set(id, entry.intersectionRatio);
            } else {
              visible.delete(id);
            }
          });
          // Pick the most-visible section as active
          let best: { id: string; ratio: number } | null = null;
          visible.forEach((ratio, sectionId) => {
            if (!best || ratio > best.ratio) best = { id: sectionId, ratio };
          });
          if (best) setActive((best as { id: string; ratio: number }).id);
        },
        { threshold: [0.2, 0.4, 0.6, 0.8] }
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < 80) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  const onClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.nav
          aria-label="Primary"
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -32, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-2"
        >
          <ul
            className="flex items-center gap-1 px-2 py-2 rounded-full border border-border-strong bg-bg/70 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
            style={{ ["--ring" as string]: "var(--color-accent-hover)" }}
          >
            {items.map((it) => {
              const id = it.id;
              const label = locale === "fr" ? it.fr : it.en;
              const isActive = active === id;
              return (
                <li key={id} className="relative">
                  <a
                    href={`#${id}`}
                    onClick={onClick(id)}
                    className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] tracking-[0.05em] font-[family-name:var(--font-display)] transition-colors duration-300 ${
                      isActive
                        ? "text-heading"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="pill-active"
                        className="absolute inset-0 rounded-full border border-border-strong bg-surface-elevated/80"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {isActive && (
                      <motion.span
                        aria-hidden
                        layout
                        className="relative z-[1] w-1.5 h-1.5 rounded-full bg-accent-hover shadow-[0_0_8px_2px_rgba(255,255,255,0.35)]"
                      />
                    )}
                    <span className="relative z-[1]">{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Locale toggle */}
          <div
            className="flex items-center gap-0.5 px-1 py-1 rounded-full border border-border-strong bg-bg/70 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
            role="group"
            aria-label="Language"
          >
            {(["en", "fr"] as const).map((l) => (
              <LocalePill
                key={l}
                value={l}
                active={locale === l}
                onClick={() => setLocale(l)}
              />
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function LocalePill({
  value,
  active,
  onClick,
}: {
  value: Locale;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative px-2.5 py-1 rounded-full text-[11px] tracking-[0.15em] font-mono uppercase transition-colors ${
        active ? "text-heading" : "text-muted hover:text-text"
      }`}
    >
      {active && (
        <motion.span
          layoutId="locale-active"
          className="absolute inset-0 rounded-full border border-border-strong bg-surface-elevated/80"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <span className="relative z-[1]">{value}</span>
    </button>
  );
}
