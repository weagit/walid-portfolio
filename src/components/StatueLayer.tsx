"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { profile } from "@/data/profile";

/**
 * Persistent statue — the signature of the site. Follows the reader across
 * every chapter, never fully disappearing.
 *
 *   I (Hero) & II (About)    : large, left side, the protagonist
 *   III (Projects)           : fades back, cards take the stage
 *   IV (Journey) & V (Toolkit): bigger re-entry on the right — signature presence
 *   VI (Contact)             : last soft echo before the close
 */

export default function StatueLayer() {
  const { scrollY } = useScroll();
  const smooth = useSpring(scrollY, { stiffness: 80, damping: 28, mass: 0.5 });

  // Approx scroll keyframes:
  //   0      Hero
  //   900    About
  //   1700   About → Projects
  //   1900   invisible reposition
  //   2100   right side (still invisible)
  //   3000   Journey enters → fade up big
  //   4400   Toolkit mid
  //   5600   Contact enters → soften to watermark
  //   6400   end

  const scale = useTransform(
    smooth,
    [0, 900, 1700, 2100, 3000, 5400, 6400],
    [1, 0.82, 0.76, 0.72, 0.8, 0.78, 0.72]
  );

  // Right-side x = 15% → with flip, the statue body lands in the right third
  // of the viewport (not off-screen). Chill & centered on that half.
  const x = useTransform(
    smooth,
    [0, 900, 1700, 1900, 2100, 5400, 6400],
    ["0%", "-10%", "-18%", "-18%", "15%", "16%", "18%"]
  );

  // Steady opacity through Journey + Toolkit — no flickering fade mid-read.
  const opacity = useTransform(
    smooth,
    [0, 900, 1500, 1900, 2100, 3000, 5200, 5800, 6400],
    [1, 0.85, 0.35, 0, 0, 0.3, 0.3, 0.2, 0.14]
  );

  // Horizontal flip when on right side
  const scaleX = useTransform(smooth, [2000, 2100], [1, -1]);

  return (
    <motion.div
      aria-hidden
      className="fixed inset-y-0 left-0 w-[95%] md:w-[78%] lg:w-[68%] pointer-events-none select-none flex items-center z-0"
      style={{ scale, x, opacity }}
    >
      <motion.div className="relative w-full h-full" style={{ scaleX }}>
        <motion.div
          className="relative w-full h-full"
          animate={{
            scale: [1, 1.04, 1.01, 1.03, 1],
            y: ["0%", "-1%", "0.5%", "-0.5%", "0%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src={profile.statue}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 95vw, 68vw"
            className="object-contain"
            style={{ objectPosition: "15% center" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
