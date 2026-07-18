import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";
import { DSButton } from "@/components/ds";
import { Container } from "@/components/layout/container";
import { ProjectsShowcase3D } from "@/components/sections/projects-showcase-3d";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
    >
      {/* Subtle backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(70%_60%_at_50%_20%,black,transparent)]"
      >
        <div
          className="absolute inset-0 opacity-[0.14] dark:opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute -top-32 left-1/2 size-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          {/* Left: copy */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>متاح لمشاريع جديدة</span>
            </div>

            <h1
              id="hero-heading"
              className="mt-6 text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl lg:leading-[1.1]"
            >
              أُساعد الشركات على بناء{" "}
              <span className="text-gradient-brand">منتجات رقمية أفضل</span>.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              أُصمّم وأُطوّر مواقع حديثة ومتاجر إلكترونية وحلولًا رقمية تُركّز على الأداء، وتجربة المستخدم، ونموّ الأعمال.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <DSButton asChild size="lg" variant="primary">
                <Link to="/work">
                  استعرض أعمالي
                  <ArrowLeft />
                </Link>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <a href="/resume.pdf" download>
                  <Download />
                  تحميل السيرة الذاتية
                </a>
              </DSButton>
              <DSButton asChild size="lg" variant="ghost">
                <Link to="/contact">
                  تواصل معي
                  <ArrowUpRight />
                </Link>
              </DSButton>
            </div>
          </motion.div>

          {/* Right (visually left in RTL): projects 3D showcase */}
          <div className="min-w-0">
            <ProjectsShowcase3D />
          </div>
        </div>
      </Container>
    </section>
  );
}
