import { Link } from "@tanstack/react-router";
import { Container } from "./container";
import { Logo } from "@/components/brand/logo";
import { socials } from "@/config/socials";
import { site } from "@/config/site";
import { ArrowUpLeft, MessageCircle, Mail, MapPin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/60 glass-panel py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-foreground/80">
              {site.role} — {site.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1 text-xs text-foreground/80">
                <span className="size-2 rounded-full bg-accent" />
                مشاريع تبدأ من {site.startingPrice}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1 text-xs text-muted-foreground">
                <MapPin className="size-3 text-accent" />
                {site.location}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                روابط سريعة
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="/#what-i-build" className="text-foreground/80 hover:text-foreground transition-colors">
                    الخدمات والحلول
                  </a>
                </li>
                <li>
                  <a href="/#work" className="text-foreground/80 hover:text-foreground transition-colors">
                    الأعمال المختارة
                  </a>
                </li>
                <li>
                  <a href="/#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
                    كيف أعمل
                  </a>
                </li>
                <li>
                  <a href="/#about" className="text-foreground/80 hover:text-foreground transition-colors">
                    عني
                  </a>
                </li>
                <li>
                  <a href="/#faq" className="text-foreground/80 hover:text-foreground transition-colors">
                    الأسئلة الشائعة
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                التواصل المباشر
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="/#contact-form"
                    className="font-semibold text-accent hover:underline inline-flex items-center gap-1"
                  >
                    ابدأ مشروعك
                    <ArrowUpLeft className="size-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="size-3.5 text-accent" />
                    واتساب
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <Mail className="size-3.5 text-accent" />
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Socials / Direct Notice */}
          <div className="md:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              جاهزية العمل
            </p>
            <div className="mt-4 rounded-xl glass-card glass-specular-eased p-4 text-xs text-foreground/80 leading-relaxed">
              <p className="font-semibold text-foreground">🤝 سرعة في الرد والتنفيذ</p>
              <p className="mt-1 text-muted-foreground">
                استقبل طلبات المشاريع والرد عليها عبر WhatsApp خلال أوقات العمل الرسمية.
              </p>
            </div>
            {socials.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                  تابعني
                </p>
                <ul className="flex flex-col gap-2">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                      >
                        <span className="text-xs text-accent font-mono">{s.handle}</span>
                        <span className="text-[11px] text-muted-foreground">— {s.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {year} {site.name} ({site.nameEn}). جميع الحقوق محفوظة.</p>
          <p dir="ltr" className="text-muted-foreground/70">
            Handcrafted with modern web architecture.
          </p>
        </div>
      </Container>
    </footer>
  );
}
