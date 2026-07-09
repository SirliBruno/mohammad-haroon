import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/ds/motion";

/** Page — top-level wrapper for every route body. Adds motion + spacing. */
export function Page({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <PageTransition>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </PageTransition>
  );
}
