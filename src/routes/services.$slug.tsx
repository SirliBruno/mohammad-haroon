import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Clock, Mail, Sparkles } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { buildMeta } from "@/features/seo/build-meta";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/typography/eyebrow";
import { DSButton, CTA, serviceIconMap } from "@/components/ds";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { services as staticServices } from "@/data/services";
import type { Service } from "@/features/services/schema";
import { site } from "@/config/site";
import { serviceBySlugOptions } from "@/features/cms/queries";
import { dbRowToService } from "@/lib/service-adapter";

function resolveService(slug: string, dbRow: unknown): Service | null {
  if (dbRow && typeof dbRow === "object") {
    return dbRowToService(dbRow as Parameters<typeof dbRowToService>[0]);
  }
  return staticServices.find((s) => s.slug === slug) ?? null;
}

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(serviceBySlugOptions(params.slug));
    const hasStatic = staticServices.some((s) => s.slug === params.slug);
    const cached = context.queryClient.getQueryData(
      serviceBySlugOptions(params.slug).queryKey,
    );
    if (!cached && !hasStatic) throw notFound();
  },
  head: ({ params }) => {
    const staticMatch = staticServices.find((s) => s.slug === params.slug);
    const title = staticMatch?.title ?? "الخدمة";
    const description = staticMatch?.summary;
    return {
      meta: buildMeta({
        title,
        description,
        path: `/services/${params.slug}`,
      }),
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
      scripts: staticMatch
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                name: staticMatch.title,
                description: staticMatch.summary,
                provider: { "@type": "Person", name: site.name },
                areaServed: "Global",
              }),
            },
          ]
        : undefined,
    };
  },
  errorComponent: ({ error }) => (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight">تعذّر تحميل الخدمة</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </Section>
  ),
  notFoundComponent: ServiceNotFound,
  component: ServiceDetail,
});

function ServiceIllustration({ service }: { service: Service }) {
  const Icon = service.icon ? serviceIconMap[service.icon] ?? Sparkles : Sparkles;
  return (
    <div
      aria-hidden
      className="relative aspect-[5/4] w-full overflow-hidden rounded-3xl glass-card glass-specular"
    >
      <div className="absolute inset-0 bg-linear-to-br from-accent/15 via-transparent to-primary/10" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid size-24 place-items-center rounded-2xl border border-accent/30 bg-background/80 text-accent shadow-sm backdrop-blur-md">
          <Icon className="size-10" />
        </div>
      </div>
    </div>
  );
}

function ServiceDetail() {
  const params = Route.useParams();
  const { data: dbRow } = useSuspenseQuery(serviceBySlugOptions(params.slug));
  const service = resolveService(params.slug, dbRow);
  if (!service) throw notFound();

  return (
    <>
      <header className="border-b border-border/60 pt-28 pb-16 md:pt-36 md:pb-20">
        <Container>
          <nav aria-label="مسار التنقل" className="text-sm text-muted-foreground">
            <Link to="/services" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowRight className="size-3.5" /> جميع الخدمات
            </Link>
          </nav>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <Eyebrow>الخدمة</Eyebrow>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl text-foreground font-display">
                {service.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                {service.summary}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {service.timeline ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3 py-1 font-medium">
                    <Clock className="size-3.5 text-accent" /> {service.timeline}
                  </span>
                ) : null}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <DSButton asChild size="lg">
                  <Link to="/contact">
                    اطلب هذه الخدمة <ArrowLeft />
                  </Link>
                </DSButton>
                <DSButton asChild size="lg" variant="outline">
                  <Link to="/services">جميع الخدمات</Link>
                </DSButton>
              </div>
            </div>
            <ServiceIllustration service={service} />
          </div>
        </Container>
      </header>

      {service.overview ? (
        <Section>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <Eyebrow>نظرة عامة</Eyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl font-display">
                ما هي هذه الخدمة
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-foreground/85">{service.overview}</p>
          </div>
        </Section>
      ) : null}

      {service.benefits.length ? (
        <Section className="border-t border-border/60">
          <Eyebrow>الفوائد</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl font-display">
            لماذا تختار الفرق هذه الخدمة
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {service.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-2xl glass-card glass-specular p-5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                  <Check className="size-3.5" aria-hidden />
                </span>
                <span className="text-sm font-medium text-foreground/90 leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {service.features.length ? (
        <Section className="border-t border-border/60">
          <Eyebrow>المميّزات</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl font-display">
            ما الذي يشمله العمل
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-3 rounded-2xl glass-card glass-specular p-4.5">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span className="text-sm font-medium text-foreground/90 leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {service.workflow.length ? (
        <Section className="border-t border-border/60">
          <Eyebrow>منهجيّة العمل</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl font-display">
            كيف سنعمل معًا
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.workflow.map((w) => (
              <li key={w.step} className="rounded-2xl glass-card glass-specular p-6">
                <p className="text-xs font-semibold tracking-widest text-accent font-mono" dir="ltr">{w.step}</p>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.description}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <Section className="border-t border-border/60">
        <div className="grid gap-10 md:grid-cols-2">
          {service.timeline ? (
            <div className="rounded-2xl glass-card glass-specular p-6">
              <Eyebrow>المدة الزمنية</Eyebrow>
              <p className="mt-4 flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground">
                <Clock className="size-5 text-accent" aria-hidden />
                {service.timeline}
              </p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                التقدير يعتمد على نطاق العمل والتبعيات، ويُؤكَّد بعد جلسة الاستكشاف.
              </p>
            </div>
          ) : null}
          {service.technologies.length ? (
            <div className="rounded-2xl glass-card glass-specular p-6">
              <Eyebrow>التقنيات</Eyebrow>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.technologies.map((t) => (
                  <li key={t} className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-foreground/90">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      {service.deliverables.length ? (
        <Section className="border-t border-border/60">
          <Eyebrow>ما ستحصل عليه</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl font-display">
            المخرجات النهائية
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {service.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3 rounded-2xl glass-card glass-specular p-4.5">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check className="size-3" aria-hidden />
                </span>
                <span className="text-sm font-medium text-foreground/90 leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {service.faq.length ? (
        <Section className="border-t border-border/60">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <Eyebrow>الأسئلة الشائعة</Eyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                أسئلة وأجوبة
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {service.faq.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-right">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>
      ) : null}

      <CTA
        className="border-t border-border/60"
        title={`جاهز للبدء بـ${service.title}؟`}
        description="اكتب لي عمّا تودّ بناءه — يصلك رأي صريح خلال 48 ساعة."
        actions={
          <>
            <DSButton asChild size="lg">
              <Link to="/contact">
                تواصل <ArrowLeft />
              </Link>
            </DSButton>
            <DSButton asChild size="lg" variant="outline">
              <a href={`mailto:${site.email}`}>
                <Mail /> راسلني عبر البريد
              </a>
            </DSButton>
          </>
        }
      />
    </>
  );
}

function ServiceNotFound() {
  const { slug } = Route.useParams();
  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground" dir="ltr">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">لم نعثر على الخدمة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          لا توجد خدمة باسم «{slug}».
        </p>
        <div className="mt-6">
          <DSButton asChild variant="outline">
            <Link to="/services">جميع الخدمات</Link>
          </DSButton>
        </div>
      </div>
    </Section>
  );
}
