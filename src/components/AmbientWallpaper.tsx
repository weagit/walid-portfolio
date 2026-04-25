"use client";

import { motion } from "motion/react";

/**
 * Site-wide ambient wallpaper — slow-drifting light orbs behind everything.
 * Fixed to the viewport, renders behind the statue and all section content.
 * Quiet atmosphere, but visible.
 */

export default function AmbientWallpaper() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Drifting orb — top left, cool silver */}
      <motion.div
        className="absolute rounded-full blur-[80px] will-change-transform"
        style={{
          top: "-10%",
          left: "-10%",
          width: "70vw",
          height: "70vw",
          background:
            "radial-gradient(circle, rgba(200,210,225,0.22) 0%, rgba(200,210,225,0) 70%)",
        }}
        animate={{
          x: ["0%", "15%", "-5%", "0%"],
          y: ["0%", "10%", "-5%", "0%"],
        }}
        transition={{ duration: 55, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Drifting orb — bottom right, warm */}
      <motion.div
        className="absolute rounded-full blur-[90px] will-change-transform"
        style={{
          right: "-15%",
          bottom: "-15%",
          width: "65vw",
          height: "65vw",
          background:
            "radial-gradient(circle, rgba(230,220,200,0.18) 0%, rgba(230,220,200,0) 70%)",
        }}
        animate={{
          x: ["0%", "-10%", "5%", "0%"],
          y: ["0%", "-8%", "5%", "0%"],
        }}
        transition={{ duration: 70, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Drifting orb — center, violet accent */}
      <motion.div
        className="absolute rounded-full blur-[100px] will-change-transform"
        style={{
          left: "25%",
          top: "30%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(139,92,246,0) 70%)",
        }}
        animate={{
          x: ["-5%", "10%", "-3%", "-5%"],
          y: ["0%", "-8%", "6%", "0%"],
        }}
        transition={{ duration: 85, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Full-page grain */}
      <div className="grain absolute inset-0 opacity-50" />
    </div>
  );
}
