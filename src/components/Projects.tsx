"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, projectsChapter, type Project } from "@/data/projects";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import ProjectModal from "./ProjectModal";
import InfiniteMenu, { type InfiniteMenuItem } from "./InfiniteMenu";

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  // Build the InfiniteMenu items — each project becomes a tile on the sphere.
  // The sphere has many faces, but only project items are clickable; the
  // shader tiles textures by `instanceId % itemCount` so 3 projects fill
  // every face. Clicking the action button opens the existing modal.
  const items: InfiniteMenuItem[] = useMemo(
    () =>
      projects.map((p) => ({
        image: p.preview,
        title: p.title,
        description: p.tagline,
        index: p.index,
        accent: p.mood.accent,
        tileFocus: p.tileFocus ?? "center",
        fallback: p.fallbackTile,
        onSelect: () => setActive(p),
      })),
    []
  );

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

        {/* Infinite-menu sphere — left = info panel, right = spinning sphere */}
        <motion.div
          variants={fadeUp}
          className="mt-12 md:mt-16 w-full h-[520px] md:h-[600px] lg:h-[640px]"
        >
          <InfiniteMenu items={items} scale={3} />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {active && (
          <ProjectModal project={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
