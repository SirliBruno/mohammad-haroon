import { cn } from "@/lib/utils";

/**
 * Small "available" pill with a pulsing dot. Replaces the hardcoded
 * emerald pattern that was duplicated across the hero, about, career
 * and contact pages.
 *
 * `tone="muted"` renders a subtle inline dot only; `tone="pill"` renders
 * the full bordered chip.
 */
export function AvailabilityBadge({
  available = true,
  label,
  tone = "pill",
  className,
}: {
  available?: boolean;
  label?: string;
  tone?: "pill" | "dot";
  className?: string;
}) {
  const text = label ?? (available ? "Available for work" : "Currently unavailable");
  const dotColor = available ? "bg-emerald-500" : "bg-muted-foreground";
  const dotHalo = available ? "bg-emerald-500/60" : "bg-muted-foreground/40";

  if (tone === "dot") {
    return (
      <span className={cn("inline-flex items-center gap-2 text-xs text-muted-foreground", className)}>
        <span className="relative inline-flex size-2">
          {available ? (
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />
          ) : null}
          <span className={cn("relative inline-flex size-2 rounded-full", dotColor)} />
        </span>
        {text}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        available
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "border-border/60 bg-muted/40 text-muted-foreground",
        className,
      )}
    >
      <span className="relative inline-flex size-2">
        {available ? (
          <span className={cn("absolute inset-0 animate-ping rounded-full motion-reduce:hidden", dotHalo)} />
        ) : null}
        <span className={cn("relative inline-flex size-2 rounded-full", dotColor)} />
      </span>
      {text}
    </span>
  );
}
