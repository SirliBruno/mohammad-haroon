import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { HeroWorkspace } from "./hero-workspace";
import { HeroMobile } from "./hero-mobile";
import { site } from "@/config/site";

export function Hero() {
  const reduce = useReducedMotion();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-18 lg:pb-28"
    >
      {/* Subtle Background Lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[650px] -translate-x-1/2 rounded-full bg-accent/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-20 -z-10 size-[420px] rounded-full bg-accent/5 blur-3xl"
      />

      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Text & Pitch Side */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 text-center lg:text-right"
          >
            {/* Top Badge: 300 SAR Starter & Availability */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent shadow-2xs">
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              <span>مشاريع تبدأ من {site.startingPrice}</span>
              <span className="text-accent/50">·</span>
              <span className="text-foreground/80 font-normal">{site.availabilityLabel}</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-heading"
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance leading-[1.25]"
            >
              من <span className="text-accent relative inline-block">فكرة</span> في بالك
              <br />
              إلى <span className="text-foreground">مشروع</span> تقدر تستخدمه.
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed text-muted-foreground">
              أصمم وأطوّر مواقع، متاجر وأنظمة إلكترونية مخصصة تخدم هدفك وتزيد مبيعاتك — من الفكرة إلى الإطلاق.
            </p>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={() => scrollToSection("contact-form")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-95 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] cursor-pointer"
              >
                ابدأ مشروعك الآن
                <ArrowLeft className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("work")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                شاهد أعمالي
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </button>
            </div>

            {/* Microcopy */}
            <p className="mt-3 text-xs text-muted-foreground max-w-md mx-auto lg:mx-0">
              لا تعرف بالضبط وش تحتاج؟ أرسل فكرتك ونحدد الحل المناسب لها معًا.
            </p>

            {/* Trust Points */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 border-t border-border/60 pt-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="size-3.5 text-accent" />
                <span>تسعير واضح قبل البدء</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Zap className="size-3.5 text-accent" />
                <span>تسليم سريع وجودة عالية</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles className="size-3.5 text-accent" />
                <span>تصميم وتطوير مخصص</span>
              </div>
            </div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 min-w-0"
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
