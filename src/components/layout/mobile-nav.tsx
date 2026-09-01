import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowLeft } from "lucide-react";
import { primaryNav } from "@/config/nav";
import { socials } from "@/config/socials";
import { useHydrated } from "@/hooks/use-hydrated";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    setOpen(false);
    if (to.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = to.replace("/#", "");
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    setOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("contact-form");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-9 items-center justify-center rounded-xl border border-border/70 text-foreground transition-colors hover:bg-muted md:hidden"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {hydrated &&
        createPortal(
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
                  className="absolute inset-0 bg-background/70 backdrop-blur-md"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.aside
                  className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col border-l border-border/80 bg-background shadow-2xl"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      القائمة
                    </span>
                    <button
                      type="button"
                      aria-label="إغلاق القائمة"
                      onClick={() => setOpen(false)}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <nav aria-label="قائمة الجوال" className="flex-1 overflow-y-auto px-4 py-6">
                    <ul className="flex flex-col space-y-1">
                      {primaryNav.map((item, i) => (
                        <motion.li
                          key={item.label}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.05 + i * 0.04,
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <a
                            href={item.to}
                            onClick={(e) => handleNavClick(e, item.to)}
                            className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <span>{item.label}</span>
                            <ArrowLeft className="size-4 text-muted-foreground" />
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>

                  <div className="border-t border-border/60 p-5 space-y-4">
                    <a
                      href="/#contact-form"
                      onClick={scrollToContact}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-md transition-opacity hover:opacity-90"
                    >
                      ابدأ مشروعك
                      <ArrowLeft className="size-4" />
                    </a>
                    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 border-t border-border/40">
                      {socials.map((s) => (
                        <li key={s.label}>
                          <a
                            href={s.href}
                            target="_blank"
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
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
