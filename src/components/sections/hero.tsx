import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { DSButton } from "@/components/ds";
import { Container } from "@/components/layout/container";
import { HeroWorkspace } from "@/components/sections/hero-workspace";
import { HeroMobile } from "@/components/sections/hero-mobile";
import { RotatingWord } from "@/components/sections/rotating-word";
import { socials } from "@/config/socials";
import { trackEvent } from "@/lib/analytics";
import { useHomeContent, getHomeText } from "@/lib/cms/home-content";

const socialIcon: Record<string, typeof Github> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  X: Twitter,
  "البريد الإلكتروني": Mail,
};

// Minimal drifting particles — pure decoration, disabled under reduced motion.
function Particles() {
  const dots = [
    { top: "22%", left: "16%", d: 14 },
    { top: "62%", left: "78%", d: 16 },
    { top: "78%", left: "28%", d: 18 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {dots.map((p, i) => (
        <motion.span
          key={i}
          className="absolute size-1 rounded-full bg-primary/25"
          style={{ top: p.top, left: p.left }}
          animate={{ y: [0, -10, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const { data: homeRows } = useHomeContent();
  const badge = getHomeText(homeRows, "home.hero.badge", "متاح لمشاريع جديدة");
  const heroDesc = getHomeText(
    homeRows,
    "home.hero.description",
    "مواقع وأنظمة رقمية تجمع تصميمًا هادئًا بأداءٍ سريع.\nنبنيها معك لتخدم عملك وتليق باسمك.",
  );
  const ctaPrimaryLabel = getHomeText(homeRows, "home.hero.cta_primary_label", "استعرض الأعمال");
  const ctaSecondaryLabel = getHomeText(homeRows, "home.hero.cta_secondary_label", "عندك فكرة ؟");
  const heroDescLines = heroDesc.split("\n");


  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-24 pb-20 md:pt-28 md:pb-24"
    >
      {/* Background — fine grid + radial + particles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(75%_65%_at_50%_20%,black,transparent)]"
      >
        <div
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute -top-40 left-1/2 size-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] size-[520px] rounded-full bg-accent/10 blur-3xl" />
      </div>
      {!reduce && <Particles />}

      <Container>
        <div className="grid items-center gap-16 sm:gap-20 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.35fr)] lg:gap-16 xl:gap-20">
          {/* Copy (right side in RTL) */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 text-center lg:text-start"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>{badge}</span>
            </div>

            <h1
              id="hero-heading"
              className="mt-8 font-semibold tracking-tight text-foreground leading-[1.18] text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[3.5rem]"
            >
              <span className="block whitespace-nowrap">أعـــــــــطِ الخبـــــز لخبّــــــــــازه</span>
              <span className="block whitespace-nowrap mt-[6px]">
                وأعــــطِ <RotatingWord /> لأهلهــــــــــا
              </span>
            </h1>

            <p className="mt-8 max-w-md mx-auto lg:mx-0 text-base leading-[1.9] text-muted-foreground md:text-lg">
              {heroDescLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < heroDescLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <DSButton asChild size="lg" variant="primary">
                <Link to="/work">
                  {ctaPrimaryLabel}
                  <ArrowLeft />
                </Link>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <Link to="/contact" onClick={() => trackEvent("cta_click", { source: "hero_contact" })}>
                  {ctaSecondaryLabel}
                  <ArrowUpRight />
                </Link>
              </DSButton>
            </div>

            {/* Social links */}
            <div className="mt-14 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs text-muted-foreground">تواصل:</span>
              <div className="h-px flex-1 max-w-16 bg-border/60" />
              <ul className="flex items-center gap-2">
                {socials.map((s) => {
                  const Icon = socialIcon[s.label] ?? Mail;
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target={s.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer noopener"
                        aria-label={s.label}
                        className="grid size-11 sm:size-9 place-items-center rounded-full border border-border/60 bg-background/60 text-foreground/80 backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <Icon className="size-4" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* Showcase — bespoke mobile layout, floating windows on desktop */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <div className="lg:hidden">
              <HeroMobile />
            </div>
            <div className="hidden lg:block">
              <HeroWorkspace />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
