import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const dsCardVariants = cva("rounded-xl transition-colors", {
  variants: {
    variant: {
      surface: "bg-card border border-border/60",
      outline: "bg-background border border-border/60",
      elevated: "bg-card border border-border/60 shadow-sm",
      ghost: "bg-transparent",
    },
    interactive: {
      true: "hover:border-border hover:shadow-md cursor-pointer group",
      false: "",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: { variant: "surface", interactive: false, padding: "md" },
});

export interface DSCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dsCardVariants> {
  as?: React.ElementType;
}

export const DSCard = React.forwardRef<HTMLDivElement, DSCardProps>(
  ({ className, variant, interactive, padding, as: As = "div", ...props }, ref) => (
    <As
      ref={ref}
      className={cn(dsCardVariants({ variant, interactive, padding }), className)}
      {...props}
    />
  ),
);
DSCard.displayName = "DSCard";

export function DSCardHeader({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5", className)} {...p} />;
}
export function DSCardTitle({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold tracking-tight", className)} {...p} />;
}
export function DSCardDescription({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...p} />;
}
export function DSCardContent({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4", className)} {...p} />;
}
export function DSCardFooter({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex items-center gap-2", className)} {...p} />;
}
