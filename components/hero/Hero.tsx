import EmberCanvas from "./EmberCanvas";
import HeroContent from "./HeroContent";
import ScrollCue from "./ScrollCue";

/**
 * Server component shell. The only client islands inside are the
 * ember canvas, the motion-orchestrated content, and the scroll cue.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Ambient layer ─────────────────────────────────── */}
      <EmberCanvas />

      {/* Vignette: keeps copy legible over the particle field */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_30%,var(--color-obsidian)_100%)]"
      />

      {/* Ember floor glow — light always rises from below */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[40vh] bg-[radial-gradient(70%_100%_at_50%_100%,rgb(255_138_0/0.13),transparent_70%)]"
      />

      {/* ── Content layer ─────────────────────────────────── */}
      <HeroContent />

      <ScrollCue />

      {/* Heat-line: the section-divider language for the whole site */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgb(255_138_0/0.5)] to-transparent"
      />
    </section>
  );
}
