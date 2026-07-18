/**
 * UI Samples — realistic-looking SaaS/store/editor placeholders.
 * Rendered as pure HTML/CSS so they scale inside device frames.
 * Replace individual instances with a real screenshot <img /> when available.
 */
import { cn } from "@/lib/utils";

/* ---------------- Analytics dashboard ---------------- */
export function DashboardUI({ className }: { className?: string }) {
  return (
    <div
      dir="ltr"
      className={cn(
        "flex h-full w-full bg-[#fafafa] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
        className,
      )}
    >
      {/* Sidebar */}
      <aside className="hidden w-[18%] shrink-0 border-r border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 sm:block">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded-md bg-neutral-900 dark:bg-white" />
          <div className="h-2 w-14 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <div className="mt-5 space-y-1.5">
          {["Overview", "Reports", "Cohorts", "Segments", "Sources"].map((l, i) => (
            <div
              key={l}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5",
                i === 0 && "bg-neutral-100 dark:bg-neutral-800",
              )}
            >
              <div className="size-3 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
              <div className="h-1.5 w-16 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
            <div className="h-2 w-10 rounded-sm bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-24 rounded-md bg-neutral-100 dark:bg-neutral-800" />
            <div className="size-6 rounded-full bg-emerald-500" />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-4 gap-3 p-4">
          {/* KPI cards */}
          {[
            { l: "MRR", v: "$48.2k", d: "+12.4%" },
            { l: "Active", v: "12,481", d: "+3.1%" },
            { l: "Churn", v: "1.8%", d: "-0.4%" },
            { l: "NPS", v: "72", d: "+6" },
          ].map((k) => (
            <div
              key={k.l}
              className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="text-[9px] uppercase tracking-wider text-neutral-500">{k.l}</div>
              <div className="mt-1 text-base font-semibold tracking-tight">{k.v}</div>
              <div className="mt-0.5 text-[9px] text-emerald-600">{k.d}</div>
            </div>
          ))}

          {/* Chart */}
          <div className="col-span-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <div className="h-2 w-20 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
              <div className="flex gap-1">
                {["7D", "30D", "90D"].map((r, i) => (
                  <div
                    key={r}
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[8px] font-medium",
                      i === 1
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "text-neutral-500",
                    )}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 400 120" className="mt-3 h-24 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dash-g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 90 L40 80 L80 85 L120 60 L160 65 L200 40 L240 48 L280 30 L320 38 L360 20 L400 25 L400 120 L0 120 Z"
                fill="url(#dash-g)"
                className="text-emerald-500"
              />
              <path
                d="M0 90 L40 80 L80 85 L120 60 L160 65 L200 40 L240 48 L280 30 L320 38 L360 20 L400 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-500"
              />
            </svg>
          </div>

          {/* Side stats */}
          <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="h-2 w-16 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
            <div className="mt-3 space-y-2">
              {[70, 55, 42, 28, 18].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-neutral-900 dark:bg-neutral-200"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                  <div className="w-6 text-right text-[8px] tabular-nums text-neutral-500">
                    {w}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="col-span-4 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2 dark:border-neutral-800">
              <div className="h-2 w-24 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
              <div className="h-5 w-14 rounded-md border border-neutral-200 dark:border-neutral-700" />
            </div>
            <div className="mt-2 space-y-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <div className="size-5 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                  <div className="h-1.5 flex-1 rounded-sm bg-neutral-100 dark:bg-neutral-800" />
                  <div className="h-1.5 w-16 rounded-sm bg-neutral-100 dark:bg-neutral-800" />
                  <div className="h-1.5 w-10 rounded-sm bg-emerald-500/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- E-commerce storefront ---------------- */
export function StoreUI({ className }: { className?: string }) {
  return (
    <div
      dir="ltr"
      className={cn(
        "h-full w-full overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
        className,
      )}
    >
      {/* Nav */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-3 dark:border-neutral-800">
        <div className="text-[10px] font-semibold tracking-[0.3em]">HAVEN</div>
        <div className="hidden gap-4 text-[9px] text-neutral-600 dark:text-neutral-400 sm:flex">
          <span>Shop</span>
          <span>Collections</span>
          <span>Journal</span>
          <span>About</span>
        </div>
        <div className="flex gap-3 text-[9px] text-neutral-600 dark:text-neutral-400">
          <span>Search</span>
          <span>Cart (2)</span>
        </div>
      </div>

      {/* Hero */}
      <div className="grid grid-cols-2 gap-4 p-6">
        <div className="flex flex-col justify-center">
          <div className="text-[9px] uppercase tracking-[0.3em] text-neutral-500">
            Spring collection
          </div>
          <div className="mt-3 text-2xl font-semibold leading-tight tracking-tight">
            Quiet essentials
            <br />
            for slow mornings.
          </div>
          <div className="mt-3 h-1.5 w-56 rounded-sm bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-1.5 h-1.5 w-40 rounded-sm bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-5 flex gap-2">
            <div className="rounded-full bg-neutral-900 px-3 py-1.5 text-[9px] font-medium text-white dark:bg-white dark:text-neutral-900">
              Shop now
            </div>
            <div className="rounded-full border border-neutral-300 px-3 py-1.5 text-[9px] font-medium dark:border-neutral-700">
              Lookbook
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-linear-to-br from-stone-200 via-stone-300 to-stone-400 dark:from-stone-700 dark:via-stone-800 dark:to-stone-900">
          <div className="absolute inset-6 rounded-md border border-white/40" />
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-4 gap-3 px-6 pb-6">
        {["Linen shirt", "Wool throw", "Ceramic mug", "Cedar candle"].map((n, i) => (
          <div key={n}>
            <div
              className={cn(
                "aspect-square rounded-md",
                [
                  "bg-linear-to-br from-amber-100 to-amber-200 dark:from-amber-950 dark:to-amber-900",
                  "bg-linear-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900",
                  "bg-linear-to-br from-emerald-100 to-emerald-200 dark:from-emerald-950 dark:to-emerald-900",
                  "bg-linear-to-br from-rose-100 to-rose-200 dark:from-rose-950 dark:to-rose-900",
                ][i],
              )}
            />
            <div className="mt-2 text-[9px] font-medium">{n}</div>
            <div className="text-[8px] text-neutral-500">${[68, 148, 24, 42][i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Editor / CMS ---------------- */
export function EditorUI({ className }: { className?: string }) {
  return (
    <div
      dir="ltr"
      className={cn(
        "flex h-full w-full bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
        className,
      )}
    >
      <aside className="hidden w-[20%] shrink-0 border-r border-neutral-200 p-3 dark:border-neutral-800 sm:block">
        <div className="text-[8px] uppercase tracking-[0.2em] text-neutral-500">Pages</div>
        <div className="mt-2 space-y-1">
          {["Home", "About", "Journal", "Contact"].map((p, i) => (
            <div
              key={p}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1 text-[10px]",
                i === 1 && "bg-neutral-100 dark:bg-neutral-800",
              )}
            >
              <div className="size-2 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
              {p}
            </div>
          ))}
        </div>
        <div className="mt-5 text-[8px] uppercase tracking-[0.2em] text-neutral-500">Blocks</div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-md border border-neutral-200 dark:border-neutral-800"
            />
          ))}
        </div>
      </aside>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-[9px] text-neutral-500">
            <span>Journal /</span>
            <span className="text-neutral-900 dark:text-neutral-100">A quieter kind of tool</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-md border border-neutral-200 px-2 py-1 text-[9px] dark:border-neutral-700">
              Draft
            </div>
            <div className="rounded-md bg-emerald-500 px-2 py-1 text-[9px] font-medium text-white">
              Publish
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-md space-y-3 p-6">
          <div className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
            Essay · 6 min
          </div>
          <div className="text-xl font-semibold tracking-tight">
            A quieter kind of tool.
          </div>
          <div className="h-32 rounded-md bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900" />
          <div className="space-y-1.5">
            {[100, 92, 96, 78, 88, 60].map((w, i) => (
              <div
                key={i}
                className="h-1.5 rounded-sm bg-neutral-200 dark:bg-neutral-800"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          <div className="mt-4 rounded-md border-l-2 border-emerald-500 bg-neutral-50 p-3 dark:bg-neutral-900">
            <div className="h-1.5 w-3/4 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
            <div className="mt-1.5 h-1.5 w-1/2 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Mobile app screen (for phone frame) ---------------- */
export function MobileAppUI({ className }: { className?: string }) {
  return (
    <div
      dir="ltr"
      className={cn(
        "flex h-full w-full flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 pt-3 text-[9px] font-medium">
        <span>9:41</span>
        <span className="flex gap-1">
          <span className="size-1 rounded-full bg-neutral-900 dark:bg-neutral-100" />
          <span className="size-1 rounded-full bg-neutral-900 dark:bg-neutral-100" />
          <span className="size-1 rounded-full bg-neutral-900 dark:bg-neutral-100" />
        </span>
      </div>
      <div className="px-4 pt-6">
        <div className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">Today</div>
        <div className="mt-1 text-lg font-semibold tracking-tight">Good morning.</div>
      </div>
      <div className="mt-4 space-y-2 px-4">
        <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
          <div className="text-[8px] uppercase tracking-wider text-neutral-500">Revenue</div>
          <div className="mt-1 text-lg font-semibold">$4,820</div>
          <div className="text-[9px] text-emerald-600">+12.4% this week</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
            <div className="text-[8px] text-neutral-500">Orders</div>
            <div className="mt-1 text-sm font-semibold">128</div>
          </div>
          <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
            <div className="text-[8px] text-neutral-500">Visitors</div>
            <div className="mt-1 text-sm font-semibold">3,204</div>
          </div>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-4 border-t border-neutral-200 py-2 dark:border-neutral-800">
        {["Home", "Sales", "Insights", "You"].map((l, i) => (
          <div
            key={l}
            className={cn(
              "text-center text-[8px]",
              i === 0 ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500",
            )}
          >
            <div
              className={cn(
                "mx-auto mb-0.5 size-2 rounded-full",
                i === 0
                  ? "bg-neutral-900 dark:bg-neutral-100"
                  : "bg-neutral-300 dark:bg-neutral-700",
              )}
            />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Tablet reading UI ---------------- */
export function TabletReadUI({ className }: { className?: string }) {
  return (
    <div
      dir="ltr"
      className={cn(
        "flex h-full w-full bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
        className,
      )}
    >
      <aside className="hidden w-[24%] shrink-0 border-r border-neutral-200 p-3 dark:border-neutral-800 sm:block">
        <div className="h-2 w-16 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-1.5 w-24 rounded-sm bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-1.5 w-16 rounded-sm bg-neutral-100 dark:bg-neutral-900" />
            </div>
          ))}
        </div>
      </aside>
      <div className="flex-1 p-5">
        <div className="text-[8px] uppercase tracking-[0.2em] text-neutral-500">Issue 04</div>
        <div className="mt-1 text-lg font-semibold tracking-tight">The craft of restraint.</div>
        <div className="mt-3 h-24 rounded-md bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            {[100, 92, 88, 76, 82].map((w, i) => (
              <div
                key={i}
                className="h-1.5 rounded-sm bg-neutral-200 dark:bg-neutral-800"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          <div className="space-y-1.5">
            {[100, 78, 90, 84, 66].map((w, i) => (
              <div
                key={i}
                className="h-1.5 rounded-sm bg-neutral-200 dark:bg-neutral-800"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
