import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { DSButton } from "@/components/ds";
import { Container } from "@/components/layout/container";
import { ProjectsShowcase3D } from "@/components/sections/projects-showcase-3d";

const stats = [
  { value: "+٥٠", label: "مشروع مُنجَز" },
  { value: "+٧", label: "سنوات خبرة" },
  { value: "٩٨٪", label: "رضا العملاء" },
];

const marquee = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Supabase",
  "WordPress",
  "WooCommerce",
  "Figma",
  "Node.js",
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24"
    >
      {/* Layered backdrop: grid + radial glow + noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(75%_65%_at_50%_15%,black,transparent)]"
      >
        <div
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute -top-40 start-1/2 size-[820px] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]" />
        <div className="absolute top-1/3 end-0 size-[420px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left: copy */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            {/* Availability badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-foreground/80">متاح لمشاريع جديدة</span>
              <span className="text-border">•</span>
              <span>الرياض · بتوقيت +٣</span>
            </div>

            {/* Eyebrow */}
            <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" aria-hidden />
              <span>مطوّر ومصمم منتجات</span>
            </div>

            {/* Display headline */}
            <h1
              id="hero-heading"
              className="mt-4 text-5xl font-semibold tracking-tight text-foreground text-balance sm:text-6xl md:text-7xl lg:text-[5.25rem] lg:leading-[0.98]"
              style={{ letterSpacing: "-0.02em" }}
            >
              أبني منتجات رقمية
              <br />
              <span className="text-gradient-brand">تُحرِّك الأعمال</span>.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              من الفكرة إلى الإطلاق — أُصمّم وأُطوّر تجارب ويب سريعة، أنيقة،
              ومُهيّأة للنموّ.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <DSButton asChild size="lg" variant="primary">
                <Link to="/work">
                  استعرض أعمالي
                  <ArrowLeft />
                </Link>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <Link to="/contact">
                  ابدأ مشروعًا
                  <ArrowUpRight />
                </Link>
              </DSButton>
            </div>

            {/* Stats strip */}
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-6">
              {stats.map((s) => (
                <div key={s.label} className="min-w-0">
                  <dt className="sr-only">{s.label}</dt>
                  <dd
                    className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {s.value}
                  </dd>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                    {s.label}
                  </p>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Right: projects 3D showcase */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <ProjectsShowcase3D />
          </motion.div>
        </div>

        {/* Tech marquee */}
        <div
          className="relative mt-16 overflow-hidden border-y border-border/60 py-5 md:mt-20"
          aria-hidden
        >
          <div
            className="pointer-events-none absolute inset-y-0 start-0 z-10 w-24 bg-gradient-to-e from-background to-transparent"
            style={{
              // logical gradient for RTL support
              background:
                "linear-gradient(to left, transparent, var(--color-background))",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 end-0 z-10 w-24"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--color-background))",
            }}
          />
          <div className="flex gap-12 whitespace-nowrap animate-[marquee_38s_linear_infinite] [--gap:3rem]">
            {[...marquee, ...marquee].map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="text-sm font-medium tracking-wide text-muted-foreground/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
