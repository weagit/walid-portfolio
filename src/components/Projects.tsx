"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, projectsChapter, type Project } from "@/data/projects";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import ProjectModal from "./ProjectModal";
import ProjectTexture from "./ProjectTexture";

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      id="projects"
      className="relative min-h-screen w-full py-32 md:py-40 px-8 md:px-16"
    >
      <motion.div
        variants={stagger(0.2, 0.14)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Chapter marker */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
          <span className="font-[family-name:var(--font-display)] text-accent text-base tracking-[0.3em]">
            {projectsChapter.chapter}
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
          className="font-[family-name:var(--font-serif)] italic text-heading text-4xl md:text-5xl lg:text-6xl leading-[1.15] max-w-3xl"
        >
          {projectsChapter.title}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-muted text-base md:text-lg max-w-xl"
        >
          {projectsChapter.sub}
        </motion.p>

        {/* Fanned choice cards */}
        <motion.div
          variants={fadeUp}
          className="mt-20 md:mt-28 flex flex-col md:flex-row md:justify-center md:items-end gap-6 md:gap-0 md:-space-x-12 lg:-space-x-16 perspective-[1200px]"
          onMouseLeave={() => setHovered(null)}
        >
          {projects.map((p, i) => (
            <ChoiceCard
              key={p.id}
              project={p}
              index={i}
              total={projects.length}
              isHovered={hovered === p.id}
              anyHovered={hovered !== null}
              onHover={() => setHovered(p.id)}
              onOpen={() => setActive(p)}
            />
          ))}
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-16 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-text/80"
        >
          Pick a chapter · click a card to step inside
        </motion.p>
      </motion.div>

      <AnimatePresence>
        {active && (
          <ProjectModal project={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ChoiceCard({
  project,
  index,
  total,
  isHovered,
  anyHovered,
  onHover,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  isHovered: boolean;
  anyHovered: boolean;
  onHover: () => void;
  onOpen: () => void;
}) {
  // Fanned tilt — middle card at 0, outer cards tilted outward
  const center = (total - 1) / 2;
  const offset = index - center;
  const baseTilt = offset * 6; // degrees
  const baseY = Math.abs(offset) * 12; // lower the outer cards a bit
  const baseZ = total - Math.abs(offset); // middle card on top

  return (
    <motion.button
      onClick={onOpen}
      onMouseEnter={onHover}
      onFocus={onHover}
      initial={false}
      animate={{
        rotate: isHovered ? 0 : baseTilt,
        y: isHovered ? -24 : baseY,
        scale: isHovered ? 1.06 : anyHovered ? 0.96 : 1,
        opacity: anyHovered && !isHovered ? 0.65 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        zIndex: isHovered ? 10 : baseZ,
        transformStyle: "preserve-3d",
      }}
      className="group relative w-full md:w-[320px] lg:w-[360px] aspect-[3/4] text-left shrink-0 cursor-pointer"
    >
      {/* Card body */}
      <div
        className="relative w-full h-full overflow-hidden border border-border-strong shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
        style={{ background: project.mood.backdrop }}
      >
        {/* Texture */}
        <div className="absolute inset-0 opacity-90">
          <ProjectTexture mood={project.mood} />
        </div>

        {/* Grain */}
        <div className="grain absolute inset-0 opacity-60" aria-hidden />

        {/* Accent corner ticks */}
        <span
          className="absolute top-3 left-3 w-3 h-3 border-t border-l"
          style={{ borderColor: project.mood.accent }}
        />
        <span
          className="absolute top-3 right-3 w-3 h-3 border-t border-r"
          style={{ borderColor: project.mood.accent }}
        />
        <span
          className="absolute bottom-3 left-3 w-3 h-3 border-b border-l"
          style={{ borderColor: project.mood.accent }}
        />
        <span
          className="absolute bottom-3 right-3 w-3 h-3 border-b border-r"
          style={{ borderColor: project.mood.accent }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-7 md:p-8">
          {/* Top: index + mood label */}
          <div>
            <div
              className="font-[family-name:var(--font-display)] text-6xl md:text-7xl leading-none"
              style={{ color: project.mood.accent, opacity: 0.95 }}
            >
              {project.index}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.4em]"
                style={{ color: project.mood.accent }}
              >
                {project.mood.label}
              </span>
              <span
                className="h-px w-8"
                style={{ backgroundColor: project.mood.accent, opacity: 0.5 }}
              />
            </div>
          </div>

          {/* Bottom: title + tagline + open */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-heading text-3xl md:text-[2rem] leading-[1.05] tracking-[0.01em]">
              {project.title}
            </h3>
            <p className="mt-3 font-[family-name:var(--font-serif)] italic text-text/90 text-base md:text-lg leading-snug">
              {project.tagline}
            </p>

            {/* Open cue — slides in on hover */}
            <motion.div
              className="mt-6 flex items-center gap-3 font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase overflow-hidden"
              style={{ color: project.mood.accent }}
            >
              <motion.span
                animate={{ x: isHovered ? 0 : -6, opacity: isHovered ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
              >
                Step inside
              </motion.span>
              <motion.span
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                →
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Vignette for depth */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </div>
    </motion.button>
  );
}
