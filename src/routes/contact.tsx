import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Github,
  Linkedin,
  Shield,
  Sparkles,
} from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { usePageContent, getPageText } from "@/lib/cms/home-content";
import { Section } from "@/components/layout/section";
import { AvailabilityBadge } from "@/components/ds/availability-badge";
import { Eyebrow } from "@/components/typography/eyebrow";
import {
  DSButton,
  Field,
  TextField,
  TextAreaField,
  SuccessState,
  CTA,
} from "@/components/ds";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { inquirySchema, type Inquiry } from "@/features/contact/schema";
import { submitInquiry } from "@/lib/contact.functions";
import { site } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: buildMeta({
      title: "تواصل",
      description:
        "تواصل مع محمد هارون — للتوظيف، أو المشاريع الحرّة، أو الشراكات. أرد على كلّ الرسائل خلال يومَي عمل.",
      path: "/contact",
    }),
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `تواصل مع ${site.name}`,
          url: `${site.url}/contact`,
          about: {
            "@type": "Person",
            name: site.name,
            email: site.email,
            address: site.location,
          },
        }),
      },
    ],
  }),
  component: ContactPage,
});

const whatsappHref = `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
  "مرحبًا هارون — تواصلت معك من خلال موقعك.",
)}`;

const channels = [
  {
    icon: Mail,
    label: "البريد الإلكتروني",
    value: site.email,
    href: `mailto:${site.email}`,
    hint: "الأنسب لعرض المشروع بالتفصيل",
  },
  {
    icon: MessageCircle,
    label: "واتساب",
    value: site.whatsappDisplay,
    href: whatsappHref,
    hint: "للأسئلة السريعة وحجز المواعيد",
  },
  {
    icon: Linkedin,
    label: "لينكدإن",
    value: "in/mharoon",
    href: "https://linkedin.com/",
    hint: "للفرص المهنيّة والتعارف",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "@mharoon",
    href: "https://github.com/",
    hint: "الكود والمشاريع مفتوحة المصدر",
  },
] as const;

const faqs = [
  {
    q: "كم يستغرق الرد عادةً؟",
    a: "خلال يومَي عمل، وغالبًا في اليوم نفسه إن وصلت الرسالة قبل الثالثة عصرًا بتوقيت السعوديّة.",
  },
  {
    q: "هل تقبل المشاريع القصيرة؟",
    a: "نعم — من صفحة مقصودة خلال أسبوعين، إلى مشروع منتج متكامل. وإن لم أكن الشريك المناسب، أخبرك بصراحة.",
  },
  {
    q: "ما الذي يُسرّع الرد؟",
    a: "ملخّص للمشكلة في سطر أو سطرين، والجدول الزمني، ونطاق ميزانيّة تقريبي إن أمكن. روابط منتجك الحالي أو ملفّ Figma تفتح كل الأبواب.",
  },
  {
    q: "هل تُوقّع اتفاقيّة عدم إفصاح؟",
    a: "بكلّ سرور — أُوقّع NDA متبادلة قبل المكالمة الأولى للأعمال الحسّاسة. فقط أشِر إلى ذلك في رسالتك.",
  },
  {
    q: "أين مقرّك؟ وهل تسافر؟",
    a: `${site.location} — أعمل مع فرق حول العالم بتوقيت ${site.timezone}، وأسافر لجلسات الانطلاق حين يستدعي الأمر.`,
  },
];

function ContactPage() {
  const { data: contentRows } = usePageContent("contact");
  const tt = (k: string, fb: string) => getPageText(contentRows, k, fb);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      type: "hire",
      budget: "",
      message: "",
      consent: false,
      company: "",
    },
  });

  const type = watch("type");
  const consent = watch("consent");
  const hasErrors = isSubmitted && Object.keys(errors).length > 0;

  const onSubmit = async (data: Inquiry) => {
    setServerError(null);
    try {
      await submitInquiry({ data });
      trackEvent("contact_submit", { type: data.type });
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error(err);
      setServerError(
        "حدث خطأ غير متوقّع أثناء إرسال الرسالة. يُرجى مراسلتي مباشرة عبر " + site.email + "."
      );
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={tt("contact.header.eyebrow", "تواصل")}
        title={tt("contact.header.title", "لنتحدّث")}
        description={tt(
          "contact.header.description",
          "توظيف، أو مشروع حرّ، أو حتى سؤال عابر — أقرأ كلّ الرسائل بنفسي، وأرد خلال يومَي عمل.",
        )}
      />



      <Section size="sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => {
            const Icon = c.icon;
            const external = c.href.startsWith("http");
            return (
              <a
                key={c.label}
                href={c.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group relative flex flex-col rounded-2xl border border-border/60 bg-card p-5 transition-[transform,box-shadow,border-color] duration-200 ease-out will-change-transform hover:border-primary/40 hover:shadow-lg motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{c.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.hint}</p>
                  </div>
                </div>
                <p className="mt-4 truncate text-sm text-foreground/80 group-hover:text-foreground" dir={c.label === "GitHub" || c.label === "لينكدإن" ? "ltr" : undefined}>
                  {c.value}
                </p>
                <ArrowLeft
                  className="absolute left-4 top-4 size-4 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 motion-safe:group-hover:-translate-x-0.5"
                  aria-hidden
                />
              </a>
            );
          })}
        </div>
      </Section>


      <Section>
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div>
            {submitted ? (
              <SuccessState
                title="وصلت رسالتك"
                description="شكرًا لتواصلك. أرد عادةً خلال يومَي عمل، وغالبًا في وقت أقصر."
                action={
                  <DSButton variant="outline" onClick={() => setSubmitted(false)}>
                    إرسال رسالة جديدة
                  </DSButton>
                }
              />
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                onFocus={() => trackEvent("contact_start")}
                noValidate
                aria-labelledby="contact-form-heading"
                className="space-y-6"
              >
                <h2 id="contact-form-heading" className="sr-only">
                  نموذج التواصل
                </h2>

                {serverError ? (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                  >
                    {serverError}
                  </div>
                ) : null}

                {hasErrors ? (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                  >
                    يُرجى تصحيح الحقول المميّزة أدناه.
                  </div>
                ) : null}

                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField
                    id="name"
                    label="الاسم"
                    required
                    autoComplete="name"
                    placeholder="اكتب اسمك الكامل"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <TextField
                    id="email"
                    label="البريد الإلكتروني"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                <Field id="type" label="نوع المشروع" required error={errors.type?.message}>
                  <Select
                    value={type}
                    onValueChange={(v) =>
                      setValue("type", v as Inquiry["type"], { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id="type" aria-label="نوع الاستفسار">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hire">وظيفة بدوام كامل</SelectItem>
                      <SelectItem value="freelance">مشروع حرّ</SelectItem>
                      <SelectItem value="collab">شراكة أو تعاون</SelectItem>
                      <SelectItem value="other">شيء آخر</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field id="budget" label="الميزانيّة (اختياري)" hint="نطاق تقريبي بالريال أو الدولار.">
                  <Input
                    id="budget"
                    placeholder="مثال: 40,000 – 100,000 ريال"
                    autoComplete="off"
                    {...register("budget")}
                  />
                </Field>

                <TextAreaField
                  id="message"
                  label="الرسالة"
                  required
                  rows={6}
                  placeholder="اكتب لي عن المشكلة، والجدول الزمني، والنتيجة المثاليّة كما تراها."
                  error={errors.message?.message}
                  {...register("message")}
                />

                {/* حقل فخ لالتقاط الروبوتات */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[10000px] size-0 overflow-hidden opacity-0"
                >
                  <label htmlFor="company">الشركة (اتركه فارغًا)</label>
                  <input
                    id="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("company")}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(v) =>
                      setValue("consent", v === true, { shouldValidate: true })
                    }
                    aria-invalid={!!errors.consent || undefined}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                  />
                  <div>
                    <Label htmlFor="consent" className="text-sm font-normal text-foreground/80">
                      أوافق على احتفاظ {site.shortName} برسالتي بغرض الرد فقط.
                    </Label>
                    {errors.consent ? (
                      <p id="consent-error" role="alert" className="mt-1 text-xs text-destructive">
                        {errors.consent.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <DSButton type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "جارٍ الإرسال…" : "إرسال الرسالة"}
                    {!isSubmitting ? <ArrowLeft /> : null}
                  </DSButton>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="size-3.5" aria-hidden />
                    محميّ ضدّ الرسائل المزعجة، بلا أي متتبّعات خارجيّة.
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <Eyebrow>ما الذي يحدث بعد الإرسال</Eyebrow>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">رد خلال 48 ساعة</p>
                    <p className="mt-0.5 text-muted-foreground">
                      في أيّام العمل. أقرأ كلّ رسالة بنفسي.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">مكالمة قصيرة</p>
                    <p className="mt-0.5 text-muted-foreground">
                      إن كنّا الشراكة المناسبة، نحجز 30 دقيقة للاتّفاق على نطاق العمل.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">عرض مخصّص</p>
                    <p className="mt-0.5 text-muted-foreground">
                      نطاق واضح، وجدول زمني، وسعر ثابت — بلا مفاجآت لاحقة.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <Eyebrow>التوفّر</Eyebrow>
              <div className="mt-3">
                <AvailabilityBadge
                  available={site.available}
                  label={site.availabilityLabel}
                />
              </div>
              <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  {site.location} · {site.timezone}
                  <br />
                  <span className="text-xs">{site.workingHours}</span>
                </span>
              </p>
            </div>


            <div className="rounded-xl border border-border/60 bg-card p-6">
              <Eyebrow>تُفضّل المحادثة السريعة؟</Eyebrow>
              <p className="mt-3 text-sm text-muted-foreground">
                واتساب هو الأسرع للأسئلة القصيرة وحجز المواعيد.
              </p>
              <DSButton asChild variant="outline" size="sm" className="mt-4 w-full">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  محادثة عبر واتساب
                </a>
              </DSButton>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <Eyebrow>الأسئلة الشائعة</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl">
              قبل أن ترسل
            </h2>
            <p className="mt-4 text-muted-foreground">
              أسئلة يتكرّر طرحها. إن لم يكن سؤالك هنا، أرسله وسأجيبك بكلّ سرور.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-right text-base font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>


      <CTA
        eyebrow={tt("contact.direct.eyebrow", "تُفضّل الطريق المباشر؟")}
        title={tt("contact.direct.title", "تجاوز النموذج — راسلني مباشرة.")}
        description="بريد، أو واتساب، أو لينكدإن — اختر ما يناسبك، والرد يصلك بنفس السرعة."
        actions={
          <>
            <DSButton asChild size="lg">
              <a href={`mailto:${site.email}`}>
                <Mail />
                راسل {site.shortName}
              </a>
            </DSButton>
            <DSButton asChild variant="outline" size="lg">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                واتساب
              </a>
            </DSButton>
          </>
        }
      />
    </>
  );
}
