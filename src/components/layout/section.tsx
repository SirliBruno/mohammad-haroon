import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

export function Section({
  id,
  className,
  bleed = false,
  children,
}: {
  id?: string;
  className?: string;
  bleed?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("py-20 md:py-28 lg:py-32", className)}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
