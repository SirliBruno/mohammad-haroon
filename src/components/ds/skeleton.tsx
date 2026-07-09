import { cn } from "@/lib/utils";

/** Reusable shimmer skeleton primitives. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer-bg rounded-md", className)} />;
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card p-6", className)}>
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}
