import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WORDS = [
  { text: "متجرك", color: "#06B6D4" },
  { text: "موقعك", color: "#3B82F6" },
  { text: "هويتك", color: "#A855F7" },
  { text: "مشروعك", color: "#22C55E" },
  { text: "منصتك", color: "#F59E0B" },
  { text: "فكرتك", color: "#6366F1" },
] as const;

export function RotatingWord() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2000);
    return () => clearInterval(id);
  }, [reduce]);

  if (reduce) {
    return (
      <span
        className="inline-block align-baseline"
        style={{ color: WORDS[0].color }}
      >
        {WORDS[0].text}
      </span>
    );
  }

  const current = WORDS[i];
  // Longest word establishes the reserved width so surrounding words keep
  // their natural spacing without layout shift when the word changes.
  const longest = WORDS.reduce((a, b) => (b.text.length > a.text.length ? b : a));

  return (
    <span
      className="relative inline-grid align-baseline overflow-hidden"
      style={{ verticalAlign: "baseline", lineHeight: "1.15" }}
      aria-live="polite"
    >
      {/* Invisible sizer — reserves exact width of the widest word. */}
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
      >
        {longest.text}
      </span>
      <span className="relative col-start-1 row-start-1 block">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current.text}
            initial={{ y: "15%", opacity: 0, filter: "blur(2px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)", color: current.color }}
            exit={{ y: "-15%", opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 whitespace-nowrap text-center"
            style={{ willChange: "transform, opacity, filter" }}
          >
            {current.text}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
