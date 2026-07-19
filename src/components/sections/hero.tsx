import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { DSButton } from "@/components/ds";
import { Container } from "@/components/layout/container";
import { HeroWorkspace } from "@/components/sections/hero-workspace";
import { RotatingWord } from "@/components/sections/rotating-word";
import { socials } from "@/config/socials";

const socialIcon: Record<string, typeof Github> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  X: Twitter,
  "البريد الإلكتروني": Mail,
};

// Tiny drifting particles — pure decoration, disabled under reduced motion.
function Particles() {
  const dots = [
    { top: "12%", left: "18%", d: 9 },
    { top: "28%", left: "72%", d: 11 },
    { top: "58%", left: "38%", d: 13 },
    { top: "74%", left: "82%", d: 10 },
    { top: "42%", left: "8%", d: 12 },
    { top: "80%", left: "22%", d: 14 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {dots.map((p, i) => (
        <motion.span
          key={i}
          className="absolute size-1 rounded-full bg-primary/40 shadow-[0_0_12px_rgba(37,99,235,0.5)]"
          style={{ top: p.top, left: p.left }}
          animate={{ y: [0, -14, 0], opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

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
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.35fr)] lg:gap-16 xl:gap-20">
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
              <span>متاح لمشاريع جديدة</span>
            </div>

            <h1
              id="hero-heading"
              className="mt-7 font-semibold tracking-tight text-foreground leading-[1.15] text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[3.5rem]"
            >
              <span className="block whitespace-nowrap">أعـــــــــطِ الخبـــــز لخبّــــــــــازه</span>
              <span className="block whitespace-nowrap">
                وأعــــطِ <RotatingWord /> لأهلهــا
              </span>
            </h1>

            <p className="mt-6 max-w-lg mx-auto lg:mx-0 text-base leading-relaxed text-muted-foreground md:text-lg">
              أصمم وأطور مواقع وأنظمة رقمية تجمع بين التصميم الاحترافي، وسهولة الاستخدام، والأداء السريع. سواء كنت تطلق مشروع جديد أو تطور مشروع قائم، هدفي إني أبني لك منتج يخدمك ويعطي عملاءك تجربة تليق باسمك.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <DSButton asChild size="lg" variant="primary">
                <Link to="/work">
                  استعرض الأعمال
                  <ArrowLeft />
                </Link>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <Link to="/contact">
                  عندك فكرة ؟
                  <ArrowUpRight />
                </Link>
              </DSButton>
            </div>

            {/* Social links */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-3">
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
                        className="grid size-9 place-items-center rounded-full border border-border/60 bg-background/60 text-foreground/80 backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <Icon className="size-4" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* Carousel (left side in RTL) */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <HeroWorkspace />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
