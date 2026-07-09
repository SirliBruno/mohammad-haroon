import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const dsBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted text-foreground",
        subtle: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border bg-transparent text-foreground",
        brand: "border-primary/20 bg-primary/10 text-primary",
        accent: "border-accent/20 bg-accent/10 text-accent",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        danger: "border-destructive/20 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface DSBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof dsBadgeVariants> {
  dot?: boolean;
}

export function DSBadge({ className, variant, dot, children, ...props }: DSBadgeProps) {
  return (
    <span className={cn(dsBadgeVariants({ variant }), className)} {...props}>
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current opacity-70" /> : null}
      {children}
    </span>
  );
}
