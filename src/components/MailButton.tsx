"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

/**
 * Mail button — opens a dropdown letting the visitor choose Gmail, Outlook,
 * or copy the address. Works for any visitor, no default-mail-client assumptions.
 */

const email = profile.contact.email;

const options = [
  {
    key: "gmail",
    label: "Gmail",
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
        <path fill="currentColor" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.728L12 10.91l9.636-7.09h.728c.904 0 1.636.732 1.636 1.636z" />
      </svg>
    ),
  },
  {
    key: "outlook",
    label: "Outlook",
    href: `https://outlook.office.com/mail/deeplink/compose?to=${email}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
        <path fill="currentColor" d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86 0-.46.1-.88.1-.41.33-.73.2-.32.58-.51.36-.2.87-.2.5 0 .86.2.37.19.58.51.22.32.33.73.1.42.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75v5.43l.35.15q.53.18.86.7.34.51.34 1.17zm-1.1-6.43 1.33-.84V3q0-.08-.04-.12t-.12-.04H8.02q-.08 0-.12.04T7.86 3v1.73l1.33.84L22.9 5.57zm-1.89 4.79.84-.48-1.33-.85V6.36l-9 5.73v.4l.2.13q.15.1.32.23l.8.56q.1.05.13.11.04.05.08.13 5.82-4.04 5.66-3.92.12-.08.3-.03zM12.75 22H22q.23 0 .38-.15.18-.15.18-.37v-7.07l-4.4 2.56L12.75 22zm10-.52v-7.17q-.17.12-.35.23-.19.12-.38.24l-7.9 4.56 7.9-4.56q-.19.12-.38.24-.18.11-.35.22v6.4q0 .05.02.08.02.04.07.04.05 0 .08.02z" />
      </svg>
    ),
  },
  {
    key: "copy",
    label: "Copy address",
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    ),
  },
];

type Props = { size?: number };

export default function MailButton({ size = 18 }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ y: -2 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Email"
        aria-expanded={open}
        className="text-muted hover:text-accent-hover transition-colors duration-300 p-2.5 rounded-full border border-border hover:border-border-strong"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-30 min-w-[220px] rounded-lg border border-border-strong bg-surface/95 backdrop-blur-sm shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border text-[10px] uppercase tracking-[0.3em] text-muted font-mono">
              Reach out
            </div>
            {options.map((opt) =>
              opt.href ? (
                <a
                  key={opt.key}
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-text hover:bg-surface-elevated hover:text-accent-hover transition-colors"
                >
                  <span className="text-muted">{opt.icon}</span>
                  <span>{opt.label}</span>
                </a>
              ) : (
                <button
                  key={opt.key}
                  onClick={handleCopy}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-text hover:bg-surface-elevated hover:text-accent-hover transition-colors w-full text-left"
                >
                  <span className="text-muted">{opt.icon}</span>
                  <span>{copied ? "Copied ✓" : opt.label}</span>
                </button>
              )
            )}
            <div className="px-4 py-3 border-t border-border text-xs font-mono text-muted truncate">
              {email}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
