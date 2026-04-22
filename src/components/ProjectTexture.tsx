"use client";

import { motion } from "motion/react";
import type { Mood } from "@/data/projects";

/**
 * Mood-specific animated SVG background. Renders behind project detail.
 * Each texture matches the project's character: arena spotlight, service
 * graph, organic scan lines.
 */

export default function ProjectTexture({ mood }: { mood: Mood }) {
  if (mood.texture === "arena") return <ArenaTexture accent={mood.accent} />;
  if (mood.texture === "graph") return <GraphTexture accent={mood.accent} />;
  return <OrganicTexture accent={mood.accent} />;
}

/* Arena — court grid + sweeping purple & gold spotlights (Lakers vibe) */
function ArenaTexture({ accent }: { accent: string }) {
  const purple = "#8B5CF6";
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1000 1000"
    >
      <defs>
        <pattern id="arena-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={accent} strokeOpacity="0.06" strokeWidth="1" />
        </pattern>
        <radialGradient id="arena-gold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="arena-purple" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={purple} stopOpacity="0.5" />
          <stop offset="100%" stopColor={purple} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1000" fill="url(#arena-grid)" />
      {/* Purple spotlight sweeping top-left */}
      <motion.ellipse
        cx="300"
        cy="250"
        rx="380"
        ry="220"
        fill="url(#arena-purple)"
        animate={{ cx: [250, 400, 300, 250], opacity: [0.7, 1, 0.8, 0.7] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Gold spotlight sweeping bottom-right */}
      <motion.ellipse
        cx="720"
        cy="720"
        rx="340"
        ry="200"
        fill="url(#arena-gold)"
        animate={{ cx: [700, 780, 720, 700], opacity: [0.6, 0.9, 0.7, 0.6] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Center court circle */}
      <circle cx="500" cy="500" r="140" fill="none" stroke={accent} strokeOpacity="0.18" strokeWidth="1.5" />
      <circle cx="500" cy="500" r="50" fill="none" stroke={purple} strokeOpacity="0.22" strokeWidth="1" />
      {/* Half-court line */}
      <line x1="0" y1="500" x2="1000" y2="500" stroke={accent} strokeOpacity="0.1" strokeWidth="1" strokeDasharray="6 8" />
    </svg>
  );
}

/* Graph — service nodes with pulsing edges */
function GraphTexture({ accent }: { accent: string }) {
  const nodes = [
    { cx: 200, cy: 300, label: "gateway" },
    { cx: 500, cy: 180, label: "auth" },
    { cx: 500, cy: 500, label: "catalog" },
    { cx: 800, cy: 300, label: "order" },
    { cx: 350, cy: 720, label: "db" },
    { cx: 700, cy: 720, label: "db" },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [2, 4], [3, 5],
  ];
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1000 1000"
    >
      <defs>
        <pattern id="graph-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1" fill={accent} fillOpacity="0.2" />
        </pattern>
      </defs>
      <rect width="1000" height="1000" fill="url(#graph-grid)" />
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke={accent}
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeDasharray="4 6"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle
            cx={n.cx}
            cy={n.cy}
            r="28"
            fill="none"
            stroke={accent}
            strokeOpacity="0.5"
            strokeWidth="1.2"
            animate={{ r: [28, 34, 28], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          />
          <circle cx={n.cx} cy={n.cy} r="6" fill={accent} fillOpacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

/* Organic — drifting scan lines + soft bloom */
function OrganicTexture({ accent }: { accent: string }) {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1000 1000"
    >
      <defs>
        <radialGradient id="organic-bloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle
        cx="500"
        cy="500"
        r="400"
        fill="url(#organic-bloom)"
        animate={{ r: [380, 440, 380], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.path
          key={i}
          d={`M 0 ${150 + i * 180} Q 250 ${120 + i * 180} 500 ${150 + i * 180} T 1000 ${150 + i * 180}`}
          fill="none"
          stroke={accent}
          strokeOpacity="0.15"
          strokeWidth="1"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
        />
      ))}
    </svg>
  );
}
