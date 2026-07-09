import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared scroll-reveal wrapper. Single source of truth — do NOT redefine
 * per-route. Honors prefers-reduced-motion and uses a consistent
 * viewport margin so reveals fire at the same distance from the fold
 * on every page.
 */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <As className={className}>{children}</As>;
  }
  const MotionAs = motion[As] as typeof motion.div;
  return (
    <MotionAs
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionAs>
  );
}
