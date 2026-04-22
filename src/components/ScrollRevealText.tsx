"use client";

import { motion, type Variants } from "motion/react";
import { viewportOnce } from "@/lib/motion";

/**
 * Word-by-word reveal — paragraph enters view, words fade in sequentially
 * like an inscription being carved. Keywords get a hover accent underline.
 */

type Props = {
  text: string;
  highlight?: readonly string[];
  className?: string;
};

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerVariant: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export default function ScrollRevealText({ text, highlight = [], className }: Props) {
  const words = text.split(/(\s+)/);

  return (
    <motion.p
      className={className}
      variants={containerVariant}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {words.map((chunk, i) => {
        if (chunk.trim().length === 0) return <span key={i}>{chunk}</span>;

        const isHighlight = highlight.some(
          (kw) => chunk.toLowerCase().replace(/[.,/]/g, "") === kw.toLowerCase()
        );

        if (isHighlight) {
          return (
            <motion.span
              key={i}
              variants={wordVariant}
              className="relative inline-block text-heading transition-colors duration-300 hover:text-accent cursor-default group"
            >
              {chunk}
              <span
                aria-hidden
                className="absolute left-0 right-0 -bottom-0.5 h-px bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              />
            </motion.span>
          );
        }

        return (
          <motion.span key={i} variants={wordVariant} className="inline-block">
            {chunk}
          </motion.span>
        );
      })}
    </motion.p>
  );
}
