import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Eyebrow } from "@/components/typography/eyebrow";

/**
 * Standard first-fold page header. Detail pages (project, service, post)
 * should use `PageHeaderShell` and compose their own contents to keep the
 * top padding consistent across the site.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <PageHeaderShell>
      <div className="max-w-3xl">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <h1 className="text-4xl font-semibold tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">{description}</p>
        ) : null}
        {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      {children}
    </PageHeaderShell>
  );
}

/**
 * Shared shell for any first-fold page/detail header. Keeps the top
 * padding aligned with the fixed nav (nav ≈ 64px + breathing room).
 */
export function PageHeaderShell({
  children,
  className,
  bordered = true,
}: {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <header
      className={cn(
        "pt-28 pb-16 md:pt-36 md:pb-20",
        bordered && "border-b border-border/60",
        className,
      )}
    >
      <Container>{children}</Container>
    </header>
  );
}
