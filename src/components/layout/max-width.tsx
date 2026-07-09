import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl" | "2xl" | "prose";

const sizeMap: Record<Size, string> = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  prose: "max-w-[68ch]",
};

export function MaxWidth({
  as: As = "div",
  size = "xl",
  className,
  children,
}: {
  as?: ElementType;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <As className={cn("mx-auto w-full px-5 md:px-8", sizeMap[size], className)}>
      {children}
    </As>
  );
}
