"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  images: readonly string[];
  index: number | null;
  accent: string;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

export default function Lightbox({ images, index, onClose, onIndexChange, accent }: Props) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onIndexChange]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/92 backdrop-blur-sm p-4 md:p-10"
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 z-10 font-[family-name:var(--font-display)] tracking-[0.3em] text-xs uppercase text-muted hover:text-heading transition-colors flex items-center gap-2"
          >
            Close <span className="text-lg">×</span>
          </button>

          {/* Counter */}
          <div
            className="absolute top-6 left-6 z-10 font-mono text-xs tracking-[0.3em]"
            style={{ color: accent }}
          >
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
            className="absolute left-2 md:left-8 z-10 w-12 h-12 flex items-center justify-center text-2xl text-muted hover:text-heading hover:scale-110 transition-all"
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % images.length);
            }}
            aria-label="Next image"
            className="absolute right-2 md:right-8 z-10 w-12 h-12 flex items-center justify-center text-2xl text-muted hover:text-heading hover:scale-110 transition-all"
          >
            ›
          </button>

          {/* Image */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-w-6xl max-h-[85vh]"
          >
            <Image
              src={images[index]}
              alt={`Image ${index + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
