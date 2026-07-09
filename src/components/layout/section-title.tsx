import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/typography/eyebrow";

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  actions,
  className,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  actions?: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
        !centered && actions && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("min-w-0", centered && "max-w-2xl")}>
        {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
        <As className="text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl">
          {title}
        </As>
        {description ? (
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
