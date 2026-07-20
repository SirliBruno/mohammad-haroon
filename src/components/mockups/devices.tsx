/**
 * Device frames — Laptop, Phone, Tablet, Browser.
 * Content is passed via children so each frame can host either
 * a UI sample component or a real screenshot <img />.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------- Browser window ---------------- */
export function BrowserFrame({
  children,
  url = "example.com",
  className,
}: {
  children: ReactNode;
  url?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div
        dir="ltr"
        className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-2 py-1 sm:gap-2 sm:px-3 sm:py-2"
      >
        <div className="flex gap-1 sm:gap-1.5">
          <span className="size-1.5 rounded-full bg-red-400/70 sm:size-2.5" />
          <span className="size-1.5 rounded-full bg-amber-400/70 sm:size-2.5" />
          <span className="size-1.5 rounded-full bg-emerald-400/70 sm:size-2.5" />
        </div>
        <div className="mx-auto flex h-3.5 max-w-[60%] flex-1 items-center justify-center rounded bg-background/70 px-2 text-[8px] text-muted-foreground sm:h-5 sm:rounded-md sm:text-[10px]">
          {url}
        </div>
        <div className="w-6 sm:w-10" />
      </div>
      <div className="aspect-[16/10] w-full bg-background">{children}</div>
    </div>
  );
}

/* ---------------- Laptop (MacBook-style) ---------------- */
export function LaptopFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {/* Screen */}
      <div className="relative mx-auto w-full rounded-[14px] border border-neutral-800/80 bg-neutral-900 p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] dark:border-neutral-700">
        <div className="absolute left-1/2 top-1 z-10 -translate-x-1/2">
          <div className="h-1 w-16 rounded-b-md bg-neutral-800" />
        </div>
        <div className="overflow-hidden rounded-[8px] bg-background">
          <div className="aspect-[16/10] w-full">{children}</div>
        </div>
      </div>
      {/* Base */}
      <div className="relative mx-auto -mt-[1px] h-2 w-[102%] rounded-b-2xl bg-linear-to-b from-neutral-300 to-neutral-400 dark:from-neutral-700 dark:to-neutral-800">
        <div className="absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 rounded-b-md bg-neutral-400 dark:bg-neutral-700" />
      </div>
      <div
        aria-hidden
        className="mx-auto h-6 w-[90%] rounded-b-[50%] bg-linear-to-b from-black/10 to-transparent blur-md dark:from-black/40"
      />
    </div>
  );
}

/* ---------------- Phone (iPhone-style) ---------------- */
export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-[2.25rem] border border-neutral-700/60 bg-neutral-900 p-[3px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] sm:rounded-[2.75rem] sm:p-[4px] dark:border-neutral-800",
        className,
      )}
    >
      {/* Outer bezel highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/5"
      />
      <div className="relative overflow-hidden rounded-[2rem] bg-black sm:rounded-[2.5rem]">
        {/* Dynamic Island */}
        <div className="pointer-events-none absolute left-1/2 top-1.5 z-10 h-4 w-14 -translate-x-1/2 rounded-full bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:top-2 sm:h-5 sm:w-20" />
        <div className="aspect-[9/19.5] w-full overflow-hidden rounded-[2rem] bg-background sm:rounded-[2.5rem]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Phone (Samsung Galaxy S25 Ultra) ---------------- */
export function GalaxyS25UltraFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // S25 Ultra: boxier silhouette, sharper corners, thin uniform bezel, titanium frame
        "relative rounded-[1.75rem] border border-neutral-700/70 bg-linear-to-b from-neutral-800 via-neutral-900 to-neutral-800 p-[3px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:rounded-[2rem] sm:p-[4px] dark:border-neutral-800",
        className,
      )}
    >
      {/* Titanium rail highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10"
      />
      {/* Side buttons hint (right side) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[2px] top-[26%] h-10 w-[2px] rounded-l bg-neutral-700"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[2px] top-[38%] h-6 w-[2px] rounded-l bg-neutral-700"
      />
      <div className="relative overflow-hidden rounded-[1.55rem] bg-black sm:rounded-[1.8rem]">
        {/* Centered punch-hole camera */}
        <div className="pointer-events-none absolute left-1/2 top-1.5 z-10 size-2 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10 sm:top-2 sm:size-2.5" />
        <div className="aspect-[9/19.5] w-full overflow-hidden rounded-[1.55rem] bg-background sm:rounded-[1.8rem]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Tablet (iPad-style) ---------------- */
export function TabletFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] border-[8px] border-neutral-900 bg-neutral-900 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.5)] dark:border-neutral-800",
        className,
      )}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-[0.5rem] bg-background">
        {children}
      </div>
    </div>
  );
}
