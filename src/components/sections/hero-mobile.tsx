import { Link } from "@tanstack/react-router";
import { Sparkles, Layers, ArrowLeft, CheckCircle2 } from "lucide-react";
import { BrowserFrame } from "@/components/mockups/devices";
import { DashboardUI } from "@/components/mockups/ui-samples";

export function HeroMobile() {
  return (
    <div className="relative mt-8 select-none">
      {/* Container with subtle glow */}
      <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-xl shadow-black/5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-bold text-foreground">CampFlow</span>
          </div>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
            Featured SaaS
          </span>
        </div>

        {/* Compact UI Preview */}
        <div className="mt-3 overflow-hidden rounded-xl border border-border/70 bg-muted/20 scale-[0.98] origin-top">
          <BrowserFrame url="campflow.app">
            <DashboardUI />
          </BrowserFrame>
        </div>

        {/* Quick Details */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <span className="font-medium text-foreground">منصة إدارة المعسكرات</span>
          <Link
            to="/work/$slug"
            params={{ slug: "campflow" }}
            className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
          >
            دراسة الحالة
            <ArrowLeft className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
