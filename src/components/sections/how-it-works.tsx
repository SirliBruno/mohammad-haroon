import { Container } from "@/components/layout/container";
import { Reveal, SectionReveal } from "@/components/motion/reveal";
import { Lightbulb, Compass, Palette, Code2, Rocket } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "الفكرة",
      description: "ترسل لي فكرتك واحتياجك الأساسي، ونتناقش حول أهداف المشروع والمشكلة المطلوب حلها.",
      icon: Lightbulb,
    },
    {
      step: "02",
      title: "التصور",
      description: "نحدد معًا الخصائص الضرورية، هيكل الصفحات، الجدول الزمني، وأنسب طريقة لتنفيذها.",
      icon: Compass,
    },
    {
      step: "03",
      title: "التصميم",
      description: "أصمم تجربة استخدام وواجهة مخصصة وواضحة تركز على سهولة الاستخدام والجمال البصري.",
      icon: Palette,
    },
    {
      step: "04",
      title: "التطوير",
      description: "أحوّل التصميم إلى كود نظيف، سريع، وآمن يعمل بشكل ممتاز على كل الأجهزة والشاشات.",
      icon: Code2,
    },
    {
      step: "05",
      title: "الإطلاق",
      description: "نسلّمك المشروع جاهزًا للعمل مع توفير الدعم الفني وضمان قابلية التوسع لأي مراحل مستقبلية.",
      icon: Rocket,
    },
  ];

  return (
    <SectionReveal id="how-it-works" className="border-t border-border/60 py-20 sm:py-28 relative">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-wider text-accent uppercase">
              منهجية العمل
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              من الفكرة إلى الإطلاق.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              خطوات واضحة ومنظمة تضمن لك راحة البال ومعرفة أين وصل مشروعك في كل لحظة.
            </p>
          </div>
        </Reveal>

        <div className="mt-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.step} delay={idx * 0.08}>
                  <div className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 hover:shadow-lg h-full">
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-xs font-bold tracking-widest text-accent"
                          dir="ltr"
                        >
                          {item.step}
                        </span>
                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                          <Icon className="size-4" />
                        </div>
                      </div>

                      <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-border/40 text-[11px] text-muted-foreground/80">
                      مرحلة {idx + 1} من 5
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </SectionReveal>
  );
}
