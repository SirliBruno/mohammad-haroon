import { Container } from "@/components/layout/container";
import { Reveal, SectionReveal } from "@/components/motion/reveal";
import { smoothScrollTo } from "@/components/layout/smooth-scroll";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { useHomeContent, getHomeText } from "@/lib/cms/home-content";

export function FinalCTA() {
  const { data: homeContent } = useHomeContent();
  const t = (key: string, fallback: string) => getHomeText(homeContent, key, fallback);

  const scrollTo = (id: string) => {
    smoothScrollTo(`#${id}`);
  };

  return (
    <SectionReveal className="border-t border-border/60 py-24 sm:py-32 relative overflow-hidden bg-card">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-3xl"
      />

      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
              <Sparkles className="size-3.5" /> الخطوة القادمة
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("home.cta.title", "جاهز تحوّل فكرتك إلى مشروع فعلي؟")}
            </h2>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto">
              {t(
                "home.cta.description",
                "تواصل معي اليوم، ونحدد موعد لمناقشة فكرتك والحل الأنسب لها مجانًا وبدون أي التزام.",
              )}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => scrollTo("contact-form")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:opacity-95 hover:shadow-xl cursor-pointer"
              >
                {t("home.cta.primary_label", "ابدأ مشروعك الآن")}
                <ArrowLeft className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo("work")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-7 py-4 text-base font-medium text-foreground transition-all hover:bg-muted cursor-pointer"
              >
                {t("home.cta.secondary_label", "شاهد أعمالي")}
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </Reveal>
      </Container>
    </SectionReveal>
  );
}
