// components/sections/SmartNFTShowcase.tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from "framer-motion";

/* ── Section-scoped accent system (arcane violet/cyan) ─────────── */
const CYAN = "#00C2FF";
const VIOLET = "#7C3AED";
const VIOLET_TEXT = "#A78BFA"; // lightened for small-text AA contrast

const EASE = [0.16, 1, 0.3, 1] as const;

type Stage = {
  index: string;
  name: string;
  caption: string;
  color: string;
};

const STAGES: Stage[] = [
  {
    index: "01",
    name: "Common Sword",
    caption: "Minted on day one. A clean slate, recorded on-chain.",
    color: "#9B9BA3",
  },
  {
    index: "02",
    name: "Rare Sword",
    caption: "One hundred victories sharpened its edge.",
    color: CYAN,
  },
  {
    index: "03",
    name: "Epic Sword",
    caption: "A raid season conquered. New power, unlocked forever.",
    color: VIOLET_TEXT,
  },
  {
    index: "04",
    name: "Legendary Artifact",
    caption: "Every battle it has lived, written into the asset itself.",
    color: "#EDEDEF",
  },
];

const FEATURES = [
  {
    title: "Dynamic Progression",
    body: "Assets evolve through gameplay and achievements.",
    accent: CYAN,
    glow: "hover:shadow-[0_0_48px_-12px_rgb(0_194_255/0.3)]",
  },
  {
    title: "Unlockable Experiences",
    body: "Metadata, appearance, and functionality can change over time.",
    accent: VIOLET_TEXT,
    glow: "hover:shadow-[0_0_48px_-12px_rgb(124_58_237/0.4)]",
  },
  {
    title: "Living Assets",
    body: "Ownership becomes interactive and responsive.",
    accent: CYAN,
    glow: "hover:shadow-[0_0_48px_-12px_rgb(0_194_255/0.3)]",
  },
] as const;

/* ── Scroll keyframe helpers ───────────────────────────────────── */

/** Caption visibility window for stage i (quarters of the track). */
function captionKeyframes(i: number): [number[], number[]] {
  if (i === 0) return [[0, 0.19, 0.26], [1, 1, 0]];
  if (i === STAGES.length - 1) return [[0.72, 0.8, 1], [0, 1, 1]];
  const s = i * 0.25;
  return [
    [s - 0.02, s + 0.05, s + 0.19, s + 0.26],
    [0, 1, 1, 0],
  ];
}

/* ── The artifact ──────────────────────────────────────────────── */

const BLADE = "M120 16 L138 60 L138 214 L120 226 L102 214 L102 60 Z";

type LayerValue = MotionValue<number> | number;

function SwordArt({
  rare,
  epic,
  legendary,
  scale,
}: {
  rare: LayerValue;
  epic: LayerValue;
  legendary: LayerValue;
  scale: LayerValue;
}) {
  return (
    <motion.svg
      viewBox="0 0 240 360"
      style={{ scale }}
      className="h-[42svh] max-h-[440px] w-auto sm:h-[52svh]"
      aria-hidden
    >
      <defs>
        <linearGradient id="snft-blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CYAN} />
          <stop offset="100%" stopColor={VIOLET} />
        </linearGradient>
        <radialGradient id="snft-aura" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={VIOLET} stopOpacity="0.45" />
          <stop offset="55%" stopColor={CYAN} stopOpacity="0.12" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Legendary aura — sits behind the blade */}
      <motion.ellipse
        style={{ opacity: legendary }}
        cx="120"
        cy="165"
        rx="112"
        ry="155"
        fill="url(#snft-aura)"
      />

      {/* STAGE 1 — Common base. Never removed: the asset persists. */}
      <g>
        <path d={BLADE} fill="#33333C" stroke="#4A4A55" strokeWidth="1.5" />
        <line x1="120" y1="46" x2="120" y2="202" stroke="#55555F" strokeWidth="2" />
        <rect x="76" y="218" width="88" height="14" rx="7" fill="#2A2A32" stroke="#4A4A55" strokeWidth="1.5" />
        <rect x="111" y="232" width="18" height="58" rx="8" fill="#1C1C22" stroke="#3A3A44" strokeWidth="1.5" />
        <circle cx="120" cy="302" r="11" fill="#2A2A32" stroke="#4A4A55" strokeWidth="1.5" />
      </g>

      {/* STAGE 2 — Rare: a cyan edge and runes are earned */}
      <motion.g style={{ opacity: rare }}>
        <path d={BLADE} fill="none" stroke={CYAN} strokeWidth="2" opacity="0.85" />
        {[84, 116, 148].map((y) => (
          <path
            key={y}
            d={`M120 ${y - 7} L126 ${y} L120 ${y + 7} L114 ${y} Z`}
            fill={CYAN}
            opacity="0.8"
          />
        ))}
      </motion.g>

      {/* STAGE 3 — Epic: a violet core ignites, a gem is set */}
      <motion.g style={{ opacity: epic }}>
        <path d={BLADE} fill={VIOLET} opacity="0.22" />
        <line x1="120" y1="46" x2="120" y2="202" stroke={VIOLET_TEXT} strokeWidth="2.5" opacity="0.9" />
        <circle cx="120" cy="225" r="10" fill={VIOLET} opacity="0.35" />
        <circle cx="120" cy="225" r="6" fill={VIOLET} />
      </motion.g>

      {/* STAGE 4 — Legendary: the full history, made visible */}
      <motion.g style={{ opacity: legendary }}>
        <path d={BLADE} fill="url(#snft-blade)" opacity="0.5" />
        <path d={BLADE} fill="none" stroke="url(#snft-blade)" strokeWidth="2.5" />
        {[
          [72, 96],
          [172, 132],
          [86, 182],
          [166, 70],
        ].map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            d={`M${x} ${y - 5} L${x + 4} ${y} L${x} ${y + 5} L${x - 4} ${y} Z`}
            fill={CYAN}
            opacity="0.7"
          />
        ))}
        <circle cx="120" cy="302" r="11" fill="none" stroke={CYAN} strokeWidth="1.5" opacity="0.8" />
      </motion.g>
    </motion.svg>
  );
}

/* ── Scroll-synced text ────────────────────────────────────────── */

function StageCaption({
  stage,
  i,
  progress,
}: {
  stage: Stage;
  i: number;
  progress: MotionValue<number>;
}) {
  const [input, output] = captionKeyframes(i);
  const opacity = useTransform(progress, input, output);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6"
    >
      <p
        className="text-xl font-semibold tracking-tight sm:text-2xl"
        style={{ color: stage.color }}
      >
        {stage.name}
      </p>
      <p className="max-w-md text-sm leading-relaxed text-ash-400 sm:text-base">
        {stage.caption}
      </p>
    </motion.div>
  );
}

function RailItem({
  stage,
  i,
  progress,
}: {
  stage: Stage;
  i: number;
  progress: MotionValue<number>;
}) {
  const [input, output] = captionKeyframes(i);
  const opacity = useTransform(progress, input, output.map((o) => 0.3 + 0.7 * o));

  return (
    <motion.li style={{ opacity }} className="flex items-center gap-2">
      <span className="font-mono text-xs text-ash-600">{stage.index}</span>
      <span className="text-sm tracking-tight text-ash-100">{stage.name}</span>
    </motion.li>
  );
}

/* ── Shared header & cards (used by both motion paths) ────────── */

function SectionHeader({ animate }: { animate: boolean }) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: (d: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay: d },
    }),
  };

  const Wrapper = animate ? motion.div : "div";

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8">
      {(["eyebrow", "headline", "sub"] as const).map((part, i) => {
        const content =
          part === "eyebrow" ? (
            <p className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: CYAN }}>
              SmartNFT Technology
            </p>
          ) : part === "headline" ? (
            <h2
              id="smart-nfts-heading"
              className="mt-6 text-balance text-[clamp(2rem,4vw+1rem,3.75rem)] font-semibold leading-[1.08] tracking-[-0.025em]"
            >
              Assets that{" "}
              <span className="bg-gradient-to-r from-[#00C2FF] to-[#A78BFA] bg-clip-text text-transparent">
                evolve
              </span>{" "}
              with the player
            </h2>
          ) : (
            <div className="mt-6 max-w-xl">
              <p className="text-pretty text-base leading-relaxed text-ash-400 sm:text-lg">
                Most NFTs are static. SmartNFTs are programmable assets capable
                of evolving through gameplay, achievements, time, or external
                events.
              </p>
            </div>
          );

        return animate ? (
          <Wrapper
            key={part}
            custom={i * 0.1}
            variants={variants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          >
            {content}
          </Wrapper>
        ) : (
          <div key={part}>{content}</div>
        );
      })}
    </div>
  );
}

function FeatureCards({ animate }: { animate: boolean }) {
  return (
    <ul className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-4 px-5 sm:px-8 md:grid-cols-3 md:gap-6">
      {FEATURES.map((f, i) => {
        const inner = (
          <div
            className={`hairline group h-full rounded-2xl bg-white/[0.02] p-8 backdrop-blur-sm transition-[border-color,box-shadow,background-color] duration-300 hover:border-white/15 hover:bg-white/[0.04] ${f.glow}`}
          >
            <span
              aria-hidden
              className="mb-6 block h-px w-8 transition-all duration-300 group-hover:w-12"
              style={{ backgroundColor: f.accent }}
            />
            <h3 className="text-lg font-semibold tracking-tight text-ash-100">
              {f.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ash-400">{f.body}</p>
          </div>
        );

        return animate ? (
          <motion.li
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
          >
            {inner}
          </motion.li>
        ) : (
          <li key={f.title}>{inner}</li>
        );
      })}
    </ul>
  );
}

/* Screen-reader narrative — always present, independent of animation */
function StageListSrOnly() {
  return (
    <ol className="sr-only">
      {STAGES.map((s) => (
        <li key={s.index}>
          {s.name}: {s.caption}
        </li>
      ))}
    </ol>
  );
}

/* ── Section ───────────────────────────────────────────────────── */

export default function SmartNFTShowcase() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /* Additive evolution layers */
  const rare = useTransform(scrollYProgress, [0.22, 0.3], [0, 1]);
  const epic = useTransform(scrollYProgress, [0.47, 0.55], [0, 1]);
  const legendary = useTransform(scrollYProgress, [0.72, 0.8], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1.03]);

  /* Atmosphere */
  const cyanGlow = useTransform(scrollYProgress, [0.2, 0.32, 0.72, 0.9], [0, 0.5, 0.5, 0.3]);
  const violetGlow = useTransform(scrollYProgress, [0.45, 0.58, 1], [0, 0.55, 0.7]);

  /* ── Reduced motion: static narrative, zero scrubbing ── */
  if (reduced) {
    return (
      <section id="smart-nfts" aria-labelledby="smart-nfts-heading" className="relative py-32 sm:py-40">
        <SectionHeader animate={false} />
        <StageListSrOnly />

        <div className="mt-20 flex flex-col items-center">
          <SwordArt rare={1} epic={1} legendary={1} scale={1} />
          <ol className="mt-16 flex max-w-2xl flex-col gap-6 px-5 sm:px-8" aria-hidden>
            {STAGES.map((s) => (
              <li key={s.index} className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-ash-600">{s.index}</span>
                <div>
                  <p className="font-semibold tracking-tight" style={{ color: s.color }}>
                    {s.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ash-400">{s.caption}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <FeatureCards animate={false} />
        <SectionDivider />
      </section>
    );
  }

  /* ── Full scroll-driven story ── */
  return (
    <section id="smart-nfts" aria-labelledby="smart-nfts-heading" className="relative pt-32 sm:pt-40">
      <SectionHeader animate />
      <StageListSrOnly />

      {/* 400vh track: each quarter is one evolution stage */}
      <div ref={trackRef} className="relative mt-12 h-[400vh]">
        <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
          {/* Atmosphere — light gathers as the asset grows */}
          <motion.div
            aria-hidden
            style={{ opacity: cyanGlow }}
            className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_50%,rgb(0_194_255/0.13),transparent_70%)]"
          />
          <motion.div
            aria-hidden
            style={{ opacity: violetGlow }}
            className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_55%,rgb(124_58_237/0.16),transparent_70%)]"
          />

          {/* One token, one identity */}
          <p className="hairline mb-8 rounded-full bg-white/[0.03] px-4 py-1.5 font-mono text-[11px] tracking-wide text-ash-400 backdrop-blur-md">
            ASSET #0001 · SAME TOKEN, NEW STATE
          </p>

          <SwordArt rare={rare} epic={epic} legendary={legendary} scale={scale} />

          {/* Crossfading stage captions */}
          <div className="relative mt-8 h-24 w-full" aria-hidden>
            {STAGES.map((s, i) => (
              <StageCaption key={s.index} stage={s} i={i} progress={scrollYProgress} />
            ))}
          </div>

          {/* Stage rail */}
          <ul
            aria-hidden
            className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5"
          >
            {STAGES.map((s, i) => (
              <RailItem key={s.index} stage={s} i={i} progress={scrollYProgress} />
            ))}
          </ul>
        </div>
      </div>

      <div className="pb-32 pt-8 sm:pb-40">
        <FeatureCards animate />
      </div>

      <SectionDivider />
    </section>
  );
}

/* Heat-line divider — hands the palette back to the global system */
function SectionDivider() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgb(124_58_237/0.45)] to-transparent"
    />
  );
}