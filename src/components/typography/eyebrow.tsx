import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden className="inline-block size-1 rounded-full bg-primary" />
      {children}
    </p>
  );
}
