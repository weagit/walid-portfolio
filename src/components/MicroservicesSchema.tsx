"use client";

import { motion } from "motion/react";

type Schema = {
  services: readonly {
    name: string;
    port: string;
    tables: readonly string[];
    endpoints: number;
  }[];
  db: string;
  restCalls: readonly string[];
};

/**
 * Live architecture diagram for the Boutique Microservices project.
 * Renders the two services, their tables, the REST bridge, and the
 * shared PostgreSQL — all with pulsing animation so it breathes.
 */

export default function MicroservicesSchema({
  schema,
  accent,
}: {
  schema: Schema;
  accent: string;
}) {
  const [product, order] = schema.services;

  return (
    <div className="mt-16">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
        Architecture
      </div>

      <div
        className="relative border p-6 md:p-10"
        style={{ borderColor: `${accent}40` }}
      >
        {/* Services row */}
        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-stretch">
          <ServiceBox service={order} accent={accent} />

          {/* REST bridge — horizontal, centered, clean */}
          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.3em] whitespace-nowrap"
              style={{ color: accent }}
            >
              REST · RestTemplate
            </span>
            <svg width="110" height="14" viewBox="0 0 110 14" aria-hidden>
              <motion.line
                x1="0"
                y1="7"
                x2="98"
                y2="7"
                stroke={accent}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [0, -16] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <polygon points="98,2 110,7 98,12" fill={accent} />
            </svg>
            <span
              className="font-mono text-[9px] tracking-[0.2em] text-muted/70 whitespace-nowrap"
              aria-hidden
            >
              synchronous
            </span>
          </div>

          <ServiceBox service={product} accent={accent} />
        </div>

        {/* DB below */}
        <div className="relative mt-8 flex flex-col items-center">
          <svg width="2" height="48" viewBox="0 0 2 48" aria-hidden>
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="48"
              stroke={accent}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              animate={{ strokeDashoffset: [0, -12] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </svg>
          <div
            className="relative flex items-center gap-3 px-6 py-3 border"
            style={{ borderColor: `${accent}60`, backgroundColor: `${accent}08` }}
          >
            {/* DB cylinder glyph */}
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
              <ellipse cx="11" cy="4" rx="8" ry="3" fill="none" stroke={accent} strokeWidth="1.2" />
              <path d="M3 4 V18 A8 3 0 0 0 19 18 V4" fill="none" stroke={accent} strokeWidth="1.2" />
              <ellipse cx="11" cy="11" rx="8" ry="3" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.5" />
            </svg>
            <span className="font-mono text-xs text-heading">{schema.db}</span>
          </div>
        </div>

        {/* Key REST calls */}
        <div className="relative mt-10 pt-6 border-t" style={{ borderColor: `${accent}25` }}>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
            Key cross-service calls
          </div>
          <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs text-text/80">
            {schema.restCalls.map((call) => (
              <li key={call} className="flex gap-2">
                <span style={{ color: accent }}>→</span>
                <span>{call}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ServiceBox({
  service,
  accent,
}: {
  service: { name: string; port: string; tables: readonly string[]; endpoints: number };
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative p-5 border bg-surface/40 backdrop-blur-sm"
      style={{ borderColor: `${accent}55` }}
    >
      {/* Corner ticks */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: accent }} />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: accent }} />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: accent }} />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: accent }} />

      <div className="flex items-baseline justify-between mb-3">
        <h4 className="font-[family-name:var(--font-display)] text-heading text-lg tracking-[0.02em]">
          {service.name}
        </h4>
        <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: accent }}>
          :{service.port}
        </span>
      </div>

      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
        Tables
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {service.tables.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 text-[11px] font-mono border text-text/90"
            style={{ borderColor: `${accent}35` }}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="font-mono text-[10px] tracking-[0.2em] text-muted">
        {service.endpoints} endpoints · Controller → DTO → Service → DAO → Repository → Entity
      </div>
    </motion.div>
  );
}
