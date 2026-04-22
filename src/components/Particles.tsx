"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

/**
 * Ambient floating dust — minimalist, elegant, always alive.
 * Deterministic seed so server/client render identically.
 */

type Props = {
  count?: number;
  className?: string;
};

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function Particles({ count = 28, className = "" }: Props) {
  const dots = useMemo(() => {
    const rand = seeded(42);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 3.5,
      duration: 14 + rand() * 22,
      delay: rand() * -20,
      opacity: 0.18 + rand() * 0.32,
      drift: (rand() - 0.5) * 40,
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            boxShadow: "0 0 6px rgba(255,255,255,0.35)",
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, d.drift, 0],
            opacity: [d.opacity, d.opacity * 2, d.opacity],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
