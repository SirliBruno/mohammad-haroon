import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionSize = "default" | "sm" | "lg" | "none";
type SectionTone = "plain" | "muted" | "raised";

const sizePad: Record<SectionSize, string> = {
  none: "",
  sm: "py-14 md:py-16",
  default: "py-20 md:py-28 lg:py-32",
  lg: "py-24 md:py-32 lg:py-40",
};

const toneClass: Record<SectionTone, string> = {
  plain: "",
  // A very subtle tinted band — reads on top of the aurora and clearly
  // separates from adjacent `plain` sections.
  muted:
    "bg-muted/40 dark:bg-white/[0.02] backdrop-blur-[2px]",
  // Elevated card-like band with soft inner highlight.
  raised:
    "bg-card/60 dark:bg-white/[0.03] backdrop-blur-[2px] shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--color-foreground)_6%,transparent)]",
};

/**
 * Vertical section rhythm. Use `size` for scale and `tone` for
 * background separation between adjacent sections. Sections with
 * `divider` also render a signature hairline + soft brand glow at
 * the top edge so the transition never feels flat.
 */
export function Section({
  id,
  className,
  bleed = false,
  size = "default",
  tone = "plain",
  divider = false,
  children,
  ariaLabelledby,
  as: As = "section",
}: {
  id?: string;
  className?: string;
  bleed?: boolean;
  size?: SectionSize;
  tone?: SectionTone;
  divider?: boolean;
  children: ReactNode;
  ariaLabelledby?: string;
  as?: "section" | "div";
}) {
  return (
    <As
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(
        "relative isolate",
        sizePad[size],
        toneClass[tone],
        divider && "border-t border-border/70",
        className,
      )}
    >
      {divider ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, color-mix(in oklab, var(--color-primary) 55%, transparent) 50%, transparent 100%)",
          }}
        />
      ) : null}
      {divider ? (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-[42rem] max-w-[80%] -translate-x-1/2 opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at top, color-mix(in oklab, var(--color-primary) 25%, transparent), transparent 65%)",
          }}
        />
      ) : null}
      {bleed ? children : <Container>{children}</Container>}
    </As>
  );
}
