import { Link } from "@tanstack/react-router";
import { Container } from "./container";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { primaryNav } from "@/config/nav";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/contact"
              className="hidden rounded-md bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 md:inline-flex"
            >
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
