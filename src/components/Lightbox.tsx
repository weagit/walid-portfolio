"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black p-4 md:p-10"
        >
          {/* Close — explicit pill button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
            className="absolute top-5 right-5 z-10 font-[family-name:var(--font-display)] tracking-[0.25em] text-xs uppercase flex items-center gap-3 px-4 py-2.5 md:px-5 md:py-3 border-2 bg-bg/70 backdrop-blur-md transition-all hover:bg-bg hover:scale-[1.03]"
            style={{ borderColor: accent, color: accent }}
          >
            <span className="text-lg leading-none -mt-px">×</span>
            <span>Close</span>
          </button>

          {/* Counter */}
          <div
            className="absolute top-6 left-6 z-10 font-mono text-xs tracking-[0.3em] px-3 py-1.5 border border-border-strong bg-bg/60 backdrop-blur-sm"
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
            className="absolute left-2 md:left-6 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-3xl text-heading bg-bg/70 backdrop-blur-md border-2 border-border-strong hover:border-heading hover:scale-110 transition-all"
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
            className="absolute right-2 md:right-6 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-3xl text-heading bg-bg/70 backdrop-blur-md border-2 border-border-strong hover:border-heading hover:scale-110 transition-all"
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
    </AnimatePresence>,
    document.body
  );
}
