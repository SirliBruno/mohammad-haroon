import { Container } from "@/components/layout/container";
import { Reveal, SectionReveal } from "@/components/motion/reveal";
import { ShoppingCart, Server, Rocket } from "lucide-react";

export function SocialProof() {
  const metrics = [
    {
      value: "10+",
      label: "متاجر مصممة ومطورة",
      sublabel: "تحسين تجربة وتصميم صفحات البيع",
      icon: ShoppingCart,
    },
    {
      value: "عدة مشاريع",
      label: "مواقع وأنظمة مخصصة",
      sublabel: "منصات ولوحات تحكم قيد الاستخدام",
      icon: Server,
    },
    {
      value: "MVP",
      label: "من الفكرة إلى نسخة قابلة للتجربة",
      sublabel: "نماذج أولية جاهزة للاختبار الفعلي",
      icon: Rocket,
    },
  ];

  return (
    <SectionReveal className="border-y border-border/60 bg-muted/30 py-10 sm:py-12">
      <Container>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
            <div>
              <p className="text-xs font-semibold tracking-wider text-accent uppercase">
                ما أبنيه
              </p>
              <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
                أرقام ونتائج حقيقية من مشاريع فعلية
              </h2>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm">
              تركيز كامل على بناء منتجات وحلول رقمية تخدم العمل مباشرة وتحقق أهدافه.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={idx * 0.1}>
                <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6 shadow-xs transition-all hover:border-accent/30 hover:shadow-md">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {item.value}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-foreground/90">
                      {item.label}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {item.sublabel}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </SectionReveal>
  );
}
