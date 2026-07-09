import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { DSButton } from "@/components/ds";
import { Container } from "@/components/layout/container";
import { site } from "@/config/site";
import { socials } from "@/config/socials";

const socialIcon: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
  X: Twitter,
};

const stats = [
  { value: "5+", label: "Websites shipped" },
  { value: "10+", label: "E-commerce stores" },
  { value: "Multiple", label: "Companies served" },
  { value: "Open", label: "For freelance" },
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24"
    >
      {/* Animated grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(75%_60%_at_50%_35%,black,transparent)]"
      >
        <div
          className="absolute inset-0 opacity-[0.22] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {!reduce && (
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundPositionX: 0, backgroundPositionY: 0 }}
            animate={{ backgroundPositionX: 56, backgroundPositionY: 56 }}
            transition={{ duration: 22, ease: "linear", repeat: Infinity }}
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in oklab, var(--color-primary) 22%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-primary) 22%, transparent) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              opacity: 0.08,
              maskImage:
                "radial-gradient(40% 40% at 30% 30%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(40% 40% at 30% 30%, black, transparent)",
            }}
          />
        )}
      </div>

      {/* Floating gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-24 -left-24 size-[520px] rounded-full bg-primary/20 blur-3xl"
          style={{ willChange: "transform, opacity" }}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={reduce ? {} : { opacity: [0.35, 0.55, 0.35], scale: [1, 1.05, 1], x: [0, 24, 0], y: [0, 16, 0] }}
          transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 right-[-10%] size-[560px] rounded-full bg-accent/20 blur-3xl"
          style={{ willChange: "transform, opacity" }}
          initial={{ opacity: 0.4, scale: 1 }}
          animate={reduce ? {} : { opacity: [0.3, 0.5, 0.3], scale: [1, 1.07, 1], x: [0, -20, 0], y: [0, -18, 0] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity, delay: 1.2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
          style={{ willChange: "opacity" }}
          initial={{ opacity: 0.3 }}
          animate={reduce ? {} : { opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          {/* LEFT — copy */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Hello — I'm {site.shortName}</span>
            </div>

            <h1
              id="hero-heading"
              className="mt-6 text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl lg:leading-[1.05]"
            >
              Building{" "}
              <span className="text-gradient-brand">Digital Products</span> That
              Help Businesses Grow.
            </h1>

            <p className="mt-4 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {site.name} — IT Student · Web Developer · UI Designer
            </p>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              IT Student, Web Developer, UI Designer and Digital Solutions
              Specialist helping businesses build premium websites, e-commerce
              stores and digital experiences.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <DSButton asChild size="lg" variant="primary">
                <Link to="/work">
                  View Projects
                  <ArrowRight />
                </Link>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <a href="/resume.pdf" download>
                  <Download />
                  Download Resume
                </a>
              </DSButton>
              <DSButton asChild size="lg" variant="ghost">
                <Link to="/contact">
                  Hire Me
                  <ArrowUpRight />
                </Link>
              </DSButton>
            </div>

            {/* Socials */}
            <div className="mt-10 flex items-center gap-5">
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Follow
              </span>
              <span aria-hidden className="h-px w-8 bg-border" />
              <ul className="flex items-center gap-1">
                {socials.map((s) => {
                  const Icon = socialIcon[s.label] ?? Mail;
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        rel="noreferrer"
                        aria-label={`${s.label} — ${s.handle}`}
                        className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Icon className="size-4" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* RIGHT — portrait */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative aspect-[4/5] w-full">
              {/* Decorative frame */}
              <div
                aria-hidden
                className="absolute -inset-4 rounded-3xl bg-linear-to-br from-primary/25 via-accent/15 to-transparent blur-2xl"
              />
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lg">
                {/* Portrait placeholder */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, color-mix(in oklab, var(--color-foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-foreground) 6%, transparent) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/70" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="mx-auto grid size-28 place-items-center rounded-full border border-border bg-background/70 backdrop-blur-md">
                      <span className="text-2xl font-semibold tracking-tight text-foreground">
                        MH
                      </span>
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Portrait
                    </p>
                  </div>
                </div>

                {/* Floating chips */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute left-4 top-4 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground backdrop-blur-md"
                >
                  {site.location}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground backdrop-blur-md"
                >
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Available
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.5 }}
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-border/70 bg-background/85 px-3 py-2 text-xs backdrop-blur-md"
                >
                  <span className="font-medium text-foreground">{site.role}</span>
                  <span className="text-muted-foreground">{site.availabilityLabel}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.dl
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:mt-20 md:grid-cols-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="group bg-background px-5 py-6 transition-colors hover:bg-muted/40 md:px-6 md:py-8"
            >
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {s.label}
              </dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {s.value}
              </dd>
            </div>
          ))}
        </motion.dl>

        {/* Scroll indicator */}
        <div className="mt-12 hidden justify-center md:flex">
          <a
            href="#work"
            aria-label="Scroll to work"
            className="group inline-flex flex-col items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Scroll</span>
            <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-border/70">
              <motion.span
                className="mt-1.5 h-2 w-1 rounded-full bg-foreground/70"
                animate={reduce ? {} : { y: [0, 10, 0], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
              />
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
