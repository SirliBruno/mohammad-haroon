import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Grid — Vercel/Linear-quality responsive grid.
 * Common recipe: <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg" />.
 */
type Cols = 1 | 2 | 3 | 4 | 6 | 12;
type Gap = "none" | "sm" | "md" | "lg" | "xl";

const colMap: Record<Cols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
};
const smMap: Record<Cols, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  6: "sm:grid-cols-6",
  12: "sm:grid-cols-12",
};
const mdMap: Record<Cols, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
};
const lgMap: Record<Cols, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
};

const gapMap: Record<Gap, string> = {
  none: "gap-0",
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

export function Grid({
  cols = { base: 1, md: 2, lg: 3 },
  gap = "md",
  className,
  children,
}: {
  cols?: { base?: Cols; sm?: Cols; md?: Cols; lg?: Cols };
  gap?: Gap;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid",
        cols.base ? colMap[cols.base] : "grid-cols-1",
        cols.sm ? smMap[cols.sm] : "",
        cols.md ? mdMap[cols.md] : "",
        cols.lg ? lgMap[cols.lg] : "",
        gapMap[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}
