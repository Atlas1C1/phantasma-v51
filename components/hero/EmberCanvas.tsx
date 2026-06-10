// components/hero/EmberCanvas.tsx
"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Ambient ember field — 2D canvas with pre-rendered glow sprites and
 * additive compositing. No WebGL dependency; GPU-composited, cheap.
 *
 * Guardrails:
 *  - DPR capped at 2
 *  - Particle count scales with viewport area (and halves on low memory)
 *  - rAF paused when tab hidden or hero scrolled out of view
 *  - prefers-reduced-motion → static gradient, no canvas at all
 */

type Particle = {
  x: number;
  y: number;
  vy: number; // upward velocity (px/s)
  sway: number; // horizontal sway amplitude
  phase: number; // sway phase offset
  freq: number; // sway frequency
  size: number; // sprite draw size (px)
  sprite: number; // sprite index
  alpha: number; // base alpha
  flicker: number; // flicker frequency
};

const DPR_CAP = 2;
const SPRITE_SIZE = 64;

/** Amber → crimson → magenta-edge ramp, weighted toward amber. */
const SPRITE_COLORS: Array<[number, number, number]> = [
  [255, 138, 0],
  [255, 110, 20],
  [255, 61, 61],
  [192, 38, 211],
];
const SPRITE_WEIGHTS = [0.45, 0.3, 0.2, 0.05];

function makeSprite([r, g, b]: [number, number, number]): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE_SIZE;
  const ctx = c.getContext("2d")!;
  const half = SPRITE_SIZE / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.5)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return c;
}

function pickSprite(): number {
  const t = Math.random();
  let acc = 0;
  for (let i = 0; i < SPRITE_WEIGHTS.length; i++) {
    acc += SPRITE_WEIGHTS[i];
    if (t < acc) return i;
  }
  return 0;
}

function spawn(w: number, h: number, initial: boolean): Particle {
  return {
    x: Math.random() * w,
    y: initial ? Math.random() * h : h + 16,
    vy: 18 + Math.random() * 42,
    sway: 8 + Math.random() * 26,
    phase: Math.random() * Math.PI * 2,
    freq: 0.2 + Math.random() * 0.5,
    size: 1.5 + Math.random() ** 2 * 5,
    sprite: pickSprite(),
    alpha: 0.25 + Math.random() * 0.55,
    flicker: 1 + Math.random() * 3,
  };
}

export default function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprites = SPRITE_COLORS.map(makeSprite);

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let inView = true;
    let pageVisible = !document.hidden;
    let running = false;

    // Low-power heuristic: halve density when deviceMemory < 4
    const nav = navigator as Navigator & { deviceMemory?: number };
    const density =
      nav.deviceMemory !== undefined && nav.deviceMemory < 4 ? 22000 : 11000;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(Math.round((width * height) / density), 220);
      if (particles.length > target) {
        particles.length = target;
      } else {
        while (particles.length < target) {
          particles.push(spawn(width, height, true));
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); // clamp tab-switch jumps
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.vy * dt;
        const x = p.x + Math.sin(t * p.freq * Math.PI * 2 + p.phase) * p.sway;

        if (p.y < -16) {
          particles[i] = spawn(width, height, false);
          continue;
        }

        // Fade near the top third; flicker for life
        const heightFade = Math.min(1, p.y / (height * 0.35));
        const flicker = 0.75 + 0.25 * Math.sin(t * p.flicker * Math.PI * 2 + p.phase);
        ctx.globalAlpha = p.alpha * heightFade * flicker;

        const d = p.size * 4; // sprite has soft falloff, draw oversized
        ctx.drawImage(sprites[p.sprite], x - d / 2, p.y - d / 2, d, d);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };

    const updateRunning = () => {
      const shouldRun = inView && pageVisible;
      if (shouldRun && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        updateRunning();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      updateRunning();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    resize();
    updateRunning();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  // Reduced motion: static ember atmosphere, no canvas, no JS loop.
  if (reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_100%,rgb(255_110_0/0.16),transparent_70%)]"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-70"
    />
  );
}