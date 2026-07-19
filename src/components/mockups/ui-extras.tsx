/**
 * Extra miniature UI samples used inside the mobile hero "orbit".
 * Kept intentionally small and legible at ~120–200px widths.
 */
import { cn } from "@/lib/utils";

/* ---------------- POS terminal ---------------- */
export function PosUI({ className }: { className?: string }) {
  return (
    <div
      dir="ltr"
      className={cn(
        "flex h-full w-full bg-neutral-950 text-neutral-100",
        className,
      )}
    >
      <div className="flex flex-1 flex-col p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
            Table 07
          </span>
          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[7px] font-medium text-emerald-400">
            Open
          </span>
        </div>
        <div className="mt-2 space-y-1">
          {[
            { n: "Ristretto", p: "12" },
            { n: "Focaccia", p: "18" },
            { n: "Burrata", p: "24" },
          ].map((r) => (
            <div
              key={r.n}
              className="flex items-center justify-between rounded-md bg-neutral-900 px-2 py-1"
            >
              <span className="text-[8px]">{r.n}</span>
              <span className="text-[8px] tabular-nums text-neutral-400">
                ${r.p}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-neutral-800 pt-1.5">
          <span className="text-[8px] text-neutral-500">Total</span>
          <span className="text-[10px] font-semibold">$54.00</span>
        </div>
      </div>
      <div className="w-[38%] shrink-0 border-l border-neutral-800 p-1.5">
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-sm text-center text-[7px] leading-[1.8]",
                i === 8
                  ? "bg-emerald-500 text-white"
                  : "bg-neutral-900 text-neutral-400",
              )}
            >
              {i === 8 ? "OK" : i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Booking calendar ---------------- */
export function BookingUI({ className }: { className?: string }) {
  return (
    <div
      dir="ltr"
      className={cn(
        "flex h-full w-full flex-col bg-white p-2.5 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-semibold tracking-tight">March</span>
        <div className="flex gap-1">
          <span className="size-3 rounded-sm bg-neutral-100 dark:bg-neutral-900" />
          <span className="size-3 rounded-sm bg-neutral-100 dark:bg-neutral-900" />
        </div>
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-[3px] text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <span
            key={d}
            className="text-[6.5px] font-medium text-neutral-500"
          >
            {d}
          </span>
        ))}
        {Array.from({ length: 21 }).map((_, i) => {
          const day = i + 3;
          const active = day === 14;
          const busy = [7, 12, 18, 21].includes(day);
          return (
            <span
              key={i}
              className={cn(
                "grid aspect-square place-items-center rounded-[3px] text-[7px] tabular-nums",
                active
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : busy
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "text-neutral-500",
              )}
            >
              {day}
            </span>
          );
        })}
      </div>
      <div className="mt-2 space-y-1">
        {[
          { t: "09:00", n: "Consult" },
          { t: "11:30", n: "Fitting" },
        ].map((s) => (
          <div
            key={s.t}
            className="flex items-center gap-2 rounded-md bg-neutral-100 px-1.5 py-1 dark:bg-neutral-900"
          >
            <span className="text-[7px] font-semibold tabular-nums">{s.t}</span>
            <span className="text-[7px] text-neutral-500">{s.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Restaurant ordering ---------------- */
export function RestaurantUI({ className }: { className?: string }) {
  return (
    <div
      dir="ltr"
      className={cn(
        "flex h-full w-full flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
        className,
      )}
    >
      <div className="relative h-10 bg-linear-to-br from-amber-200 via-rose-200 to-orange-300 dark:from-amber-900 dark:via-rose-900 dark:to-orange-900">
        <span className="absolute bottom-1 left-2 text-[8px] font-semibold tracking-tight">
          Menu
        </span>
      </div>
      <div className="flex gap-1 border-b border-neutral-200 px-2 py-1 dark:border-neutral-800">
        {["Pizza", "Pasta", "Salads"].map((c, i) => (
          <span
            key={c}
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[7px]",
              i === 0
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "text-neutral-500",
            )}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="flex-1 space-y-1 p-1.5">
        {[
          { n: "Margherita", p: "14" },
          { n: "Truffle", p: "22" },
          { n: "Diavola", p: "18" },
        ].map((r) => (
          <div
            key={r.n}
            className="flex items-center gap-1.5 rounded-md border border-neutral-200 p-1 dark:border-neutral-800"
          >
            <span className="size-6 shrink-0 rounded-sm bg-linear-to-br from-amber-200 to-rose-200 dark:from-amber-900 dark:to-rose-900" />
            <div className="min-w-0 flex-1">
              <div className="text-[7.5px] font-medium">{r.n}</div>
              <div className="text-[6.5px] text-neutral-500">${r.p}</div>
            </div>
            <span className="grid size-3.5 place-items-center rounded-full bg-neutral-900 text-[8px] font-semibold text-white dark:bg-white dark:text-neutral-900">
              +
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
