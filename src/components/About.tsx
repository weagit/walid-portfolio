"use client";

import { motion } from "motion/react";
import { about } from "@/data/about";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import ScrollRevealText from "./ScrollRevealText";

export default function About() {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full overflow-hidden flex items-center"
    >
      {/* Same vignette for readability — statue shines through from StatueLayer */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 60% 50%, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0) 72%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 md:hidden pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.9) 100%)",
        }}
      />

      {/* Content — right side on desktop, full width on mobile */}
      <motion.div
        variants={stagger(0.2, 0.16)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative z-10 flex flex-col px-8 md:pl-0 md:ml-[40%] lg:ml-[38%] max-w-2xl py-24 md:py-0"
      >
        {/* Chapter marker — line draws in */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-4 mb-10"
        >
          <span className="font-[family-name:var(--font-display)] text-accent text-base tracking-[0.3em]">
            {about.chapter}
          </span>
          <motion.span
            className="h-px w-20 bg-border-strong origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </motion.div>

        {/* Lead line — italic serif */}
        <motion.p
          variants={fadeUp}
          className="font-[family-name:var(--font-serif)] italic text-heading text-2xl md:text-3xl lg:text-4xl leading-[1.3]"
        >
          {about.lead}
        </motion.p>

        {/* Body paragraphs — scroll-linked word reveal */}
        <div className="mt-10 space-y-6 text-text text-base md:text-lg leading-relaxed max-w-xl">
          {about.paragraphs.map((p, i) => (
            <ScrollRevealText key={i} text={p} highlight={about.keywords} />
          ))}
        </div>

        {/* Languages — small caps row */}
        <motion.div
          variants={fadeUp}
          className="mt-12 pt-8 border-t border-border max-w-xl"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
            Languages spoken
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--font-serif)] text-accent-hover text-lg">
            {about.languages.map((lang, i) => (
              <span key={lang} className="flex items-center gap-6">
                {lang}
                {i < about.languages.length - 1 && (
                  <span aria-hidden className="text-muted">·</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
