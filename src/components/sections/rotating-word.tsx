import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WORDS = [
  { text: "فكرتـــك", color: "#6366F1" },
  { text: "مشروعـــك", color: "#8B5CF6" },
  { text: "موقعــــك", color: "#3B82F6" },
  { text: "متجــــرك", color: "#06B6D4" },
  { text: "نظامـــــك", color: "#A855F7" },
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

  return (
    <span
      className="relative inline-flex items-baseline justify-center align-baseline overflow-hidden"
      style={{
        // Reserve enough width for the longest word ("مشروعك") to prevent layout shift.
        minWidth: "9ch",
        height: "1.15em",
        verticalAlign: "baseline",
      }}
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={current.text}
          initial={{ y: "15%", opacity: 0, filter: "blur(2px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)", color: current.color }}
          exit={{ y: "-15%", opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block whitespace-nowrap"
          style={{ willChange: "transform, opacity, filter" }}
        >
          {current.text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
