import { cn } from "@/lib/utils";

/** Kbd — inline keyboard shortcut. */
export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border/70 bg-muted px-1.5 font-mono text-[10px] font-medium uppercase text-muted-foreground shadow-xs",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
