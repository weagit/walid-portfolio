"use client";

/**
 * Tiny i18n layer for the portfolio.
 *
 * Each data file in `src/data/` exports a `*Content` object shaped as
 * `{ en: { ... }, fr: { ... } }`. Components call `useLocale()` and pick
 * the active locale's branch, e.g. `aboutContent[locale]`.
 *
 * The active locale is stored in localStorage and on first visit is
 * inferred from `navigator.language` (FR-* visitors see French).
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "en" | "fr";

const STORAGE_KEY = "wea-locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Default to English on first paint to avoid hydration mismatch.
  // We swap to the user's preference after mount.
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as
      | Locale
      | null;
    if (stored === "en" || stored === "fr") {
      setLocaleState(stored);
      return;
    }
    if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("fr")) {
      setLocaleState("fr");
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  const ctx = useContext(LocaleContext);
  return ctx?.locale ?? "en";
}

export function useSetLocale() {
  const ctx = useContext(LocaleContext);
  return ctx?.setLocale ?? (() => {});
}
