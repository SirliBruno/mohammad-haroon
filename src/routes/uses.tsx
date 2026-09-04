import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export const Route = createFileRoute("/uses")({
  head: () => ({
    meta: buildMeta({
      title: "أدواتي | محمد هارون",
      description: "الأدوات والبرامج والمعدّات التي أستخدمها في العمل اليومي.",
      path: "/uses",
    }),
  }),
  component: UsesPage,
});

type Tool = { name: string; description: string; url?: string };
type Category = { title: string; tools: Tool[] };

const STACK: Category[] = [
  {
    title: "التصميم",
    tools: [
      { name: "Figma", description: "تصميم واجهات المستخدم وأنظمة التصميم والنماذج الأولية التفاعلية.", url: "https://figma.com" },
      { name: "Adobe Illustrator", description: "الهويات البصرية والرسومات المتجهية." },
      { name: "Framer", description: "نماذج أولية متحركة وصفحات تسويقية سريعة." },
    ],
  },
  {
    title: "التطوير",
    tools: [
      { name: "React / TanStack Start", description: "بناء واجهات الويب وتطبيقات SSR السريعة." },
      { name: "Tailwind CSS", description: "تصميم متجاوب وسريع بدون الخروج من الكود." },
      { name: "Supabase", description: "قاعدة بيانات PostgreSQL مُدارة، مصادقة، وتخزين ملفات." },
      { name: "TypeScript", description: "اكتشاف الأخطاء مبكراً وكود أوضح وأكثر موثوقية." },
      { name: "Vite", description: "بيئة تطوير فائقة السرعة للمشاريع الحديثة." },
    ],
  },
  {
    title: "محرر الكود والطرفية",
    tools: [
      { name: "VS Code", description: "محرر الكود الرئيسي مع امتدادات مختارة بدقة.", url: "https://code.visualstudio.com" },
      { name: "Antigravity (AGY)", description: "مساعد البرمجة الذكي لتسريع التطوير وفهم الكود." },
      { name: "Windows Terminal", description: "سطر الأوامر مع Bash وPowerShell." },
    ],
  },
  {
    title: "الإنتاجية والتواصل",
    tools: [
      { name: "Notion", description: "إدارة المشاريع والعملاء والمحتوى في مكان واحد." },
      { name: "Linear", description: "تتبع المهام والمشاريع البرمجية." },
      { name: "WhatsApp Business", description: "التواصل الأساسي مع العملاء." },
      { name: "Loom", description: "تسجيل شاشة سريع لإيصال الأفكار للعملاء بوضوح." },
    ],
  },
  {
    title: "الاستضافة والنشر",
    tools: [
      { name: "Vercel", description: "نشر تطبيقات الويب بسرعة مع CI/CD تلقائي." },
      { name: "Cloudflare", description: "DNS، حماية، وتسريع المواقع." },
    ],
  },
  {
    title: "المعدات",
    tools: [
      { name: "جهاز كمبيوتر مكتبي", description: "للعمل الجاد — تطوير وتصميم وعروض تقديمية." },
      { name: "Samsung S25 Ultra", description: "للاختبار على شاشات Android عالية الدقة وعمل عن بُعد." },
      { name: "شاشة 27 بوصة 4K", description: "دقة عالية لملاحظة كل التفاصيل في التصميم." },
    ],
  },
];

function UsesPage() {
  return (
    <>
      <PageHeader
        eyebrow="بيئة العمل"
        title="الأدوات"
        description="الأدوات، البرامج، والمعدّات التي أستخدمها يوميًا في تصميم المنتجات وتطويرها."
      />

      <Section>
        <Container>
          <div className="max-w-3xl mx-auto flex flex-col gap-12">
            {STACK.map((cat, ci) => (
              <Reveal key={cat.title} delay={ci * 0.05}>
                <div>
                  <h2 className="mb-4 text-xs font-bold tracking-widest text-accent uppercase">
                    {cat.title}
                  </h2>
                  <div className="flex flex-col divide-y divide-border/60">
                    {cat.tools.map((tool) => (
                      <div key={tool.name} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-4">
                        <div className="sm:w-48 shrink-0">
                          {tool.url ? (
                            <a
                              href={tool.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-foreground hover:text-accent transition-colors underline-offset-2 hover:underline"
                            >
                              {tool.name}
                            </a>
                          ) : (
                            <span className="font-semibold text-foreground">{tool.name}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                          {tool.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
