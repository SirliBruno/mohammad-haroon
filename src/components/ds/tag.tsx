import * as React from "react";
import { cn } from "@/lib/utils";

/** Tag — compact metadata chip (denser than Badge, used inline in cards). */
export function Tag({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border/70 bg-background px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function TagGroup({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {items.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  );
}
