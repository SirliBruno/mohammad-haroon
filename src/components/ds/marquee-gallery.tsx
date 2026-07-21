import { useCallback, useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Media } from "@/features/projects/schema";
import { cn } from "@/lib/utils";

/**
 * MarqueeGallery — Infinite dual-row horizontal marquee with lightbox.
 * - Two rows scroll in opposite directions (pure CSS keyframes).
 * - Content is duplicated once; the animation shifts by exactly 50% so the
 *   loop is seamless with zero jump.
 * - Pauses on hover/touch. Respects prefers-reduced-motion (becomes a manual
 *   horizontal scroll).
 * - Click any image to open a fullscreen lightbox with keyboard navigation.
 */
export function MarqueeGallery({
  items,
  className,
}: {
  items: Media[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Split into two rows for the dual-direction effect.
  const { rowA, rowB } = useMemo(() => {
    if (items.length <= 3) return { rowA: items, rowB: items };
    const mid = Math.ceil(items.length / 2);
    return { rowA: items.slice(0, mid), rowB: items.slice(mid) };
  }, [items]);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );

  // Keyboard: ESC to close, arrows to navigate. RTL-aware.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") next(); // visual "next" in RTL
      else if (e.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    // Lock background scroll while open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  if (!items.length) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Edge fade mask so images dissolve into the page at both sides. */}
      <div
        className="marquee-mask group/marquee flex flex-col gap-4 md:gap-6"
        dir="ltr"
      >
        <MarqueeRow items={rowA} direction="left" speed={45} onOpen={(m) => setOpenIndex(items.indexOf(m))} />
        <MarqueeRow items={rowB} direction="right" speed={55} onOpen={(m) => setOpenIndex(items.indexOf(m))} />
      </div>

      {/* Lightbox */}
      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="عرض الصورة"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 p-4 backdrop-blur-xl animate-fade-in"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="إغلاق"
            className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-border/60 bg-background/80 text-foreground shadow-lg backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
          >
            <X className="size-5" aria-hidden />
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="السابق"
                className="absolute right-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-border/60 bg-background/80 text-foreground shadow-lg backdrop-blur transition-colors hover:border-primary/50 hover:text-primary md:right-8"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="التالي"
                className="absolute left-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-border/60 bg-background/80 text-foreground shadow-lg backdrop-blur transition-colors hover:border-primary/50 hover:text-primary md:left-8"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
            </>
          ) : null}

          <figure
            className="relative max-h-[90vh] max-w-[92vw] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[openIndex].src}
              alt={items[openIndex].alt}
              className="max-h-[90vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            />
            {items[openIndex].alt ? (
              <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                {items[openIndex].alt}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
  speed,
  onOpen,
}: {
  items: Media[];
  direction: "left" | "right";
  speed: number; // seconds for one full cycle
  onOpen: (m: Media) => void;
}) {
  // Duplicate items so translating -50% loops seamlessly.
  const doubled = [...items, ...items];
  return (
    <div className="marquee-row group/row overflow-hidden">
      <ul
        className="marquee-track flex w-max gap-4 md:gap-6"
        style={
          {
            animationDuration: `${speed}s`,
            animationDirection: direction === "left" ? "normal" : "reverse",
          } as React.CSSProperties
        }
      >
        {doubled.map((m, i) => (
          <li key={i} className="shrink-0">
            <button
              type="button"
              onClick={() => onOpen(m)}
              aria-label={m.alt || "فتح الصورة"}
              className="group/card block h-[200px] overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-md transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl md:h-[300px]"
            >
              <img
                src={m.src}
                alt={m.alt}
                loading="lazy"
                draggable={false}
                className="h-full w-auto max-w-none object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
