"use client";

import { motion } from "motion/react";
import { journey, journeyChapter, type JourneyEntry } from "@/data/journey";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const tagColor: Record<JourneyEntry["tag"], string> = {
  experience: "var(--color-accent)",
  education: "var(--color-accent-hover)",
  competition: "var(--color-accent)",
};

export default function Journey() {
  return (
    <section
      id="journey"
      className="relative min-h-screen w-full py-32 md:py-40 px-8 md:px-16"
    >
      <motion.div
        variants={stagger(0.18, 0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative z-10 max-w-5xl mx-auto"
      >
        {/* Chapter marker */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
          <span className="font-[family-name:var(--font-display)] text-accent text-base tracking-[0.3em]">
            {journeyChapter.chapter}
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
          {journeyChapter.title}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-muted text-base md:text-lg max-w-xl"
        >
          {journeyChapter.sub}
        </motion.p>

        {/* Timeline */}
        <div className="mt-20 relative">
          {/* Vertical spine */}
          <div
            aria-hidden
            className="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-px bg-border"
          />

          <div className="space-y-16 md:space-y-20">
            {journey.map((e) => (
              <TimelineItem key={e.id} entry={e} />
            ))}
          </div>
        </div>

        {/* Forward-looking closing */}
        <motion.p
          variants={fadeUp}
          className="mt-24 font-[family-name:var(--font-serif)] italic text-heading/90 text-xl md:text-2xl leading-[1.4] max-w-2xl border-l-2 border-accent pl-6"
        >
          {journeyChapter.closing}
        </motion.p>
      </motion.div>
    </section>
  );
}

function TimelineItem({ entry }: { entry: JourneyEntry }) {
  const color = tagColor[entry.tag];
  return (
    <motion.div variants={fadeUp} className="relative pl-10 md:pl-14">
      {/* Dot */}
      <span
        aria-hidden
        className="absolute left-0 top-2 w-[15px] h-[15px] md:w-[23px] md:h-[23px] rounded-full border-2 bg-bg"
        style={{ borderColor: `color-mix(in srgb, ${color} 70%, transparent)` }}
      >
        <span
          className="absolute inset-[3px] rounded-full"
          style={{ backgroundColor: color, opacity: 0.9 }}
        />
      </span>

      {/* Header row */}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.4em]"
          style={{ color }}
        >
          {entry.kind}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          {entry.period}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          · {entry.location}
        </span>
      </div>

      {/* Org + role */}
      <h3 className="font-[family-name:var(--font-display)] text-heading text-2xl md:text-3xl leading-[1.1] tracking-[0.01em]">
        {entry.org}
      </h3>
      <div className="mt-1 text-text/80 text-base md:text-lg">{entry.role}</div>

      {/* Lead */}
      <p className="mt-4 font-[family-name:var(--font-serif)] italic text-text text-lg md:text-xl leading-[1.45] max-w-2xl">
        {entry.lead}
      </p>

      {/* Points */}
      {entry.points.length > 0 && (
        <ul className="mt-5 space-y-2.5 max-w-2xl">
          {entry.points.map((p, i) => (
            <li key={i} className="flex gap-3 text-text text-base leading-relaxed">
              <span
                className="font-mono text-xs pt-1.5 shrink-0 opacity-70"
                style={{ color }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Meta chips */}
      {entry.meta && entry.meta.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {entry.meta.map((m) => (
            <span
              key={m}
              className="px-2.5 py-1 text-[11px] font-mono border border-border text-muted"
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
