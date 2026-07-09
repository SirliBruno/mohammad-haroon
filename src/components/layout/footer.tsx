import { Link } from "@tanstack/react-router";
import { Container } from "./container";
import { footerNav } from "@/config/nav";
import { socials } from "@/config/socials";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-sm font-semibold text-foreground">{site.name}</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{site.tagline}</p>
          </div>
          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group.title}
              </p>
              <ul className="mt-4 space-y-2">
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
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-4">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  rel="noreferrer"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
