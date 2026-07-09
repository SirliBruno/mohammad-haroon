import { ArrowRight } from "lucide-react";
import { DSCard, DSCardTitle, DSCardDescription } from "./card";
import { DSBadge } from "./badge";
import { cn } from "@/lib/utils";
import type { Service } from "@/features/services/schema";

export function ServiceCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  return (
    <DSCard variant="surface" padding="lg" className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center justify-between">
        <DSBadge variant="subtle">{service.engagement}</DSBadge>
        {service.startingAt ? (
          <span className="text-xs text-muted-foreground">from {service.startingAt}</span>
        ) : null}
      </div>
      <DSCardTitle className="mt-6 text-lg">{service.title}</DSCardTitle>
      <DSCardDescription className="mt-2">{service.summary}</DSCardDescription>
      {service.deliverables.length ? (
        <ul className="mt-6 space-y-2 text-sm">
          {service.deliverables.map((d) => (
            <li key={d} className="flex items-start gap-2 text-foreground/80">
              <ArrowRight aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </DSCard>
  );
}
