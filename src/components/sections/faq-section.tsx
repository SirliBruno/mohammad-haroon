import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FaqSection() {
  const faqs = [
    {
      q: "هل كل المشاريع بـ300 ريال؟",
      a: "لا. بعض المشاريع والصفحات البسيطة يمكن تنفيذها بهذا السعر، بينما المشاريع الأكبر والأنظمة يتم تسعيرها بشفافية وبناءً على حجم المتطلبات والمزايا المطلوبة قبل البدء.",
    },
    {
      q: "هل لازم أعرف بالضبط وش أحتاج؟",
      a: "لا، أبدًا. حتى لو عندك فكرة عامة فقط، أرسلها وسنتناقش معًا ونحدد أنسب وأبسط حل تقني يلبي هدفك.",
    },
    {
      q: "هل تطور أنظمة مخصصة؟",
      a: "نعم. أصمم وأطور أنظمة سحابية، لوحات تحكم (Dashboards)، أنظمة حجوزات، اشتراكات، وإدارة بيانات مخصصة حسب طبيعة عملك.",
    },
    {
      q: "هل أقدر أطلب تطوير موقع موجود؟",
      a: "نعم. يمكنك طلب إعادة تصميم موقعك الحالي، تحسين سرعته وأدائه، إصلاح المشاكل البرمجية، أو إضافة خصائص جديدة.",
    },
    {
      q: "هل توفر تصميم فقط بدون برمجة؟",
      a: "نعم. أقدم خدمات تصميم واجهات وتجربة المستخدم (UI/UX) على Figma، مع تسليم ملفات منظمة وقابلة للبرمجة من قِبل أي مطور.",
    },
    {
      q: "هل الـMVP فعلًا خلال يوم؟",
      a: "للمشاريع المناسبة ذات النطاق المحدد، نعم. تعتمد المدة الزمنية الدقيقة على حجم الفكرة وعدد الوظائف الأساسية المطلوبة.",
    },
  ];

  return (
    <section id="faq" className="border-t border-border/60 py-20 sm:py-28 bg-muted/20 relative">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Header */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider">
                <HelpCircle className="size-4" />
                الأسئلة الشائعة
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                إجابات على أكثر الأسئلة تكرارًا
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                إذا كان لديك أي استفسار آخر لم تجده هنا، لا تتردد في مراسلتي وسأجيبك بكل سرور.
              </p>
            </Reveal>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqs.map((item, i) => (
                  <AccordionItem
                    key={item.q}
                    value={`item-${i}`}
                    className="rounded-2xl border border-border/70 bg-card px-5 shadow-2xs"
                  >
                    <AccordionTrigger className="text-right text-sm sm:text-base font-bold text-foreground hover:no-underline py-4.5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-5 border-t border-border/40 pt-3">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
