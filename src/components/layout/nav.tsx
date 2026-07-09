import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { MobileNav } from "./mobile-nav";
import { Logo } from "@/components/brand/logo";
import { AvailabilityBadge } from "@/components/brand/availability-badge";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { primaryNav } from "@/config/nav";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo />
            <AvailabilityBadge />
          </div>

          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group relative rounded-md px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-right bg-foreground transition-transform duration-300 ease-out",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                  {active ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      aria-hidden
                      className="absolute inset-0 -z-0 rounded-md bg-muted/70"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/contact"
              className="hidden rounded-md bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 md:inline-flex"
            >
              احجز استشارة
            </Link>
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
