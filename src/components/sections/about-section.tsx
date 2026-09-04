import { Container } from "@/components/layout/container";
import { Reveal, SectionReveal } from "@/components/motion/reveal";
import { Sparkles, Code, Palette, Layers, ShoppingBag, Eye } from "lucide-react";
import { site } from "@/config/site";

export function AboutSection() {
  const skills = [
    { name: "Web Development", icon: Code, desc: "تطوير مواقع وتطبيقات حديثة وسريعة" },
    { name: "UI/UX Design", icon: Palette, desc: "تصميم واجهات وتجربة استخدام بديهية" },
    { name: "SaaS & Systems", icon: Layers, desc: "بناء أنظمة ولوحات تحكم سحابية" },
    { name: "E-commerce", icon: ShoppingBag, desc: "متاجر سلة، ووكومرس، وتحسين المبيعات" },
    { name: "Digital Branding", icon: Eye, desc: "هوية بصرية رقمية وأدلة استخدام" },
  ];

  return (
    <SectionReveal id="about" className="relative overflow-hidden border-t border-border/60 py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left / Text Side */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="text-xs font-semibold tracking-wider text-accent uppercase">
                عني
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                وراء كل مشروع شخص يهتم بالتفاصيل.
              </h2>

              <div className="mt-5 space-y-3 text-xs sm:text-sm leading-relaxed text-foreground/85">
                <p>
                  أنا <strong className="text-foreground">{site.name}</strong>، طالب IT ومطور ومصمم مهتم ببناء المنتجات الرقمية وتحويل الأفكار إلى حلول عملية.
                </p>
                <p className="text-muted-foreground">
                  أجمع بين التصميم والتطوير لتكون النتيجة سهلة الاستخدام، سريعة، وقابلة للتطوير المستقبلي، لتستلم منتجًا تفخر باستخدامه وعرضه على عملائك.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs"
                    >
                      <Icon className="size-3.5 text-accent" />
                      <span dir="ltr">{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* Right / Visual Philosophy Card */}
          <div className="lg:col-span-5">
            <Reveal delay={0.08}>
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-muted/20 to-card p-6 sm:p-7 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background font-bold text-base">
                    MH
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{site.name}</h3>
                    <p className="text-xs text-muted-foreground">{site.role}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-xs text-foreground/80 leading-relaxed">
                  <div className="rounded-lg border border-border/60 bg-background/70 p-3">
                    <p className="font-semibold text-foreground">💡 فلسفتي في العمل</p>
                    <p className="mt-0.5 text-muted-foreground">
                      البساطة قبل التعقيد، والحل العملي قبل الاستعراض. كل عنصر في الصفحة يخدم هدفًا واضحًا.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/60 bg-background/70 p-3">
                    <p className="font-semibold text-foreground">🎯 الهدف الأساسي</p>
                    <p className="mt-0.5 text-muted-foreground">
                      مساعدتك على إطلاق فكرتك بأفضل مظهر فني وكفاءة برمجية عالية وبسعر عادل.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{site.location}</span>
                  <span className="inline-flex items-center gap-1 text-accent font-medium">
                    <Sparkles className="size-3" /> متاح للمشاريع
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </SectionReveal>
  );
}
