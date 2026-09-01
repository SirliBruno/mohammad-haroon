import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label={`${site.name} — الرئيسية`}
      className={cn(
        "inline-flex items-center gap-2.5 text-sm font-bold tracking-tight text-foreground transition-opacity hover:opacity-90",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground shadow-xs"
      >
        MH
      </span>
      <span className="flex flex-col text-right leading-tight">
        <span className="font-bold text-foreground text-sm">{site.name}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest" dir="ltr">
          {site.nameEn}
        </span>
      </span>
    </Link>
  );
}
