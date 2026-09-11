import { ArrowRight, Globe, Layout, ShoppingBag, Sparkles, Palette, Rocket, Wrench, type LucideIcon } from "lucide-react";
import { DSCard, DSCardTitle, DSCardDescription } from "./card";
import { cn } from "@/lib/utils";
import type { Service } from "@/features/services/schema";

// Shared across service surfaces (service cards + service detail page).
export const serviceIconMap: Record<string, LucideIcon> = {
  Globe,
  Layout,
  ShoppingBag,
  Sparkles,
  Palette,
  Rocket,
  Wrench,
};

export function ServiceCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  const Icon = service.icon ? serviceIconMap[service.icon] ?? Sparkles : Sparkles;
  return (
    <DSCard variant="glass" padding="lg" className={cn("group flex h-full flex-col", className)}>
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-lg border border-border/60 bg-muted/50 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        {service.timeline ? (
          <span className="text-xs text-muted-foreground">{service.timeline}</span>
        ) : null}
      </div>
      <DSCardTitle className="mt-6 text-lg">{service.title}</DSCardTitle>
      <DSCardDescription className="mt-2">{service.summary}</DSCardDescription>
      {service.deliverables.length ? (
        <ul className="mt-6 space-y-2 text-sm">
          {service.deliverables.slice(0, 3).map((d) => (
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
