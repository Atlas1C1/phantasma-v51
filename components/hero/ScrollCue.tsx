// components/hero/ScrollCue.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ScrollCue() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 1 }}
      aria-hidden
      className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash-600">
        Scroll
      </span>
      <span className="block h-8 w-px overflow-hidden">
        <span className="block h-full w-px animate-scroll-cue bg-gradient-to-b from-transparent via-ash-400 to-transparent" />
      </span>
    </motion.div>
  );
}