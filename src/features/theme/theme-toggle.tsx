import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "./theme-provider";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

/**
 * Animated Sun/Moon Morphing Theme Toggle
 *
 * Fluid Sun-to-Moon spring physics morphing SVG:
 * - Light Mode: Radiant Sun with 8 outward rays
 * - Dark Mode: Elegant crescent Moon with smooth rotation & mask cut
 * - Glassmorphic pill container with vibrant turquoise hover glow
 * - Full reduced-motion and keyboard accessibility compliance
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  const maskId = useId();

  const isDark = hydrated && resolved === "dark";

  // Spring transition for icon morphing
  const springConfig = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 240, damping: 18 };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "تفعيل الوضع النهاري (Light Mode)" : "تفعيل الوضع الليلي (Dark Mode)"}
      aria-pressed={isDark}
      className={cn(
        "group relative inline-flex size-9 items-center justify-center rounded-xl",
        "glass-pill transition-all duration-300",
        "text-foreground/80 hover:text-accent hover:border-accent/60",
        "hover:shadow-[0_0_14px_rgba(6,182,212,0.3)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "active:scale-95 cursor-pointer",
        className,
      )}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[18px]"
        initial={false}
        animate={{
          rotate: isDark ? 40 : 0,
        }}
        transition={springConfig}
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <motion.circle
            cx={isDark ? 16 : 28}
            cy={isDark ? 6 : -4}
            r="8"
            fill="black"
            initial={false}
            animate={{
              cx: isDark ? 16 : 28,
              cy: isDark ? 6 : -4,
            }}
            transition={springConfig}
          />
        </mask>

        {/* Center celestial body (Sun sphere -> Moon body) */}
        <motion.circle
          cx="12"
          cy="12"
          r={isDark ? 8.5 : 5}
          fill="currentColor"
          stroke="currentColor"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{
            r: isDark ? 8.5 : 5,
          }}
          transition={springConfig}
        />

        {/* Sunbeams (Radial rays expanding / contracting) */}
        <motion.g
          stroke="currentColor"
          style={{ transformOrigin: "12px 12px" }}
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1,
            rotate: isDark ? 90 : 0,
          }}
          transition={springConfig}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </motion.g>
      </motion.svg>
    </button>
  );
}
