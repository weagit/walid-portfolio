"use client";

import { motion } from "motion/react";
import {
  toolkit,
  toolkitLanguages,
  toolkitChapter,
  type ToolGroup,
} from "@/data/toolkit";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export default function Toolkit() {
  return (
    <section
      id="toolkit"
      className="relative min-h-screen w-full py-32 md:py-40 px-8 md:px-16"
    >
      <motion.div
        variants={stagger(0.18, 0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative z-10 max-w-6xl mx-auto"
      >
        {/* Chapter marker */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
          <span className="font-[family-name:var(--font-display)] text-accent text-base tracking-[0.3em]">
            {toolkitChapter.chapter}
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
          className="font-[family-name:var(--font-serif)] italic text-heading text-4xl md:text-5xl lg:text-6xl leading-[1.15]"
        >
          {toolkitChapter.title}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-muted text-base md:text-lg max-w-xl"
        >
          {toolkitChapter.sub}
        </motion.p>

        {/* Two columns */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 relative">
          {/* Vertical divider on desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"
          />

          {toolkit.map((group, i) => (
            <ToolColumn key={group.id} group={group} rightAligned={i === 1} />
          ))}
        </div>

        {/* Languages row */}
        <motion.div
          variants={fadeUp}
          className="mt-20 pt-10 border-t border-border"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
            Languages
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {toolkitLanguages.map((l) => (
              <div
                key={l.name}
                className="flex flex-col"
              >
                <span className="font-[family-name:var(--font-serif)] text-accent-hover text-xl md:text-2xl">
                  {l.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mt-1">
                  {l.level}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ToolColumn({
  group,
  rightAligned,
}: {
  group: ToolGroup;
  rightAligned: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={rightAligned ? "md:pl-12 lg:pl-16" : "md:pr-12 lg:pr-16"}
    >
      <div className="flex items-center gap-4 mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
          {group.id === "build" ? "I." : "II."}
        </span>
        <h3 className="font-[family-name:var(--font-display)] text-heading text-3xl md:text-4xl tracking-[0.02em]">
          {group.label}
        </h3>
      </div>
      <p className="font-[family-name:var(--font-serif)] italic text-text/85 text-lg mb-8 max-w-md">
        {group.lead}
      </p>

      <ul className="space-y-3">
        {group.items.map((item) => (
          <li
            key={item.name}
            className="flex items-baseline gap-3 group"
          >
            <span
              aria-hidden
              className="shrink-0 w-1 h-1 rounded-full bg-border-strong group-hover:bg-accent transition-colors mt-2"
            />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-heading text-base md:text-lg">
                {item.name}
              </span>
              {item.note && (
                <span className="font-mono text-[11px] text-muted">
                  — {item.note}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
