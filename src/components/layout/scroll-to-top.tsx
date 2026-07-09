import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 grid size-11 place-items-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-ring"
        >
          <ArrowUp className="size-4" aria-hidden />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
