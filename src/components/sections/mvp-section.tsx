import { Container } from "@/components/layout/container";
import { Reveal, SectionReveal } from "@/components/motion/reveal";
import { smoothScrollTo } from "@/components/layout/smooth-scroll";
import { Rocket, Zap, Clock, CheckCircle2, ArrowLeft } from "lucide-react";

export function MvpSection() {
  const scrollToContact = () => {
    smoothScrollTo("#contact-form");
  };

  const deliverables = [
    "واجهة مستخدم تفاعلية",
    "وظائف وعمليات أساسية حية",
    "قاعدة بيانات سحابية عند الحاجة",
    "لوحة تحكم حسب نوع المشروع",
    "بنية برمجية قابلة للتوسع المباشر",
  ];

  return (
    <SectionReveal className="relative overflow-hidden border-t border-border/60 py-20 sm:py-28 bg-gradient-to-b from-card via-background to-card">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-5xl rounded-3xl border border-accent/25 bg-linear-to-br from-card via-muted/20 to-accent/5 p-8 sm:p-14 shadow-xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1 text-xs font-bold text-accent">
                <Zap className="size-3.5" /> مسار الـ MVP السريع
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5 text-accent" /> سرعة انتقال من الفكرة للتجربة
              </span>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                  عندك فكرة كبيرة؟
                  <br />
                  <span className="text-accent">خلنا نشوفها على أرض الواقع.</span>
                </h2>

                <div className="mt-4 inline-block rounded-lg bg-accent/10 px-3 py-1.5 text-xs sm:text-sm font-semibold text-accent">
                  MVP للمشاريع المناسبة خلال يوم واحد
                </div>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                  بدل ما تنتظر أسابيع وشهور عشان تشوف فكرتك، نقدر نحولها إلى نسخة أولية عملية تساعدك تجربها، تعرضها على المستثمرين أو العملاء، وتقرر كيف تطورها لاحقًا.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={scrollToContact}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90"
                  >
                    ابدأ بناء الـ MVP
                    <ArrowLeft className="size-4" />
                  </button>
                  <span className="text-xs text-muted-foreground">
                    * مدة تنفيذ الـMVP تعتمد على حجم الفكرة والمتطلبات.
                  </span>
                </div>
              </div>

              {/* Deliverables Card */}
              <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Rocket className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      محتويات النسخة الأولية (MVP)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      نسخة حقيقية قابلة للتجربة
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3 border-t border-border/50 pt-5">
                  {deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90">
                      <CheckCircle2 className="size-4 text-accent shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </SectionReveal>
  );
}
