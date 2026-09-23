import { memo, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Interactive Scroll-Driven Dark Canvas with Organic Gradient Mesh
 *
 * Visual Composition:
 * - Deep true-black canvas (#000000 to #050811)
 * - Layered organic gradient mesh: Vibrant Turquoise, Luminous Soft White, Obsidian Shadows
 * - Multi-stop Gaussian diffusion (blur: 80px - 110px)
 *
 * Dual Animation Mechanics:
 * 1. Ambient Idle Breathing: Slow sinusoidal pulsation & drift (18s-25s keyframes)
 * 2. Multi-Axis Scroll Dynamics: Seamlessly links scroll depth to vertical parallax (-15%),
 *    smooth rotational shift (0° to 42°), and scale expansion (0.98x to 1.14x)
 *
 * GPU-accelerated: translate3d(0,0,0), will-change: transform, contain: paint (locked 60 FPS)
 * Accessibility: Smoothly locks into static high-contrast ambient gradient under prefers-reduced-motion
 */
export const AmbientGradientMesh = memo(function AmbientGradientMesh({
  className,
}: {
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const shouldDisableMotion = reduce || isMobile;

  // Passive GPU-bound scroll tracking
  const { scrollY, scrollYProgress } = useScroll();

  // Smooth spring damping for organic multi-axis responsiveness
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 24,
    restDelta: 0.001,
  });

  // Parallax translation, rotation (0° to 42°), and subtle expansion (0.98x to 1.14x)
  const meshY = useTransform(scrollY, [0, 4000], [0, -320]);
  const meshRotate = useTransform(smoothProgress, [0, 1], [0, 42]);
  const meshScale = useTransform(smoothProgress, [0, 1], [0.98, 1.14]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "ambient-canvas pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Dynamic Scroll & Parallax Container */}
      <motion.div
        className="relative size-full origin-center"
        style={
          shouldDisableMotion
            ? undefined
            : {
                y: meshY,
                rotate: meshRotate,
                scale: meshScale,
                willChange: "transform",
                transform: "translate3d(0,0,0)",
              }
        }
      >
        {/* Orb 1: Primary Vibrant Turquoise (#06B6D4 / #14B8A6) */}
        <div
          className={cn(
            "ambient-mesh-orb orb-turquoise-primary",
            !reduce && "animate-mesh-breathe-1",
          )}
        />

        {/* Orb 2: Luminous Soft White (#FFFFFF specular highlight) */}
        <div
          className={cn(
            "ambient-mesh-orb orb-luminous-white",
            !reduce && "animate-mesh-breathe-white",
          )}
        />

        {/* Orb 3: High-Energy Cyan / Electric Teal (#22D3EE) */}
        <div
          className={cn(
            "ambient-mesh-orb orb-cyan-glow",
            !reduce && "animate-mesh-breathe-2",
          )}
        />

        {/* Orb 4: Deep Turquoise / Emerald Lower Counterpart (#0D9488) */}
        <div
          className={cn(
            "ambient-mesh-orb orb-teal-deep",
            !reduce && "animate-mesh-breathe-3",
          )}
        />

        {/* Center Vignette / Contrast Balancer */}
        <div className="ambient-mesh-vignette" />
      </motion.div>
    </div>
  );
});