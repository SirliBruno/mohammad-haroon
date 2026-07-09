import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Prose — long-form typography wrapper. */
export function Prose({
  children,
  className,
  size = "base",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "base" | "lg";
}) {
  const sizeCls =
    size === "lg" ? "text-lg" : size === "sm" ? "text-sm" : "text-base";
  return (
    <div
      className={cn(
        sizeCls,
        "max-w-prose leading-relaxed text-foreground/90",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold",
        "[&_p]:mt-4",
        "[&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline",
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:ps-6 [&_ul>li]:mt-1.5",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_ol>li]:mt-1.5",
        "[&_blockquote]:mt-6 [&_blockquote]:border-s-2 [&_blockquote]:border-primary/40 [&_blockquote]:ps-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]",
        "[&_hr]:my-10 [&_hr]:border-border/60",
        className,
      )}
    >
      {children}
    </div>
  );
}
