import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";

export function AvailabilityBadge({ className }: { className?: string }) {
  if (!site.available) return null;
  return (
    <Link
      to="/contact"
      className={cn(
        "group hidden items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground md:inline-flex",
        className,
      )}
      aria-label={`${site.availabilityLabel}. تواصل مع ${site.name}.`}
    >
      <span className="relative flex size-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <span>{site.availabilityLabel}</span>
    </Link>
  );
}
