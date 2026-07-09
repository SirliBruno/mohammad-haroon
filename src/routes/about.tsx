import { Link, createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/reveal";
import { AvailabilityBadge } from "@/components/ds/availability-badge";
import {
  ArrowLeft,
  BookOpen,
  Braces,
  Coffee,
  Compass,
  Download,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Mountain,
  Music,
  Palette,
  Sparkles,
  Store,
  Target,
  Wrench,
  Zap,
} from "lucide-react";

import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";
import {
  DSBadge,
  DSButton,
  DSCard,
  Grid,
  Timeline,
  type TimelineItem,
} from "@/components/ds";
import { profile, values } from "@/data/profile";
import { site } from "@/config/site";
import { personJsonLd } from "@/features/seo/jsonld";

const careerTimeline: TimelineItem[] = [
  {
    date: "2025 — حتى الآن",
    title: "مهندس منتجات مستقل",
    meta: "عمل حر · عن بُعد",
    description:
      "شراكات مع رواد الأعمال لتصميم وإطلاق منتجات ويب متميزة، ومتاجر إلكترونية، وأنظمة تصميم.",
  },
  {
    date: "2024",
    title: "مهندس تصميم",
    meta: "استوديوهات منتجات متخصصة",
    description:
      "قدت أعمال الواجهات عبر لوحات التحكم والمحرّرات والصفحات التسويقية لفرق SaaS في مراحلها المبكرة.",
  },
  {
    date: "2023",
    title: "مطوّر واجهات أمامية",
    meta: "عقود مع وكالات",
    description:
      "أطلقت متاجر Shopify وHeadless لعلامات نمط الحياة والعلامات التجارية المباشرة للمستهلك.",
  },
  {
    date: "2022",
    title: "أول العملاء المستقلين",
    meta: "المساءات ونهايات الأسبوع",
    description:
      "طوّرت صفحات مقصودة ومتاجر صغيرة أثناء الدراسة — بداية عادة استمرت معي.",
  },
];

const education = [
  {
    period: "2022 — حتى الآن",
    title: "بكالوريوس تقنية المعلومات",
    place: "الجامعة · قيد الإتمام",
    detail:
      "تخصص في هندسة البرمجيات، وتفاعل الإنسان مع الحاسب، وأنظمة الويب.",
  },
  {
    period: "2024",
    title: "شهادة مطوّر واجهات أمامية — Meta",
    place: "Meta · Coursera",
    detail: "React، والوصولية، وJavaScript الحديث بمستوى الإنتاج.",
  },
  {
    period: "2024",
    title: "شهادة تصميم تجربة المستخدم — Google",
    place: "Google · Coursera",
    detail: "البحث، والنماذج الأولية، وأساسيات نظام التصميم.",
  },
];

const experiencePillars = [
  {
    icon: Palette,
    title: "التصميم",
    description:
      "واجهات، وتجربة مستخدم، وأنظمة تصميم — من التوكن إلى المكوّن الجاهز للإطلاق.",
    tags: ["UI", "بحث UX", "أنظمة تصميم", "الحركة"],
  },
  {
    icon: Braces,
    title: "الهندسة",
    description:
      "واجهات أمامية بجودة إنتاج باستخدام React وTypeScript، من البداية للنهاية.",
    tags: ["React", "TypeScript", "Next.js", "TanStack"],
  },
  {
    icon: Store,
    title: "التجارة الإلكترونية",
    description:
      "متاجر Shopify وHeadless مُحسَّنة للتحويل والحرفية.",
    tags: ["Shopify", "Stripe", "Headless CMS", "SEO"],
  },
];

const techStack = [
  {
    group: "التصميم",
    icon: Palette,
    items: ["Figma", "Framer", "Rive", "Adobe CC"],
  },
  {
    group: "الواجهات الأمامية",
    icon: Braces,
    items: ["React", "TypeScript", "Next.js", "TanStack Start", "Tailwind CSS"],
  },
  {
    group: "التجارة الإلكترونية وإدارة المحتوى",
    icon: Store,
    items: ["Shopify", "Sanity", "Contentful", "Stripe"],
  },
  {
    group: "العمليات والأدوات",
    icon: Wrench,
    items: ["Vercel", "Cloudflare", "GitHub", "Linear", "Notion"],
  },
];

const workingStyle = [
  {
    icon: Target,
    title: "نطاق مركّز، ونتائج حادّة",
    description:
      "هدف واحد لكل شراكة. إذا لم يمكن وصفه بجملة واحدة، فإنه ليس محدّدًا بعد.",
  },
  {
    icon: MessageCircle,
    title: "التواصل غير المتزامن أولًا",
    description:
      "Loom وLinear وكتابة واضحة. الاجتماعات فقط حين تدفع العمل قُدُمًا.",
  },
  {
    icon: Zap,
    title: "عقلية الإطلاق",
    description:
      "برنامج قابل للعمل من الأسبوع الأول. الزخم يتفوّق على الاجتماعات دائمًا.",
  },
  {
    icon: Layers,
    title: "أنظمة تدوم أطول مني",
    description:
      "توكنز وأنماط وتوثيق تجعل الموظف الجديد يُطلق بنفس سرعتي.",
  },
];

const currentFocus = [
  {
    icon: Sparkles,
    title: "أنظمة تصميم قابلة للتوسّع",
    detail: "توكنز وعناصر تقنية مالية لإصدار الربع الثاني.",
  },
  {
    icon: Zap,
    title: "تجارة إلكترونية على الحافة",
    detail: "متاجر على TanStack Start + Cloudflare.",
  },
  {
    icon: Compass,
    title: "الحركة كلغة تواصل",
    detail: "توثيق كيف تُعبّر الحركة عن الحالة.",
  },
];

const interests = [
  { icon: BookOpen, label: "قراءة المقالات" },
  { icon: Mountain, label: "المشي الطويل" },
  { icon: Coffee, label: "القهوة المختصة" },
  { icon: Music, label: "الموسيقى الهادئة" },
  { icon: Palette, label: "الخط والطباعة" },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: buildMeta({
      title: "نبذة عني",
      description:
        "محمد هارون — مطوّر ويب، مصمم واجهات، ومهندس منتجات رقمية. القصة والرسالة وأسلوب العمل.",
      path: "/about",
      type: "profile",
    }),
    links: [{ rel: "canonical", href: "/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(personJsonLd()),
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="من أنا"
        title={`أنا ${site.shortName}. أُصمّم وأُطوِّر منتجات رقمية بحرفة.`}
        description={profile.bio}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-foreground/85 md:text-lg">
              <p>
                مطوّر ويب، ومصمم واجهات، وطالب في تقنية المعلومات. أبني حلولًا رقميّة لرواد الأعمال والفرق الصغيرة، وأهتمّ بالتفاصيل التي يمرّ عليها غيري بسرعة: البكسل الزائد، والحركة التي تصل بإطار متأخّر، والجملة التي يمكن أن تكون أقصر.
              </p>
              <p>
                معظم عملي في المنطقة الرماديّة بين التصميم والكود: واجهات تبدو مدروسة، تُسلَّم في موعدها، وتصمد أمام المستخدم الحقيقي لا في العروض فقط.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <DSCard variant="surface" padding="lg" className="space-y-6">
              <div>
                <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
                  حاليًا
                </p>
                <div className="mt-3">
                  <AvailabilityBadge
                    available={site.available}
                    label={site.availabilityLabel}
                  />
                </div>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden />
                  {site.location} · أعمل مع فرق حول العالم
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <DSButton asChild size="sm" variant="primary">
                  <Link to="/contact">
                    تواصل معي
                    <ArrowLeft />
                  </Link>
                </DSButton>
                <DSButton asChild size="sm" variant="outline">
                  <a href="/resume.pdf" download>
                    <Download />
                    السيرة الذاتية
                  </a>
                </DSButton>
              </div>
              <div className="border-t border-border/60 pt-5">
                <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
                  حسابات أخرى
                </p>
                <ul className="mt-3 space-y-2">
                  {profile.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        rel="noreferrer"
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {s.label}{" "}
                        <span className="text-muted-foreground">— {s.handle}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </DSCard>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="مسيرتي المهنيّة"
            title="طريق قصير، عن قصد."
            description="أبقيتُ المسار مركّزًا لأتعمّق أكثر — التصميم والكود بمعيار واحد."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                year: "البداية",
                title: "فضول أوّلًا، ثم حرفة",
                body:
                  "بدأتُ بصفحات مقصودة أثناء دراستي في تقنية المعلومات، واكتشفتُ أنّ التصميم يشدّني بقدر ما يشدّني الكود.",
              },
              {
                year: "المنتصف",
                title: "الإطلاق في بيئة الإنتاج",
                body:
                  "متاجر ولوحات تحكّم ومواقع تسويقيّة، مع مستخدمين حقيقيّين ومواعيد لا تتأجّل.",
              },
              {
                year: "الآن",
                title: "منتجات مدروسة، لا كثيرة",
                body:
                  "شراكات مختارة فقط، وتركيز على واجهات تبدو بديهيّة وراقية بلا ضجيج.",
              },
            ].map((chapter) => (
              <DSCard key={chapter.year} variant="surface" padding="lg" className="h-full">
                <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
                  {chapter.year}
                </p>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
                  {chapter.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {chapter.body}
                </p>
              </DSCard>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section className="border-t border-border/60">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionTitle as="h2" eyebrow="المسيرة المهنية" title="الجدول الزمني." />
            <DSCard variant="surface" padding="lg" className="mt-8">
              <Timeline items={careerTimeline} />
            </DSCard>
          </Reveal>

          <Reveal delay={0.05}>
            <SectionTitle as="h2" eyebrow="التعليم" title="الدراسة والشهادات." />
            <ul className="mt-8 space-y-4">
              {education.map((e) => (
                <li key={e.title}>
                  <DSCard variant="surface" padding="lg">
                    <div className="flex items-start gap-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border/60 bg-background text-foreground">
                        <GraduationCap className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
                          {e.period}
                        </p>
                        <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
                          {e.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{e.place}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{e.detail}</p>
                      </div>
                    </div>
                  </DSCard>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="الخبرات"
            title="ثلاثة تخصصات. معيار واحد."
            description="حيث قضيت وقتي وحيث أُقدّم أعلى قيمة."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 3 }} gap="md">
              {experiencePillars.map((p) => {
                const Icon = p.icon;
                return (
                  <DSCard key={p.title} variant="surface" padding="lg" className="h-full">
                    <span className="grid size-10 place-items-center rounded-md border border-border/60 bg-background text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <li key={t}>
                          <DSBadge variant="subtle">{t}</DSBadge>
                        </li>
                      ))}
                    </ul>
                  </DSCard>
                );
              })}
            </Grid>
          </div>
        </Reveal>
      </Section>

      <Section className="border-t border-border/60">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <DSCard variant="surface" padding="lg" className="relative h-full overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-16 -top-16 size-40 rounded-full bg-primary/10 blur-2xl"
              />
              <div className="relative">
                <p className="text-xs font-medium tracking-[0.14em] text-primary">الرسالة</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  مساعدة الشركات على إطلاق منتجات رقمية يستمتع الناس باستخدامها.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  سواء كان موقعًا تسويقيًا، أو متجرًا، أو منتجًا متكاملًا،
                  الرسالة واحدة: واجهات هادئة، ونتائج حادّة، دون شاشات مهدورة.
                </p>
              </div>
            </DSCard>
          </Reveal>
          <Reveal delay={0.05}>
            <DSCard variant="surface" padding="lg" className="relative h-full overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-16 -top-16 size-40 rounded-full bg-accent/10 blur-2xl"
              />
              <div className="relative">
                <p className="text-xs font-medium tracking-[0.14em] text-accent">الرؤية</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  شريك بجودة استوديو حقيقي للفرق التي تعامل البرمجيات كحرفة.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  على المدى الطويل: بناء ممارسة صغيرة ومدروسة معروفة بتفاصيلها —
                  من النوع الذي يمكنك الإشارة إليه دون تحفّظ.
                </p>
              </div>
            </DSCard>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="القيم الأساسية"
            title="مبادئ ألتزم بها."
            description="البوصلة — نفسها في السنة الأولى والسنة الثامنة."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              {values.map((v, i) => (
                <DSCard key={v.title} variant="outline" padding="lg" className="h-full">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono text-muted-foreground" dir="ltr">
                      0{i + 1}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {v.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {v.description}
                  </p>
                </DSCard>
              ))}
            </Grid>
          </div>
        </Reveal>
      </Section>

      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="حاليًا"
            title="ما يشغل اهتمامي هذا الربع."
            description="قائمة قصيرة — تُحدَّث كلما اكتمل شيء."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="mt-10 divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60">
            {currentFocus.map((f) => {
              const Icon = f.icon;
              return (
                <li
                  key={f.title}
                  className="flex items-center gap-4 bg-card px-5 py-5 transition-colors hover:bg-muted/40 md:px-6"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border/60 bg-background text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.detail}</p>
                  </div>
                  <DSBadge variant="subtle">قيد التنفيذ</DSBadge>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Section>

      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="التقنيات"
            title="الأدوات وراء العمل."
            description="مركّز عن قصد. أتعمّق في مجموعة صغيرة من الأدوات بدلًا من التشتّت."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
              {techStack.map((g) => {
                const Icon = g.icon;
                return (
                  <DSCard key={g.group} variant="surface" padding="lg" className="h-full">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <h3 className="text-sm font-semibold tracking-tight text-foreground">
                        {g.group}
                      </h3>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {g.items.map((item) => (
                        <li key={item}>
                          <DSBadge variant="subtle">{item}</DSBadge>
                        </li>
                      ))}
                    </ul>
                  </DSCard>
                );
              })}
            </Grid>
          </div>
        </Reveal>
      </Section>

      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="أسلوب العمل"
            title="كيف يحدث العمل فعلًا."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              {workingStyle.map((w) => {
                const Icon = w.icon;
                return (
                  <DSCard key={w.title} variant="surface" padding="lg" className="h-full">
                    <div className="flex items-start gap-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border/60 bg-background text-primary">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold tracking-tight text-foreground">
                          {w.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {w.description}
                        </p>
                      </div>
                    </div>
                  </DSCard>
                );
              })}
            </Grid>
          </div>
        </Reveal>
      </Section>

      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="خارج العمل"
            title="اهتمامات تُشحن الطاقة."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {interests.map((i) => {
              const Icon = i.icon;
              return (
                <li key={i.label}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-border hover:text-foreground">
                    <Icon className="size-3.5 text-muted-foreground" aria-hidden />
                    {i.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Section>

      <Section className="border-t border-border/60">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-16 md:px-16 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)] bg-linear-to-b from-primary/10 via-accent/5 to-transparent"
            />
            <div className="relative grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
              <div>
                <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
                  الخطوة التالية
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl">
                  اقرأ السيرة الذاتية أو ابدأ محادثة.
                </h2>
                <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
                  حمّل الملف إن كنت تُقيّم للتوظيف، أو أرسل رسالة إن كان لديك
                  مشروع في ذهنك.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <DSButton asChild size="lg" variant="primary">
                  <a href="/resume.pdf" download>
                    <Download />
                    تحميل السيرة الذاتية
                  </a>
                </DSButton>
                <DSButton asChild size="lg" variant="outline">
                  <Link to="/contact">
                    <Mail />
                    تواصل معي
                  </Link>
                </DSButton>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
