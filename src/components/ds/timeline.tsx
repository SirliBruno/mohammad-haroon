import { cn } from "@/lib/utils";

export type TimelineItem = {
  date: string;
  title: string;
  description?: string;
  meta?: string;
};

export function Timeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  return (
    <ol className={cn("relative border-s border-border/70 ps-6", className)}>
      {items.map((item, i) => (
        <li key={i} className="relative pb-10 last:pb-0">
          <span
            aria-hidden
            className="absolute -start-[7px] top-1.5 size-3 rounded-full border-2 border-background bg-primary"
          />
          <p className="text-xs font-medium tracking-wider text-muted-foreground">
            {item.date}
          </p>
          <h4 className="mt-1 text-base font-semibold text-foreground">{item.title}</h4>
          {item.meta ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
          ) : null}
          {item.description ? (
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">{item.description}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
