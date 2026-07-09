import { Link } from "@tanstack/react-router";
import { Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Container } from "./container";
import { Logo } from "@/components/brand/logo";
import { footerNav } from "@/config/nav";
import { socials } from "@/config/socials";
import { site } from "@/config/site";

const iconFor: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
  X: Twitter,
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-border/60 bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
      />
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-12">
          {/* Brand block */}
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {site.tagline} — {site.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Download className="size-3.5" aria-hidden />
                Download resume
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
              >
                Get in touch
              </Link>
            </div>
          </div>

          {/* Nav groups */}
          <div className="grid grid-cols-2 gap-8 md:col-span-5 md:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social block */}
          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5">
              {socials.map((s) => {
                const Icon = iconFor[s.label] ?? Mail;
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
                      aria-label={`${s.label} — ${s.handle}`}
                    >
                      <Icon className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden />
                      <span>{s.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-border/60 py-6 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with{" "}
            <a
              href="https://react.dev"
              rel="noreferrer"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              React
            </a>
            ,{" "}
            <a
              href="https://tanstack.com/start"
              rel="noreferrer"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              TanStack Start
            </a>
            ,{" "}
            <a
              href="https://tailwindcss.com"
              rel="noreferrer"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              Tailwind
            </a>
            {" & "}
            <a
              href="https://motion.dev"
              rel="noreferrer"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              Motion
            </a>
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}
