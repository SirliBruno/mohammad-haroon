import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { Media } from "@/features/projects/schema";
import { cn } from "@/lib/utils";

/**
 * MarqueeGallery — Dual-Row Bi-Directional Infinite UI Screen Showcase
 * - Row 1 (Top): Continuous smooth translation to the Left (←).
 * - Row 2 (Bottom): Continuous smooth translation to the Right (→).
 * - Multi-cycle item replication: zero-seam loop without gaps or jumps.
 * - Hardware accelerated: translate3d + will-change.
 * - IntersectionObserver: automatically pauses when scrolled off-screen.
 * - Hover & Touch pause: auto-pauses on pointer enter or active touch.
 * - Soft Edge Gradient Masks: gradient mask and fallback fade overlays.
 * - Accessible Fullscreen Lightbox with keyboard navigation.
 */
export function MarqueeGallery({
  items,
  className,
}: {
  items: Media[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  // Pause GPU animation loops when outside the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "150px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split into two distinct rows for dual-direction effect
  const { rowA, rowB } = useMemo(() => {
    if (!items || items.length === 0) return { rowA: [], rowB: [] };
    if (items.length <= 3) return { rowA: items, rowB: items };

    // Interleave items so both rows showcase an even distribution of screens
    const a: Media[] = [];
    const b: Media[] = [];
    items.forEach((item, idx) => {
      if (idx % 2 === 0) {
        a.push(item);
      } else {
        b.push(item);
      }
    });

    return {
      rowA: a.length > 0 ? a : items,
      rowB: b.length > 0 ? b : items,
    };
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

  const openMedia = useCallback(
    (m: Media) => {
      const idx = items.findIndex((it) => it.src === m.src);
      setOpenIndex(idx !== -1 ? idx : 0);
    },
    [items]
  );

  // Keyboard navigation for lightbox: Escape to exit, Arrows to cycle
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") next();
      else if (e.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  if (!items.length) return null;

  return (
    <div
      ref={containerRef}
      className={cn("relative group/marquee-container overflow-hidden py-4 select-none", className)}
      aria-label="معرض شاشات وواجهات المشروع التفاعلي"
    >
      {/* Soft gradient edge fade overlays (fallback and enhancer for mask-image) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 md:w-36 bg-linear-to-r from-background via-background/85 to-transparent z-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 md:w-36 bg-linear-to-l from-background via-background/85 to-transparent z-20"
      />

      {/* Dual Row Marquee Stack with CSS mask */}
      <div
        className="marquee-mask flex flex-col gap-4 md:gap-6 relative z-10"
        dir="ltr"
      >
        {/* Row 1: Leftward infinite translation (←) */}
        <MarqueeRow
          items={rowA}
          direction="left"
          speed={48}
          isPlaying={isInView}
          onOpen={openMedia}
        />

        {/* Row 2: Rightward infinite translation (→) */}
        <MarqueeRow
          items={rowB}
          direction="right"
          speed={56}
          isPlaying={isInView}
          onOpen={openMedia}
        />
      </div>

      {/* Fullscreen Lightbox Modal */}
      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="عرض شاشة المشروع بدقة كاملة"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-2xl animate-fade-in"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="إغلاق"
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                aria-label="الشاشة السابقة"
                className="absolute right-4 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:right-8"
              >
                <ChevronRight className="size-6" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="الشاشة التالية"
                className="absolute left-4 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:left-8"
              >
                <ChevronLeft className="size-6" aria-hidden />
              </button>
            </>
          ) : null}

          <figure
            className="relative max-h-[92vh] max-w-[94vw] animate-scale-in flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[openIndex].src}
              alt={items[openIndex].alt || `شاشة واجهة ${openIndex + 1}`}
              className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl border border-border/70"
            />
            {items[openIndex].alt ? (
              <figcaption className="mt-3 text-center text-sm font-medium text-muted-foreground px-4 py-1.5 rounded-full bg-card/60 backdrop-blur-md border border-border/50">
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
  isPlaying,
  onOpen,
}: {
  items: Media[];
  direction: "left" | "right";
  speed: number;
  isPlaying: boolean;
  onOpen: (m: Media) => void;
}) {
  const [isTouchPaused, setIsTouchPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Guarantee loop seamlessness by repeating items until the half-block is comfortably wide
  const seamlessItems = useMemo(() => {
    if (!items.length) return [];
    let base = [...items];
    while (base.length < 5) {
      base = [...base, ...items];
    }
    // Duplicate exactly once: translating -50% creates an infinite loop
    return [...base, ...base];
  }, [items]);

  const animationClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div
      className="marquee-row group/row overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouchPaused(true)}
      onTouchEnd={() => setIsTouchPaused(false)}
      onTouchCancel={() => setIsTouchPaused(false)}
    >
      <ul
        className={cn(
          "marquee-track flex w-max gap-4 md:gap-6 will-change-transform",
          animationClass
        )}
        style={{
          animationDuration: `${speed}s`,
          animationPlayState: isPlaying && !isTouchPaused && !isHovered ? "running" : "paused",
        }}
      >
        {seamlessItems.map((m, i) => (
          <li key={`${m.src}-${i}`} className="shrink-0">
            <button
              type="button"
              onClick={() => onOpen(m)}
              aria-label={m.alt || `عرض الشاشة ${i + 1}`}
              className="group/card relative block h-[200px] sm:h-[240px] md:h-[280px] lg:h-[310px] overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-1.5 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-[1.025] hover:border-accent/60 hover:shadow-xl hover:shadow-accent/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="relative h-full w-auto overflow-hidden rounded-xl bg-muted">
                <img
                  src={m.src}
                  alt={m.alt || "شاشة واجهة"}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-auto max-w-none object-cover transition-transform duration-500 group-hover/card:scale-105"
                />

                {/* Specular glass highlight on card */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/10 dark:from-white/5 dark:to-black/30"
                />

                {/* Hover zoom indicator pill */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 bg-background/30 backdrop-blur-[2px]"
                >
                  <span className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md">
                    <Maximize2 className="size-3.5 text-accent" /> تكبير الشاشة
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
