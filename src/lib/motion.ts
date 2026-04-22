/**
 * Centralized animation variants.
 * All components import from here — no copy-pasted motion configs.
 */

import type { Variants, Transition } from "motion/react";

// Easing — slow, elegant, classical
export const ease = [0.22, 1, 0.36, 1] as const;

// Basic transitions
export const transitions = {
  soft: { duration: 0.8, ease } as Transition,
  slow: { duration: 1.2, ease } as Transition,
  quick: { duration: 0.4, ease } as Transition,
};

// Reveal variants
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: transitions.soft },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transitions.soft },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: transitions.slow },
};

// Stagger parent — children reveal in sequence
export const stagger = (delayChildren = 0.15, staggerChildren = 0.1): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren, staggerChildren },
  },
});

// Used on scroll reveals: `whileInView={ "show" } initial="hidden" viewport={{ once: true, margin: "-100px" }}`
export const viewportOnce = { once: true, margin: "-100px" } as const;
