"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import Lightbox from "./Lightbox";

/**
 * Horizontal auto-drifting gallery. Cards fan out with a subtle tilt,
 * drift infinitely left-to-right, pause on hover, can be dragged.
 * Click an image → opens Lightbox for full-size view.
 */

type Props = {
  images: readonly string[];
  aspect: "portrait" | "landscape";
  accent: string;
  title: string;
};

export default function ProjectGallery({ images, aspect, accent, title }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const contentWidth = useRef(0);

  // Duplicate images for seamless loop
  const loop = [...images, ...images];

  useEffect(() => {
    if (trackRef.current) {
      contentWidth.current = trackRef.current.scrollWidth / 2;
    }
  }, [images]);

  useAnimationFrame((_, delta) => {
    if (paused || lightboxIndex !== null) return;
    const speed = aspect === "landscape" ? 30 : 22; // px/sec
    const next = x.get() - (speed * delta) / 1000;
    // Reset when we've moved one full content width
    if (Math.abs(next) >= contentWidth.current && contentWidth.current > 0) {
      x.set(0);
    } else {
      x.set(next);
    }
  });

  const cardW =
    aspect === "landscape"
      ? "w-[320px] md:w-[460px] aspect-video"
      : "w-[160px] md:w-[200px] aspect-[9/19]";

  return (
    <>
      <div
        className="relative overflow-hidden -mx-8 md:-mx-16 px-8 md:px-16 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        }}
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -9999, right: 9999 }}
          dragElastic={0.15}
          onDragStart={() => setPaused(true)}
          className="flex gap-5 md:gap-6 py-6"
        >
          {loop.map((src, i) => {
            const originalIndex = i % images.length;
            // Subtle alternating tilt for the "fanned" card feel
            const tilt = ((originalIndex % 3) - 1) * 1.5;
            return (
              <motion.button
                key={`${src}-${i}`}
                onClick={() => setLightboxIndex(originalIndex)}
                whileHover={{
                  rotate: 0,
                  y: -8,
                  scale: 1.04,
                  zIndex: 2,
                  transition: { duration: 0.3 },
                }}
                style={{ rotate: tilt }}
                className={`group relative shrink-0 ${cardW} overflow-hidden border border-border bg-surface shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]`}
              >
                <Image
                  src={src}
                  alt={`${title} ${originalIndex + 1}`}
                  fill
                  sizes={aspect === "landscape" ? "460px" : "200px"}
                  className="object-cover pointer-events-none select-none"
                  draggable={false}
                />
                {/* Accent border glow on hover */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1.5px ${accent}` }}
                />
                {/* Zoom cue */}
                <div
                  aria-hidden
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1 bg-bg/80 backdrop-blur-sm"
                  style={{ color: accent }}
                >
                  ⤢ View
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/60">
        drag · hover pauses · click to zoom
      </div>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
        accent={accent}
      />
    </>
  );
}
