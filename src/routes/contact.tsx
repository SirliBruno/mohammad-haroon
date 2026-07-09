import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, Mail } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/typography/eyebrow";
import { DSButton, Field, TextField, TextAreaField, SuccessState } from "@/components/ds";
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
import { inquirySchema, type Inquiry } from "@/features/contact/schema";
import { submitInquiry } from "@/lib/contact.functions";
import { site } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: buildMeta({
      title: "Contact",
      description:
        "Get in touch with Mohammad Haroon about hiring, freelance projects, or collaborations.",
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
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      type: "hire",
      budget: "",
      message: "",
      consent: false,
    },
  });

  const type = watch("type");
  const consent = watch("consent");

  const onSubmit = async (data: Inquiry) => {
    setServerError(null);
    try {
      await submitInquiry({ data });
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error(err);
      setServerError("Something went wrong. Please email me directly at " + site.email + ".");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk"
        description="Whether it's a hire, a freelance project, or just a question — I read everything and reply within two working days."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          {/* Form */}
          <div>
            {submitted ? (
              <SuccessState
                title="Message received"
                description="Thanks for reaching out. I'll get back to you within two working days."
                action={
                  <DSButton variant="outline" onClick={() => setSubmitted(false)}>
                    Send another message
                  </DSButton>
                }
              />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                {serverError ? (
                  <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                  >
                    {serverError}
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
                    onValueChange={(v) => setValue("type", v as Inquiry["type"], { shouldValidate: true })}
                  >
                    <SelectTrigger>
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
                  <Input placeholder="e.g. $10k–$25k" {...register("budget")} />
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

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(v) =>
                      setValue("consent", v === true, { shouldValidate: true })
                    }
                    aria-invalid={!!errors.consent || undefined}
                  />
                  <div>
                    <Label htmlFor="consent" className="text-sm font-normal text-foreground/80">
                      I'm ok with {site.shortName} storing this message to reply.
                    </Label>
                    {errors.consent ? (
                      <p role="alert" className="mt-1 text-xs text-destructive">
                        {errors.consent.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <DSButton type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Sending…" : "Send inquiry"}
                    {!isSubmitting ? <ArrowRight /> : null}
                  </DSButton>
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
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">Prefer email?</p>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-0.5 inline-block text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-6">
              <Eyebrow>Currently</Eyebrow>
              <p className="mt-3 text-sm text-foreground">{site.availabilityLabel}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {site.location} · working globally
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
