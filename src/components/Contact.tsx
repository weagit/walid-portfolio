"use client";

import { motion } from "motion/react";
import SocialLinks from "./SocialLinks";
import { contactChapter } from "@/data/contact";
import { profile } from "@/data/profile";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex items-center py-32 md:py-40 px-8 md:px-16"
    >
      {/* Readability wash — keeps the closing chapter calm */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <motion.div
        variants={stagger(0.22, 0.16)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative z-10 max-w-3xl mx-auto w-full"
      >
        {/* Chapter marker */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
          <span className="font-[family-name:var(--font-display)] text-accent text-base tracking-[0.3em]">
            {contactChapter.chapter}
          </span>
          <motion.span
            className="h-px w-20 bg-border-strong origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="font-[family-name:var(--font-display)] text-heading text-5xl md:text-6xl lg:text-7xl leading-[1] tracking-[0.02em]"
        >
          {contactChapter.title}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-8 font-[family-name:var(--font-serif)] italic text-heading/90 text-xl md:text-2xl leading-[1.4] max-w-xl"
        >
          {contactChapter.lead}
        </motion.p>

        {/* Link row */}
        <motion.div variants={fadeUp} className="mt-14">
          <SocialLinks delay={0} />
        </motion.div>

        {/* Direct email — plain-text fallback for mail users */}
        <motion.a
          variants={fadeUp}
          href={`mailto:${profile.contact.email}`}
          className="mt-6 inline-block font-mono text-xs tracking-[0.2em] text-muted hover:text-heading transition-colors"
        >
          {profile.contact.email}
        </motion.a>

        {/* Location */}
        <motion.div
          variants={fadeUp}
          className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row md:items-baseline gap-4 md:gap-10"
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-1">
              Based in
            </div>
            <div className="font-[family-name:var(--font-serif)] text-heading text-lg">
              {profile.location}
            </div>
          </div>
        </motion.div>

        {/* Closing line */}
        <motion.p
          variants={fadeUp}
          className="mt-20 font-[family-name:var(--font-serif)] italic text-accent-hover text-lg md:text-xl"
        >
          {contactChapter.closing}
        </motion.p>

        {/* Footer line — signature */}
        <motion.div
          variants={fadeUp}
          className="mt-20 pt-6 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/70"
        >
          <span>
            {profile.name.full} · {new Date().getFullYear()}
          </span>
          <span className="italic normal-case tracking-normal text-[11px] font-[family-name:var(--font-serif)]">
            {profile.quote.toLowerCase()}.
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
