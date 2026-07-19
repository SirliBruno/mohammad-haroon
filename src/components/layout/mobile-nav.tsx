import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { primaryNav } from "@/config/nav";
import { socials } from "@/config/socials";
import { useHydrated } from "@/hooks/use-hydrated";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted md:hidden"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="drawer"
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="قائمة التنقل"
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col border-r border-border/60 bg-background shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
                <span className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
                  القائمة
                </span>
                <button
                  type="button"
                  aria-label="إغلاق القائمة"
                  onClick={() => setOpen(false)}
                  className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav aria-label="قائمة الجوال" className="flex-1 overflow-y-auto px-3 py-6">
                <ul className="flex flex-col">
                  {primaryNav.map((item, i) => (
                    <motion.li
                      key={item.to}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.08 + i * 0.04,
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={item.to}
                        className="flex items-center justify-between rounded-lg px-3 py-3 text-lg font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                        activeProps={{ className: "text-foreground bg-muted" }}
                      >
                        <span>{item.label}</span>
                        <span aria-hidden className="text-muted-foreground">←</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-border/60 p-5">
                <Link
                  to="/contact"
                  className="flex w-full items-center justify-center rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  احجز استشارة
                </Link>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        rel="noreferrer"
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
