import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/typography/eyebrow";

type Size = "default" | "sm";

const titleScale: Record<Size, string> = {
  default: "text-3xl md:text-4xl lg:text-5xl",
  sm: "text-2xl md:text-3xl",
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  actions,
  className,
  as: As = "h2",
  size = "default",
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  actions?: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  size?: Size;
  id?: string;
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
        <As
          id={id}
          className={cn(
            "font-semibold tracking-tight text-foreground text-balance",
            titleScale[size],
          )}
        >
          {title}
        </As>
        {description ? (
          <p
            className={cn(
              "mt-3 max-w-2xl text-muted-foreground",
              size === "sm" ? "text-base" : "text-base md:text-lg",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
