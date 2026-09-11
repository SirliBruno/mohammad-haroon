import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { primaryNav } from "@/config/nav";
import { smoothScrollTo } from "./smooth-scroll";
import { ArrowLeft } from "lucide-react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["what-i-build", "work", "how-it-works", "offer", "about", "faq"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = to.replace("/#", "");
      smoothScrollTo(`#${targetId}`);
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      smoothScrollTo("#contact-form");
    }
  };

  return (
    <header className="sticky top-3 z-40 px-3 sm:top-4 sm:px-4">
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-2xl transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
          "glass-specular-eased",
          scrolled
            ? "glass-nav shadow-lg shadow-black/5"
            : "border border-border/40 bg-background/50 backdrop-blur-md supports-[backdrop-filter]:bg-background/35",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-6 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo />
          </div>

          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1.5 md:flex">
            {primaryNav.map((item) => {
              const targetId = item.to.replace("/#", "");
              const isActive = pathname === "/" && activeSection === targetId;

              return (
                <a
                  key={item.label}
                  href={item.to}
                  onClick={(e) => handleNavClick(e, item.to)}
                  className={cn(
                    "relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-accent font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute inset-x-2.5 -bottom-1 h-0.5 rounded-full bg-gradient-accent-eased shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <a
              href="/#contact-form"
              onClick={scrollToContact}
              className="hidden items-center gap-1.5 rounded-xl bg-gradient-accent-eased hover:bg-gradient-accent-hover px-4 py-2 text-xs sm:text-sm font-bold text-accent-foreground shadow-glow shadow-accent/25 transition-all hover:shadow-[0_0_22px_rgba(6,182,212,0.45)] md:inline-flex cursor-pointer"
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
