// components/hero/HeroContent.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

/** Clip-style line reveal: text slides up inside an overflow-hidden mask. */
const line: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

const fadeRise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function HeroContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 flex max-w-4xl flex-col items-center px-5 text-center sm:px-8"
    >
      {/* Announcement pill — validator bonding hook */}
      <motion.a
        variants={fadeRise}
        href="#validators"
        className="hairline group mb-8 inline-flex items-center gap-2.5 rounded-full bg-white/[0.03] py-1.5 pl-3 pr-4 backdrop-blur-md transition-colors duration-300 hover:border-[rgb(255_138_0/0.35)] hover:bg-white/[0.06]"
      >
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-pulse-dot rounded-full bg-ember" />
        </span>
        <span className="font-mono text-[11px] tracking-wide text-ash-400 transition-colors duration-300 group-hover:text-ash-100 sm:text-xs">
          Public validator bonding · Oct 1, 2026
        </span>
        <span
          aria-hidden
          className="text-ash-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-ember"
        >
          →
        </span>
      </motion.a>

      {/* Headline — masked line reveals over server-rendered text */}
      <h1 className="text-balance font-sans text-[clamp(2.75rem,6vw+1rem,5.75rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
        <span className="block overflow-hidden pb-[0.08em]">
          <motion.span variants={line} className="block">
            Web3,{" "}
            <span className="text-ember-gradient">reborn.</span>
          </motion.span>
        </span>
      </h1>

      {/* Subcopy */}
      <motion.p
        variants={fadeRise}
        className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ash-400 sm:text-lg"
      >
        Phantasma Phoenix is the carbon-negative Layer&nbsp;1 built for
        gaming — where tokens, Smart NFTs, and entire games mint
        instantly. No contracts. No code. No compromise.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={fadeRise}
        className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
      >
        <CTAButton href="#build" variant="primary">
          Start building
        </CTAButton>
        <CTAButton href="#carbon" variant="ghost">
          Why Carbon?
        </CTAButton>
      </motion.div>
    </motion.div>
  );
}