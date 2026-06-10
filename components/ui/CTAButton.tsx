// components/ui/CTAButton.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
};

export default function CTAButton({ href, variant = "primary", children }: Props) {
  return (
    <motion.a
      href={href}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "group relative inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-tight sm:w-auto",
        "transition-[box-shadow,background-color,border-color] duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember",
        variant === "primary" &&
          cn(
            "bg-gradient-to-b from-[#ff9a1f] to-[#f06000] text-obsidian",
            "shadow-[0_0_0_1px_rgb(255_138_0/0.4),0_8px_32px_-8px_rgb(255_110_0/0.45)]",
            "hover:shadow-[0_0_0_1px_rgb(255_138_0/0.6),0_8px_48px_-6px_rgb(255_110_0/0.7)]"
          ),
        variant === "ghost" &&
          cn(
            "hairline bg-white/[0.03] text-ash-100 backdrop-blur-md",
            "hover:border-white/20 hover:bg-white/[0.07]"
          )
      )}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>
    </motion.a>
  );
}