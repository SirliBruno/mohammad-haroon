import { Container } from "@/components/layout/container";
import { Reveal, SectionReveal } from "@/components/motion/reveal";
import { smoothScrollTo } from "@/components/layout/smooth-scroll";
import { Check, ArrowLeft, Sparkles, Info } from "lucide-react";

export function Offer300() {
  const scrollToContact = () => {
    smoothScrollTo("#contact-form");
  };

  const startingExamples = [
    "صفحة هبوط (Landing Page) لخدمة أو منتج",
    "موقع تعريفي بسيط للشركات أو الأفراد",
    "تصميم واجهة مستخدم (UI/UX) لصفحة أو ميزة",
    "تحسينات محددة وإصلاحات على موقع قائم",
    "إعداد أو تعديل متجر بسيط حسب النطاق المطلوب",
  ];

  return (
    <SectionReveal id="offer" className="relative overflow-hidden border-t border-border/60 py-16 sm:py-24">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/6 blur-3xl"
      />

      <Container>
        <Reveal>
          <div className="mx-auto max-w-4xl rounded-2xl border border-accent/30 bg-card p-6 sm:p-10 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent">
                <Sparkles className="size-3.5" /> عرض البداية السريعة
              </span>
              <span className="text-xs text-muted-foreground">تسعير شفاف وواضح قبل البدء</span>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  ابدأ من <span className="text-accent">300 ريال</span>
                </h2>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-foreground/80">
                  الصفحات والمشاريع البسيطة يمكن تنفيذها بالكامل بهذا السعر. أما المتاجر المتكاملة والأنظمة المخصصة فيتم تحديد تكلفتها بدقة ومسبقًا بحسب حجم العمل دون أي مبالغ مخفية.
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={scrollToContact}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 cursor-pointer"
                  >
                    أرسل فكرتك لتحديد السعر
                    <ArrowLeft className="size-4" />
                  </button>
                </div>
              </div>

              {/* Examples Checklist */}
              <div className="lg:col-span-6 rounded-xl border border-border/80 bg-background/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  أمثلة على مشاريع قد تبدأ من 300 ريال:
                </p>

                <ul className="mt-3 space-y-2">
                  {startingExamples.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90">
                      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check className="size-2.5 stroke-[2.5]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-start gap-1.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  <Info className="size-3.5 shrink-0 text-accent mt-0.5" />
                  <span>
                    <strong>تنبيه:</strong> السعر النهائي يعتمد على عدد الصفحات والخصائص والتكاملات المطلوبة.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </SectionReveal>
  );
}
