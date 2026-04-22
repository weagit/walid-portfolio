"use client";

import { motion } from "motion/react";
import SocialLinks from "./SocialLinks";
import Particles from "./Particles";
import { profile } from "@/data/profile";
import { fadeUp, stagger } from "@/lib/motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Ambient layers — statue lives in <StatueLayer /> above */}
      <div className="grain absolute inset-0" aria-hidden />
      <Particles count={28} />

      {/* Readability vignette behind content */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 55% at 55% 50%, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      {/* Mobile overlay */}
      <div
        aria-hidden
        className="absolute inset-0 md:hidden pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.85) 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        variants={stagger(0.25, 0.18)}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-8 md:pl-0 md:ml-[40%] lg:ml-[38%] max-w-2xl py-24 md:py-0"
      >
        <motion.h1
          variants={fadeUp}
          className="font-[family-name:var(--font-display)] text-heading font-medium leading-[1] text-[clamp(2rem,6vw,4.5rem)] tracking-[0.02em]"
        >
          {profile.name.short}
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="mt-12 flex items-center gap-5"
        >
          <span className="h-px w-14 bg-border-strong" />
          <span className="font-[family-name:var(--font-display)] text-accent-hover text-lg md:text-xl uppercase tracking-[0.5em]">
            {profile.quote}
          </span>
          <span className="h-px w-14 bg-border-strong" />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-12">
          <SocialLinks delay={0} />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Continue to next chapter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        whileHover={{ scale: 1.08 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-muted hover:text-accent-hover transition-colors"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-[family-name:var(--font-serif)] italic text-base md:text-lg">
            continue
          </span>
          <svg
            width="28"
            height="44"
            viewBox="0 0 28 44"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="1.5" y="1.5" width="25" height="41" rx="12.5" />
            <motion.line
              x1="14"
              y1="10"
              x2="14"
              y2="18"
              strokeLinecap="round"
              strokeWidth="2"
              animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </motion.a>
    </section>
  );
}
