import { Link, createFileRoute } from "@tanstack/react-router";
import { useRef, useCallback } from "react";
import { RouteErrorBoundary, RouteNotFoundBoundary } from "@/components/layout/route-boundaries";
import { ArrowLeft, ArrowUpRight, ExternalLink, Code2, LayoutTemplate } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { buildMeta } from "@/features/seo/build-meta";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";

import { Hero } from "@/components/sections/hero";
import {
  CertificateCard,
  CTA,
  DSButton,
  Grid,
  TestimonialQuote,
  Timeline,
  type Certificate,
  type TimelineItem,
} from "@/components/ds";
import { site } from "@/config/site";
import { projects as staticProjects } from "@/data/projects";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import { BrowserFrame } from "@/components/mockups/devices";
import { DashboardUI, StoreUI, EditorUI } from "@/components/mockups/ui-samples";
import { useHomeContent, getHomeText, getHomeList } from "@/lib/cms/home-content";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPublicProjects } from "@/lib/cms/projects-public.functions";
import { listTestimonials, listSkills, listCertificates, listExperiences } from "@/lib/cms/simple.functions";
import { listServices } from "@/lib/cms/services.functions";
import { toProject } from "@/lib/project-adapter";

/* ---------------- Hardcoded Fallbacks ---------------- */
const workflow = [
  { step: "01", title: "اكتشاف", description: "أفهم أهدافك وجمهورك ومنافسيك قبل أي خط." },
  { step: "02", title: "استراتيجية", description: "نُحدّد النطاق والنتائج وخارطة الطريق." },
  { step: "03", title: "تصميم", description: "واجهة واضحة، ونظام قابل للتوسّع، ومعاينة قابلة للاختبار." },
  { step: "04", title: "تطوير", description: "كود نظيف، أداء عالٍ، وجاهزية للنشر من اليوم الأول." },
  { step: "05", title: "إطلاق", description: "نشر مُراقَب، وضبط SEO، وتتبّع تحليلات فعلي." },
  { step: "06", title: "دعم", description: "متابعة بعد الإطلاق، وتحديثات، وقياس النتائج." },
];

const staticCertificates: Certificate[] = [
  { title: "مطوّر واجهات أمامية — Meta", issuer: "Meta", issuedAt: "2025" },
  { title: "تصميم تجربة المستخدم — Google", issuer: "Google", issuedAt: "2024" },
];

const staticTimeline: TimelineItem[] = [
  {
    date: "2025 — حتى الآن",
    title: "مهندس منتجات مستقل",
    meta: "عمل حر · عن بُعد",
    description: "شراكات مع رواد الأعمال لتصميم وإطلاق منتجات ويب متميزة.",
  }
];

const featuredMockups: Record<string, React.ComponentType> = {
  "northwind-analytics": DashboardUI,
  "lumen-payments": DashboardUI,
  "atelier-cms": EditorUI,
  "haven-storefront": StoreUI,
};

export const Route = createFileRoute("/")({
  errorComponent: ({ reset }) => <RouteErrorBoundary reset={reset} />,
  notFoundComponent: () => <RouteNotFoundBoundary />,
  head: () => ({
    meta: buildMeta({
      description: site.description,
      path: "/",
    }),
  }),
  component: Home,
});

function Home() {
  const listProjectsFn = useServerFn(listPublicProjects);
  const listTestimonialsFn = useServerFn(listTestimonials);
  const listSkillsFn = useServerFn(listSkills);
  const listServicesFn = useServerFn(listServices);
  const listExperiencesFn = useServerFn(listExperiences);
  const listCertificatesFn = useServerFn(listCertificates);

  const featuredQ = useQuery({ queryKey: ["home", "featured"], queryFn: () => listProjectsFn({ data: { featured: true, limit: 3 } }), staleTime: 60000 });
  const testimonialsQ = useQuery({ queryKey: ["home", "testimonials"], queryFn: () => listTestimonialsFn({ data: { featured: true, limit: 3, orderBy: "sort_order", ascending: true } }), staleTime: 60000 });
  const skillsQ = useQuery({ queryKey: ["home", "skills"], queryFn: () => listSkillsFn({ data: { limit: 20, orderBy: "sort_order", ascending: true } }), staleTime: 60000 });
  const servicesQ = useQuery({ queryKey: ["home", "services"], queryFn: () => listServicesFn({ data: { limit: 4, orderBy: "sort_order", ascending: true } }), staleTime: 60000 });
  const experiencesQ = useQuery({ queryKey: ["home", "experiences"], queryFn: () => listExperiencesFn({ data: { limit: 5, orderBy: "sort_order", ascending: true } }), staleTime: 60000 });
  const certificatesQ = useQuery({ queryKey: ["home", "certificates"], queryFn: () => listCertificatesFn({ data: { limit: 4, orderBy: "sort_order", ascending: true } }), staleTime: 60000 });

  const cmsFeatured = (featuredQ.data?.rows ?? []).map(toProject);
  const featured = cmsFeatured.length ? cmsFeatured : staticProjects.filter((p) => p.featured).slice(0, 3);
  
  const cmsTestimonials = (testimonialsQ.data?.rows ?? []).map((r: any) => ({
    id: r.id, quote: r.quote, author: r.author_name, role: r.author_role ?? "", company: r.author_company ?? undefined, avatar: r.avatar_url ?? undefined,
  }));
  const featuredTestimonials = cmsTestimonials.length ? cmsTestimonials : staticTestimonials.slice(0, 3);

  const skills = skillsQ.data?.rows ?? [];
  const services = servicesQ.data?.rows ?? [];
  
  const cmsExperiences = (experiencesQ.data?.rows ?? []).map((r: any) => ({
    date: `${r.start_date ? new Date(r.start_date).getFullYear() : ""} — ${r.end_date ? new Date(r.end_date).getFullYear() : "حتى الآن"}`,
    title: r.title, meta: r.company, description: r.description ?? ""
  }));
  const experiences = cmsExperiences.length ? cmsExperiences : staticTimeline;
  
  const cmsCertificates = (certificatesQ.data?.rows ?? []).map((r: any) => ({
    title: r.title, issuer: r.issuer, issuedAt: r.issue_date ? new Date(r.issue_date).getFullYear().toString() : "", link: r.credential_url ?? undefined
  }));
  const liveCertificates = cmsCertificates.length ? cmsCertificates : staticCertificates;

  const { data: homeRows } = useHomeContent();
  const t = (k: string, fb: string) => getHomeText(homeRows, k, fb);
  const workflowLive = getHomeList<(typeof workflow)[number]>(homeRows, "home.process.steps", workflow);

  return (
    <>
      <Hero />

      {/* ================= FEATURED PROJECTS ================= */}
      <Section id="work" className="border-t border-border/60" size="lg">
        <Reveal>
          <SectionTitle
            eyebrow={t("home.featured.eyebrow", "أعمال مختارة")}
            title={t("home.featured.title", "مختـــــــارات من شغـــــــــلي.")}
            description={t("home.featured.description", "مشاريع وانظمة برمجية صُممت لتحقيق أهداف فعلية، لا مجرد مظهر جميل.")}
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/work">
                  {t("home.featured.view_all", "كل الأعمال")}
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>

        <div className="mt-24 space-y-32 md:mt-32 md:space-y-56">
          {featured.map((project) => {
            const MockupUI = featuredMockups[project.slug] ?? DashboardUI;
            return (
              <Reveal key={project.slug}>
                <article className="mx-auto max-w-7xl">
                  <Link to="/work/$slug" params={{ slug: project.slug }} className="group relative block" aria-label={project.title}>
                    <div aria-hidden className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-linear-to-br from-primary/12 via-accent/8 to-transparent blur-3xl" />
                    {project.cover?.src ? (
                      <BrowserFrame url={project.liveDemo ? new URL(project.liveDemo).host : `${project.slug}.app`} className="transition-transform duration-700 ease-out group-hover:-translate-y-1">
                        <img src={project.cover.src} alt={project.cover.alt} className="size-full object-cover" />
                      </BrowserFrame>
                    ) : (
                      <BrowserFrame url={project.liveDemo ? new URL(project.liveDemo).host : `${project.slug}.app`} className="transition-transform duration-700 ease-out group-hover:-translate-y-1">
                        <MockupUI />
                      </BrowserFrame>
                    )}
                  </Link>

                  <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end md:gap-16">
                    <div className="min-w-0">
                      <h3 className="text-3xl font-semibold tracking-tight text-foreground text-balance md:text-5xl">{project.title}</h3>
                      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{project.summary}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <DSButton asChild variant="primary" size="md">
                        <Link to="/work/$slug" params={{ slug: project.slug }}>دراسة الحالة<ArrowLeft /></Link>
                      </DSButton>
                      {project.liveDemo && (
                        <DSButton asChild variant="ghost" size="md">
                          <a href={project.liveDemo} target="_blank" rel="noreferrer"><ExternalLink /> معاينة حيّة</a>
                        </DSButton>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ================= SKILLS ================= */}
      <Section id="skills" className="border-t border-border/60 relative overflow-hidden">
        <div aria-hidden className="absolute -left-[20%] top-[-10%] -z-10 h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <Reveal>
          <SectionTitle
            eyebrow={t("home.skills.eyebrow", "المهارات والتقنيات")}
            title={t("home.skills.title", "الأدوات التي أبدع بها.")}
            description={t("home.skills.description", "مجموعة من أحدث التقنيات واللغات التي أستخدمها لبناء تجارب رقمية فائقة السرعة والقوة.")}
          />
        </Reveal>
        
        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap gap-4">
            {skills.length > 0 ? (
              skills.map((skill: any, i: number) => (
                <div key={skill.id} className="group flex items-center gap-3 rounded-full border border-border/50 bg-background/50 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:bg-primary/5 motion-safe:hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex size-7 items-center justify-center rounded-full bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {skill.icon_url ? <img src={skill.icon_url} alt="" className="size-4" /> : <Code2 className="size-4" />}
                  </div>
                  {skill.name}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-sm">لا توجد مهارات مضافة حالياً. قم بإضافتها من لوحة التحكم.</div>
            )}
          </div>
        </Reveal>
      </Section>

      {/* ================= SERVICES ================= */}
      <Section id="services" className="border-t border-border/60 relative">
        <Reveal>
          <SectionTitle
            eyebrow={t("home.services.eyebrow", "الخدمات")}
            title={t("home.services.title", "ما الذي أُقدّمه.")}
            description={t("home.services.description", "خدمات قصيرة الوصف، واضحة النتيجة — لا مصطلحات، ولا وعود مفتوحة.")}
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/services">{t("home.services.view_all", "كل الخدمات")}<ArrowUpRight /></Link>
              </DSButton>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {services.length > 0 ? (
              services.map((s: any, i: number) => (
                <ServiceBentoCard key={s.slug || s.id} service={s} prominent={i % 3 === 0} />
              ))
            ) : (
              <div className="text-muted-foreground text-sm">لا توجد خدمات مضافة حالياً. قم بإضافتها من لوحة التحكم.</div>
            )}
          </div>
        </Reveal>
      </Section>

      {/* ================= HOW I WORK ================= */}
      <Section id="process" className="border-t border-border/60" size="lg">
        <Reveal>
          <SectionTitle eyebrow={t("home.process.eyebrow", "طريقة العمل")} title={t("home.process.title", "من فكرة إلى منتج مُطلَق.")} description={t("home.process.description", "عملية مُنظّمة من ستّ مراحل، مُصمّمة للوضوح وسرعة اتّخاذ القرار.")} />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3 shadow-sm">
            {workflowLive.map((w) => (
              <li key={w.step} className="group flex flex-col bg-background p-8 transition-colors hover:bg-muted/40 md:p-10">
                <div className="text-xs font-medium tracking-[0.2em] text-primary/70">{w.step}</div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.description}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* ================= EXPERIENCE ================= */}
      <Section id="experience" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow={t("home.experience.eyebrow", "المسيرة")}
            title={t("home.experience.title", "محطات مختصرة.")}
            description={t("home.experience.description", "نظرة سريعة على الأدوار التي شكّلت طريقتي في العمل.")}
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/career">{t("home.experience.view_all", "السيرة الكاملة")}<ArrowUpRight /></Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12 max-w-3xl">
            <Timeline items={experiences} />
          </div>
        </Reveal>
      </Section>

      {/* ================= CERTIFICATES ================= */}
      <Section id="certificates" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow={t("home.certificates.eyebrow", "الشهادات")}
            title={t("home.certificates.title", "تعلُّم مُستمر.")}
            description={t("home.certificates.description", "شهادات مختارة من برامج تُواكب صناعة المنتجات الرقمية.")}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md" className="mt-12">
            {liveCertificates.map((c: any) => (
              <CertificateCard key={c.title} certificate={c} />
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= TESTIMONIALS ================= */}
      <Section id="testimonials" className="border-t border-border/60">
        <Reveal>
          <SectionTitle eyebrow={t("home.testimonials.eyebrow", "شهادات")} title={t("home.testimonials.title", "بكلمات من عملت معهم.")} />
        </Reveal>
        <Reveal delay={0.05}>
          <Grid cols={{ base: 1, md: 3 }} gap="md" className="mt-12">
            {featuredTestimonials.map((t: any) => (
              <TestimonialQuote key={t.author} testimonial={t} />
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= FINAL CTA ================= */}
      <Reveal>
        <CTA
          className="border-t border-border/60"
          eyebrow={t("home.cta.eyebrow", "لنبدأ")}
          title={t("home.cta.title", "لنُطلق معًا شيئًا يستحقّ.")}
          description={t("home.cta.description", "محادثة قصيرة تكفي لنعرف إن كنّا الشريكين المناسبين لهذا المشروع.")}
          actions={
            <>
              <DSButton asChild size="lg" variant="primary">
                <Link to="/contact">{t("home.cta.primary_label", "تواصل معي")}<ArrowLeft /></Link>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <Link to="/work">{t("home.cta.secondary_label", "استعرض الأعمال")}<ArrowUpRight /></Link>
              </DSButton>
            </>
          }
        />
      </Reveal>
    </>
  );
}

function ServiceBentoCard({ service, prominent = false }: { service: any; prominent?: boolean }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--spotlight-x", `${x}%`);
    card.style.setProperty("--spotlight-y", `${y}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--spotlight-x", "50%");
    card.style.setProperty("--spotlight-y", "50%");
  }, []);

  return (
    <Link
      ref={cardRef}
      to="/services/$slug"
      params={{ slug: service.slug || service.id }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={service.title}
      style={{ "--spotlight-x": "50%", "--spotlight-y": "50%" } as React.CSSProperties}
      className={[
        "group relative flex flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-background/40 backdrop-blur-md",
        "transition-all duration-500 ease-out",
        "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:bg-card motion-safe:hover:-translate-y-2",
        "[background-image:radial-gradient(circle_at_var(--spotlight-x)_var(--spotlight-y),color-mix(in_oklab,var(--color-primary)_4%,transparent)_0%,transparent_65%)]",
        prominent ? "lg:row-span-1 lg:col-span-2 min-h-[22rem]" : "min-h-[18rem]",
        "p-8 sm:p-10",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        {service.icon_url ? (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-background/50 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-primary/30 group-hover:bg-primary/5">
            <img src={service.icon_url} alt="" className="size-6 object-contain" />
          </div>
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-background/50 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-primary/30 group-hover:bg-primary/5">
            <LayoutTemplate className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        )}
      </div>

      <div className="mt-8 flex-1">
        <h3 className="relative inline-block text-2xl font-bold tracking-tight text-foreground">
          {service.title}
          <span aria-hidden className="absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100" />
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground line-clamp-3">
          {service.excerpt || service.description || "خدمة مميزة من خدماتنا المصممة لتلبية احتياجاتك الرقمية."}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-end">
        <div className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted-foreground shadow-sm transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground group-hover:-rotate-45">
          <ArrowLeft className="size-4" />
        </div>
      </div>
    </Link>
  );
}
