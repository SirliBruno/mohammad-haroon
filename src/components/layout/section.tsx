import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionSize = "default" | "sm" | "lg" | "none";

const sizePad: Record<SectionSize, string> = {
  none: "",
  sm: "py-14 md:py-16",
  default: "py-20 md:py-28 lg:py-32",
  lg: "py-24 md:py-32 lg:py-40",
};

/**
 * Vertical section rhythm. Use `size` to opt into a smaller/larger
 * scale — do NOT override with a `py-*` in `className` (Tailwind's
 * merge order is not deterministic for arbitrary utilities).
 */
export function Section({
  id,
  className,
  bleed = false,
  size = "default",
  children,
  ariaLabelledby,
  as: As = "section",
}: {
  id?: string;
  className?: string;
  bleed?: boolean;
  size?: SectionSize;
  children: ReactNode;
  ariaLabelledby?: string;
  as?: "section" | "div";
}) {
  return (
    <As id={id} aria-labelledby={ariaLabelledby} className={cn(sizePad[size], className)}>
      {bleed ? children : <Container>{children}</Container>}
    </As>
  );
}
