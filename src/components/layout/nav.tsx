import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { primaryNav } from "@/config/nav";
import { ArrowLeft } from "lucide-react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = to.replace("/#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("contact-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-3 z-40 px-3 sm:top-4 sm:px-4">
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-2xl border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
          scrolled
            ? "border-border/80 bg-background/85 shadow-lg shadow-black/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
            : "border-border/50 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-6 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo />
          </div>

          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1.5 md:flex">
            {primaryNav.map((item) => (
              <a
                key={item.label}
                href={item.to}
                onClick={(e) => handleNavClick(e, item.to)}
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <a
              href="/#contact-form"
              onClick={scrollToContact}
              className="hidden items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:opacity-90 hover:shadow-sm md:inline-flex"
            >
              ابدأ مشروعك
              <ArrowLeft className="size-3.5" />
            </a>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
