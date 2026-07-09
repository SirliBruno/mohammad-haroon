import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
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
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
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
      title: "Contact",
      description:
        "Get in touch with Mohammad Haroon — hire, freelance projects, collaborations. Reply within two working days.",
      path: "/contact",
    }),
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `Contact ${site.name}`,
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
  "Hi Haroon — I found you via your site.",
)}`;

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    hint: "Best for detailed briefs",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: site.whatsappDisplay,
    href: whatsappHref,
    hint: "Quick questions & scheduling",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "in/mharoon",
    href: "https://linkedin.com/",
    hint: "Roles & professional intros",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "@mharoon",
    href: "https://github.com/",
    hint: "Code, issues & OSS",
  },
] as const;

const faqs = [
  {
    q: "What's your typical response time?",
    a: "Within two working days — usually the same day if it lands before 3pm my time.",
  },
  {
    q: "Do you take on short projects?",
    a: "Yes. Anything from a two-week landing page to a full product engagement. I'll tell you honestly if I'm not the right fit.",
  },
  {
    q: "What information helps you reply faster?",
    a: "A one-line summary of the problem, your timeline, and — if relevant — a rough budget range. Links to existing product, brand, or Figma are gold.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Happy to sign a mutual NDA before a first call for sensitive work. Just mention it in your message.",
  },
  {
    q: "Where are you based and do you travel?",
    a: `${site.location} — I work with teams globally on ${site.timezone.replace("UTC", "GMT")} overlap and travel for kick-offs when it matters.`,
  },
];

function ContactPage() {
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
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error(err);
      setServerError(
        "Something went wrong. Please email me directly at " + site.email + ".",
      );
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk"
        description="Whether it's a hire, a freelance project, or just a question — I read everything and reply within two working days."
      />

      {/* Channels */}
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
                <p className="mt-4 truncate text-sm text-foreground/80 group-hover:text-foreground">
                  {c.value}
                </p>
                <ArrowRight
                  className="absolute right-4 top-4 size-4 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 motion-safe:group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            );
          })}
        </div>
      </Section>


      {/* Form + sidebar */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          {/* Form */}
          <div>
            {submitted ? (
              <SuccessState
                title="Message received"
                description="Thanks for reaching out. I'll get back to you within two working days — usually sooner."
                action={
                  <DSButton variant="outline" onClick={() => setSubmitted(false)}>
                    Send another message
                  </DSButton>
                }
              />
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-labelledby="contact-form-heading"
                className="space-y-6"
              >
                <h2 id="contact-form-heading" className="sr-only">
                  Contact form
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
                    Please fix the highlighted fields below.
                  </div>
                ) : null}

                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField
                    id="name"
                    label="Your name"
                    required
                    autoComplete="name"
                    placeholder="Jane Doe"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <TextField
                    id="email"
                    label="Email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                <Field id="type" label="What's this about?" required error={errors.type?.message}>
                  <Select
                    value={type}
                    onValueChange={(v) =>
                      setValue("type", v as Inquiry["type"], { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id="type" aria-label="Inquiry type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hire">Full-time role</SelectItem>
                      <SelectItem value="freelance">Freelance project</SelectItem>
                      <SelectItem value="collab">Collaboration</SelectItem>
                      <SelectItem value="other">Something else</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field id="budget" label="Budget (optional)" hint="Rough range in USD is perfect.">
                  <Input
                    id="budget"
                    placeholder="e.g. $10k–$25k"
                    autoComplete="off"
                    {...register("budget")}
                  />
                </Field>

                <TextAreaField
                  id="message"
                  label="Message"
                  required
                  rows={6}
                  placeholder="Tell me about the problem, the timeline, and what a great outcome would look like."
                  error={errors.message?.message}
                  {...register("message")}
                />

                {/* Honeypot — hidden from users, catches bots */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[10000px] size-0 overflow-hidden opacity-0"
                >
                  <label htmlFor="company">Company (leave blank)</label>
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
                      I'm ok with {site.shortName} storing this message to reply.
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
                    {isSubmitting ? "Sending…" : "Send inquiry"}
                    {!isSubmitting ? <ArrowRight /> : null}
                  </DSButton>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="size-3.5" aria-hidden />
                    Protected against spam. No third-party trackers.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <Eyebrow>What to expect</Eyebrow>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">Reply within 48h</p>
                    <p className="mt-0.5 text-muted-foreground">
                      Working days. I read every message myself.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">A short call</p>
                    <p className="mt-0.5 text-muted-foreground">
                      If we're a fit, we'll book 30 minutes to align on scope.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">A tailored proposal</p>
                    <p className="mt-0.5 text-muted-foreground">
                      Scope, timeline, and pricing — no surprises later.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-6">
              <Eyebrow>Availability</Eyebrow>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`relative flex size-2.5 shrink-0 ${site.available ? "" : "opacity-60"}`}
                  aria-hidden
                >
                  {site.available ? (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  ) : null}
                  <span
                    className={`relative inline-flex size-2.5 rounded-full ${site.available ? "bg-emerald-500" : "bg-muted-foreground"}`}
                  />
                </span>
                <p className="text-sm font-medium text-foreground">{site.availabilityLabel}</p>
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
              <Eyebrow>Prefer chat?</Eyebrow>
              <p className="mt-3 text-sm text-muted-foreground">
                WhatsApp is fastest for short questions or scheduling.
              </p>
              <DSButton asChild variant="outline" size="sm" className="mt-4 w-full">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  Message on WhatsApp
                </a>
              </DSButton>
            </div>
          </aside>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Before you write
              </h2>
              <p className="mt-4 text-muted-foreground">
                A few things people usually ask. If your question isn't here, send it over — happy
                to answer.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      <CTA
        eyebrow="Still reading?"
        title="Skip the form — say hi directly."
        description="Email me, ping me on WhatsApp, or connect on LinkedIn. Whatever's easiest."
        actions={
          <>
            <DSButton asChild size="lg">
              <a href={`mailto:${site.email}`}>
                <Mail />
                Email {site.shortName}
              </a>
            </DSButton>
            <DSButton asChild variant="outline" size="lg">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                WhatsApp
              </a>
            </DSButton>
          </>
        }
      />
    </>
  );
}
