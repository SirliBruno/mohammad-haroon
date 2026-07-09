import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label={`${site.name} — Home`}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-md bg-foreground text-[11px] font-bold text-background"
      >
        MH
      </span>
      <span>{site.name}</span>
    </Link>
  );
}
