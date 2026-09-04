import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Standard boutique studio spring easing curve.
 * Balances snappy reactivity with physical smoothness.
 */
export const STUDIO_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Shared scroll-reveal wrapper.
 * Honors prefers-reduced-motion and triggers smoothly when scrolled into view.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  scale = false,
  duration = 0.65,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  scale?: boolean;
  duration?: number;
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
      initial={{
        opacity: 0,
        y,
        scale: scale ? 0.98 : 1,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true, amount: 0.08, margin: "-30px" }}
      transition={{
        duration,
        delay,
        ease: STUDIO_EASE,
      }}
    >
      {children}
    </MotionAs>
  );
}

/**
 * Section-level entrance wrapper that creates a unified, cinematic glide
 * as the user scrolls into each major section of the page.
 */
export function SectionReveal({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={cn(className)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: "-40px" }}
      transition={{ duration: 0.7, ease: STUDIO_EASE }}
    >
      {children}
    </motion.section>
  );
}
