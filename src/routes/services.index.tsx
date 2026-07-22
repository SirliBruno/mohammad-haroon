import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";
import { DSButton, Grid, CTA } from "@/components/ds";
import { ServiceShowcaseCard } from "@/components/ds/service-showcase-card";
import { services as staticServices, serviceProcess, serviceFaq } from "@/data/services";
import { site } from "@/config/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { serviceListOptions, projectListOptions } from "@/features/cms/queries";
import { dbRowToService } from "@/lib/service-adapter";
import type { Service } from "@/features/services/schema";
import { usePageContent, getPageText } from "@/lib/cms/home-content";

const listParams = { limit: 50, orderBy: "sort_order", ascending: true } as const;

export const Route = createFileRoute("/services/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(serviceListOptions(listParams)),
  head: () => ({
    meta: buildMeta({
      title: "الخدمات",
      description:
        "خدمات تطوير الويب، ومتاجر WordPress وWooCommerce، وتصميم الواجهات، والهوية البصريّة — لشركات وعلامات تجاريّة طموحة.",
      path: "/services",
    }),
    links: [{ rel: "canonical", href: "/services" }],
  }),
  errorComponent: () => (
    <PageHeader eyebrow="الخدمات" title="تعذّر تحميل الخدمات" description="حاول تحديث الصفحة." />
  ),
  component: ServicesIndex,
});

function ServicesIndex() {
  const { data } = useSuspenseQuery(serviceListOptions(listParams));
  const { data: projectData } = useQuery(projectListOptions({ limit: 200, orderBy: "sort_order", ascending: true }));
  const projectRows = (projectData as { rows?: Array<{ slug: string; title: string }> } | undefined)?.rows ?? [];
  const projectTitleBySlug: Record<string, string> = {};
  for (const row of projectRows) {
    if (row.slug) projectTitleBySlug[row.slug] = row.title;
  }
  const fromDb: Service[] = (data?.rows ?? []).map((row) => dbRowToService(row, projectTitleBySlug));
  const services = fromDb.length > 0 ? fromDb : staticServices;
  const { data: servicesRows } = usePageContent("services-page");
  const tt = (k: string, fb: string) => getPageText(servicesRows, k, fb);

  return (
    <>
      <PageHeader
        eyebrow={tt("services.header.eyebrow", "الخدمات")}
        title={tt("services.header.title", "تصميم وتطوير احترافي متكامل")}
        description={tt(
          "services.header.description",
          "خدمات متخصّصة تُغطّي دورة حياة المنتج الرقمي بأكملها — من صفحة مقصودة واحدة إلى متجر إلكتروني كامل، وكلّ ما بينهما.",
        )}
      />


      <Section>
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
          {services.map((s) => (
            <ServiceShowcaseCard key={s.slug} service={s} />
          ))}
        </Grid>
      </Section>


      <Section className="border-t border-border/60">
        <SectionTitle
          eyebrow="منهجيّة العمل"
          title="كيف تسير كلّ شراكة"
          size="sm"
        />
        <div className="mt-10">
          <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
            {serviceProcess.map((p) => (
              <div key={p.step} className="rounded-2xl border border-border/60 bg-card p-6">
                <p className="text-xs font-medium tracking-widest text-muted-foreground" dir="ltr">{p.step}</p>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <SectionTitle
            eyebrow="الأسئلة الشائعة"
            title="الأسئلة الأكثر تكرارًا"
            description="لم تجد سؤالك؟ اطرحه من صفحة التواصل."
            size="sm"
          />
          <Accordion type="single" collapsible className="w-full">
            {serviceFaq.map((f, i) => (
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

      <CTA
        eyebrow="جاهز للبدء؟"
        title="هل لديك مشروع في ذهنك؟"
        description="اكتب لي عنه — يصلك رأي صريح خلال 48 ساعة."
        actions={
          <>
            <DSButton asChild size="lg">
              <Link to="/contact">
                ابدأ محادثة <ArrowLeft />
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
