import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Braces,
  Compass,
  Figma,
  Layers,
  Lightbulb,
  Palette,
  Server,
  ShieldCheck,
  Sparkles,
  Store,
  Wrench,
  Zap,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/typography/eyebrow";

import { buildMeta } from "@/features/seo/build-meta";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";
import { Hero } from "@/components/sections/hero";
import {
  CertificateCard,
  DSButton,
  DSCard,
  DSBadge,
  Grid,
  ProjectCard,
  ServiceCard,
  TestimonialQuote,
  Timeline,
  type Certificate,
  type TimelineItem,
} from "@/components/ds";
import { site } from "@/config/site";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { articles } from "@/data/writing";

const trustedCompanies = [
  "أرامكو",
  "STC",
  "نون",
  "طلبات",
  "علم",
  "الراجحي",
  "ثمانية",
  "مرسول",
];

const statistics = [
  { value: "+5", label: "موقع تم إطلاقه", hint: "تسويقي ومنتجات" },
  { value: "+10", label: "متجر إلكتروني", hint: "Shopify ومخصص" },
  { value: "متعدّدة", label: "شركات تعاملت معها", hint: "من ناشئة إلى وكالات" },
  { value: "متاح", label: "لاستقبال المشاريع", hint: "أماكن محدودة للربع القادم" },
];

const skillGroups = [
  {
    title: "التصميم",
    icon: Palette,
    items: ["تصميم واجهات", "بحث UX", "أنظمة تصميم", "نماذج أولية", "الحركة"],
  },
  {
    title: "الواجهات الأمامية",
    icon: Braces,
    items: ["React", "TypeScript", "Next.js", "TanStack", "Tailwind CSS"],
  },
  {
    title: "التجارة الإلكترونية",
    icon: Store,
    items: ["Shopify", "Stripe", "Headless CMS", "SEO", "التحليلات"],
  },
  {
    title: "الأدوات",
    icon: Wrench,
    items: ["Figma", "Framer", "Git", "Linear", "Vercel"],
  },
];

const certificates: Certificate[] = [
  { title: "مطوّر واجهات أمامية — Meta", issuer: "Meta", issuedAt: "2025" },
  { title: "تصميم تجربة المستخدم — Google", issuer: "Google", issuedAt: "2024" },
  { title: "شهادة شريك Shopify", issuer: "Shopify", issuedAt: "2024" },
  { title: "أنماط React المتقدمة", issuer: "Frontend Masters", issuedAt: "2024" },
  { title: "Figma لتصميم المنتجات", issuer: "Config", issuedAt: "2023" },
  { title: "أنظمة التصميم عمليًا", issuer: "Interaction Design", issuedAt: "2023" },
];

const timeline: TimelineItem[] = [
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
    title: "بداية دراسة تقنية المعلومات",
    meta: "بكالوريوس تقنية المعلومات",
    description:
      "بدأت الدراسة الأكاديمية بالتوازي مع العمل الحر. التصميم أولًا، ثم الكود.",
  },
];

const currentFocus = [
  {
    icon: Zap,
    title: "أنظمة تصميم قابلة للتوسّع",
    description:
      "بناء التوكنز والعناصر والأنماط لإصدار جديد لمنتج في قطاع التقنية المالية.",
  },
  {
    icon: Server,
    title: "تجارة إلكترونية على الحافة",
    description:
      "بناء متاجر تجريبية على TanStack Start وCloudflare — سلات أسرع، وكود أنظف.",
  },
  {
    icon: Sparkles,
    title: "الحركة كلغة تواصل",
    description:
      "توثيق نظام حركة يجعل الأنيميشن يُعبّر عن الحالة لا مجرد زخرفة.",
  },
];

const ideas = [
  {
    icon: Lightbulb,
    tag: "تجربة",
    title: "تحليلات هادئة",
    description:
      "لوحة تخبرك بما تغيّر — في جملة واحدة — بدلًا من إغراقك بالرسوم البيانية.",
  },
  {
    icon: Compass,
    tag: "تصوّر",
    title: "نظام رائد الأعمال",
    description:
      "واجهة واحدة لأهم ثلاثة أشياء يفعلها المؤسّس: يتحدث مع المستخدمين، يُطلق، ويقرّر.",
  },
  {
    icon: Layers,
    tag: "نموذج أولي",
    title: "وصفات مكوّنات",
    description:
      "مكتبة من وصفات shadcn الجاهزة — انسخ، الصق، أطلق. دون إعادة كتابة أي كود.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildMeta({
      description: site.description,
      path: "/",
    }),
  }),
  component: Home,
});

function Home() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const topServices = services.slice(0, 3);
  const recentPosts = articles.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <>
      <Hero />

      <Section
        id="trusted"
        size="sm"
        ariaLabelledby="trusted-heading"
        className="border-t border-border/60"
      >
        <Reveal>
          <Eyebrow className="mx-auto justify-center" id="trusted-heading">
            شركات ومنتجات وثقت بأعمالنا
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <ul
            role="list"
            className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-6 opacity-80 sm:grid-cols-4 md:grid-cols-8"
          >
            {trustedCompanies.map((name) => (
              <li
                key={name}
                className="text-center text-sm font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground"
              >
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>


      <Section id="stats" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="بالأرقام"
            title="سِجلّ عمل هادئ ومؤثّر."
            description="أرقام متزنة ونتائج حادّة. كل شراكة موجّهة نحو نتيجة محدّدة."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-4">
            {statistics.map((s) => (
              <div
                key={s.label}
                className="group bg-background p-6 transition-colors hover:bg-muted/40 md:p-8"
              >
                <dt className="text-xs tracking-[0.14em] text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {s.value}
                </dd>
                <p className="mt-2 text-xs text-muted-foreground">{s.hint}</p>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <Section id="services" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="الخدمات"
            title="كيف يمكننا العمل معًا."
            description="جلسات مركّزة، وعقود شهرية، واستشارات — كل خدمة مصممة لتحقيق نتيجة محدّدة، لا لملء الجدول."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/services">
                  جميع الخدمات
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 3 }} gap="md">
              {topServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </Grid>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex justify-center">
            <DSButton asChild variant="outline" size="lg">
              <Link to="/services">
                استعرض كل الخدمات
                <ArrowLeft />
              </Link>
            </DSButton>
          </div>
        </Reveal>
      </Section>

      <Section id="work" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="أعمال مختارة"
            title="مشاريع تستحق الاستكشاف."
            description="مجموعة من الشراكات التي تحوّلت فيها التفاصيل الدقيقة إلى نتائج حقيقية."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/work">
                  جميع المشاريع
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
              {featured.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </Grid>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <DSButton asChild variant="outline" size="lg">
              <Link to="/work">
                استعرض جميع المشاريع
                <ArrowLeft />
              </Link>
            </DSButton>
          </div>
        </Reveal>
      </Section>

      <Section id="experience" className="border-t border-border/60">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <Reveal>
            <SectionTitle
              as="h2"
              eyebrow="الخبرات"
              title="مسيرة قصيرة ومدروسة."
              description="أبقيت السيرة المهنية مركّزة عن قصد — كل محطة اخترتها لعمق التجربة، لا لبريق الاسم."
            />
            <div className="mt-8">
              <DSButton asChild variant="outline" size="md">
                <Link to="/about">
                  اقرأ القصة كاملة
                  <ArrowLeft />
                </Link>
              </DSButton>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <DSCard variant="surface" padding="lg">
              <Timeline items={timeline} />
            </DSCard>
          </Reveal>
        </div>
      </Section>

      <Section id="skills" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="المهارات"
            title="التقنيات وراء العمل."
            description="التصميم والهندسة بمعيار واحد. أبقى مركّزًا لأتعمّق أكثر."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12">
            <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
              {skillGroups.map((group) => {
                const Icon = group.icon;
                return (
                  <DSCard key={group.title} variant="surface" padding="lg" className="h-full">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <h3 className="text-sm font-semibold tracking-tight text-foreground">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
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
        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <DSButton asChild variant="ghost" size="md">
              <Link to="/about">
                استعرض القائمة الكاملة
                <ArrowUpRight />
              </Link>
            </DSButton>
          </div>
        </Reveal>
      </Section>

      <Section id="certificates" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="الشهادات"
            title="تعلّم موثّق."
            description="شهادات رسمية من جهات أحترم عملها."
            actions={
              <span className="hidden items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground md:inline-flex">
                <Award className="size-3.5" aria-hidden />
                {certificates.length} شهادة موثّقة
              </span>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="md">
              {certificates.map((c) => (
                <CertificateCard key={c.title} certificate={c} />
              ))}
            </Grid>
          </div>
        </Reveal>
      </Section>

      <Section id="testimonials" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="آراء العملاء"
            title="ماذا يقول شركاؤنا."
            description="كلمات كريمة من الأشخاص الذين عملت معهم."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12">
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
              {featuredTestimonials.map((t) => (
                <TestimonialQuote key={t.id} testimonial={t} />
              ))}
            </Grid>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <DSButton asChild variant="outline" size="md">
              <Link to="/contact">
                كن دراسة الحالة القادمة
                <ArrowLeft />
              </Link>
            </DSButton>
          </div>
        </Reveal>
      </Section>

      <Section id="now" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="حاليًا"
            title="ما الذي أركّز عليه هذا الربع."
            description="قائمة قصيرة ومحدّثة — ثلاث قضايا تشغل وقتي واهتمامي الآن."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12">
            <Grid cols={{ base: 1, md: 3 }} gap="md">
              {currentFocus.map((item) => {
                const Icon = item.icon;
                return (
                  <DSCard
                    key={item.title}
                    variant="surface"
                    padding="lg"
                    className="relative h-full overflow-hidden"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -left-16 -top-16 size-40 rounded-full bg-primary/10 blur-2xl"
                    />
                    <div className="relative">
                      <span className="grid size-10 place-items-center rounded-md border border-border/60 bg-background text-primary">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </DSCard>
                );
              })}
            </Grid>
          </div>
        </Reveal>
      </Section>

      <Section id="ideas" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="مختبر الأفكار"
            title="أفكار قيد التشكّل، بشفافية."
            description="مفاهيم وتجارب ونماذج أولية أستكشفها — بعضها سيرى النور، ومعظمها لن يفعل."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/ideas">
                  استعرض المختبر
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 3 }} gap="md">
              {ideas.map((idea) => {
                const Icon = idea.icon;
                return (
                  <DSCard
                    key={idea.title}
                    variant="outline"
                    padding="lg"
                    className="group h-full transition-colors hover:border-border"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <DSBadge variant="subtle">{idea.tag}</DSBadge>
                    </div>
                    <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                      {idea.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{idea.description}</p>
                    <Link
                      to="/ideas"
                      className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                    >
                      تابع الأفكار
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </DSCard>
                );
              })}
            </Grid>
          </div>
        </Reveal>
      </Section>

      <Section id="writing" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="المدونة"
            title="أحدث المقالات."
            description="ملاحظات قصيرة حول التصميم والهندسة وممارسة إطلاق المنتجات."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/blog">
                  جميع المقالات
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="mt-10 divide-y divide-border/60 border-y border-border/60">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("ar-SA", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {" · "}
                      {post.readingTime} دقائق قراءة
                    </p>
                    <h3 className="mt-1 text-lg font-medium text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:text-foreground"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex justify-center">
            <DSButton asChild variant="outline" size="md">
              <Link to="/blog">
                استعرض المدونة
                <ArrowLeft />
              </Link>
            </DSButton>
          </div>
        </Reveal>
      </Section>

      <Section className="border-t border-border/60">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-16 md:px-16 md:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)] bg-linear-to-b from-primary/10 via-accent/5 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -bottom-24 size-80 rounded-full bg-accent/20 blur-3xl"
            />
            <div className="relative mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                <ShieldCheck className="size-3.5" aria-hidden />
                أستقبل مشاريع جديدة لهذا الربع
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-5xl">
                لنبنِ معًا شيئًا يستحق الإطلاق.
              </h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                سواء كنت تُطلق منتجًا جديدًا، أو تُعيد تصميم منتج قائم، أو تعمل
                على التوسّع — ابدأ بمحادثة قصيرة. إن لم نكن الشراكة المناسبة، سأخبرك بصراحة.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <DSButton asChild size="lg" variant="primary">
                  <Link to="/contact">
                    ابدأ مشروعًا
                    <ArrowLeft />
                  </Link>
                </DSButton>
                <DSButton asChild size="lg" variant="outline">
                  <Link to="/services">
                    <Figma />
                    استعرض الخدمات
                  </Link>
                </DSButton>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                زمن الرد المعتاد · خلال 24 ساعة · {site.location}
              </p>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
