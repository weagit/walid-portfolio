"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import type { Project } from "@/data/projects";
import ProjectTexture from "./ProjectTexture";
import ProjectGallery from "./ProjectGallery";
import MicroservicesSchema from "./MicroservicesSchema";

/**
 * Full-viewport takeover for a project. The backdrop, accent, and animated
 * texture all shift to match the project's mood.
 */

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { mood } = project;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: mood.backdrop }}
    >
      <ProjectTexture mood={mood} />

      {/* Grain to match site */}
      <div className="grain absolute inset-0 pointer-events-none" aria-hidden />

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close project"
        className="fixed top-6 right-6 md:top-10 md:right-10 z-10 font-[family-name:var(--font-display)] tracking-[0.3em] text-xs uppercase text-muted hover:text-heading transition-colors flex items-center gap-3 group"
      >
        <span>Close</span>
        <span className="h-px w-8 bg-border-strong group-hover:w-12 transition-all" />
        <span className="text-lg leading-none">×</span>
      </button>

      {/* Content */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[5] max-w-5xl mx-auto px-8 md:px-16 py-24 md:py-32"
      >
        {/* Mood label + index */}
        <div className="flex items-center gap-4 mb-8">
          <span
            className="font-[family-name:var(--font-display)] text-xs tracking-[0.4em] uppercase"
            style={{ color: mood.accent }}
          >
            {project.index} · {mood.label}
          </span>
          <span
            className="h-px w-20"
            style={{ backgroundColor: mood.accent, opacity: 0.4 }}
          />
        </div>

        {/* Title */}
        <h2 className="font-[family-name:var(--font-display)] text-heading text-5xl md:text-7xl leading-[1] tracking-[0.01em]">
          {project.title}
        </h2>

        {/* Tagline */}
        <p className="mt-6 font-[family-name:var(--font-serif)] italic text-2xl md:text-3xl text-heading/90 max-w-2xl leading-[1.35]">
          {project.tagline}
        </p>

        {/* Meta row */}
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          <div>
            <span className="opacity-60">Year · </span>
            <span className="text-text">{project.year}</span>
          </div>
          <div>
            <span className="opacity-60">Role · </span>
            <span className="text-text">{project.role}</span>
          </div>
        </div>

        {/* Summary */}
        <p className="mt-10 text-text text-base md:text-lg leading-relaxed max-w-2xl">
          {project.summary}
        </p>

        {/* Highlights */}
        <ul className="mt-12 space-y-4 max-w-2xl">
          {project.highlights.map((h, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
              className="flex gap-4 text-text leading-relaxed"
            >
              <span
                className="font-mono text-xs pt-1.5 shrink-0"
                style={{ color: mood.accent }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{h}</span>
            </motion.li>
          ))}
        </ul>

        {/* Stack */}
        <div className="mt-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
            Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 text-xs font-mono border border-border text-text hover:border-[color:var(--mood-accent)] transition-colors"
                style={{ ["--mood-accent" as string]: mood.accent }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Gallery — horizontal auto-drifting carousel, click to zoom */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-16">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
              Gallery
            </div>
            <ProjectGallery
              images={project.gallery}
              aspect={project.galleryAspect ?? "landscape"}
              accent={mood.accent}
              title={project.title}
            />
          </div>
        )}

        {/* Architecture schema — for backend-only projects */}
        {project.schema && (
          <MicroservicesSchema schema={project.schema} accent={mood.accent} />
        )}

        {/* Links */}
        {project.links.length > 0 && (
          <div className="mt-14 flex flex-wrap gap-4">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 px-5 py-3 border text-sm font-[family-name:var(--font-display)] tracking-[0.2em] uppercase transition-all"
                style={{
                  borderColor: mood.accent,
                  color: mood.accent,
                }}
              >
                <span>{l.label}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
