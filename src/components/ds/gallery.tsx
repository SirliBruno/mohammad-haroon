import type { Media } from "@/features/projects/schema";
import { cn } from "@/lib/utils";

/** Gallery — Vercel-style asymmetric image grid. */
export function Gallery({
  items,
  className,
}: {
  items: Media[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4",
        className,
      )}
    >
      {items.map((m, i) => (
        <figure
          key={m.src + i}
          className={cn(
            "relative overflow-hidden rounded-lg border border-border/60 bg-muted",
            i % 5 === 0 && "col-span-2 row-span-2",
          )}
        >
          <img
            src={m.src}
            alt={m.alt}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
          />
        </figure>
      ))}
    </div>
  );
}
