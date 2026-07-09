import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

export function CTA({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-20 md:py-28", className)}>
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-8 py-16 text-center md:px-16 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)] bg-linear-to-b from-primary/8 to-transparent"
          />
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              {description}
            </p>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div> : null}
        </div>
      </Container>
    </section>
  );
}
