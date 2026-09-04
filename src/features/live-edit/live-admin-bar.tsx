import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Save,
  RotateCcw,
  LayoutDashboard,
  Loader2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { useLiveEdit } from "./live-edit-context";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LiveAdminBar() {
  const {
    isAdmin,
    isEditMode,
    toggleEditMode,
    dirtyKeys,
    saveAllChanges,
    discardAllChanges,
    isSaving,
  } = useLiveEdit();

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Zero footprint for visitors or unauthenticated users
  if (!isAdmin) {
    return null;
  }

  const dirtyCount = dirtyKeys.size;

  if (isCollapsed) {
    return (
      <aside
        aria-label="شريط أدوات الإدارة المباشرة"
        className="fixed bottom-5 left-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300"
      >
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 rounded-full border border-accent/40 bg-card/95 px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xl backdrop-blur-md hover:border-accent hover:bg-accent/10 transition-all cursor-pointer"
          title="فتح شريط التحرير المباشر"
        >
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>شريط الإدارة</span>
          {dirtyCount > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-black">
              {dirtyCount}
            </span>
          )}
          <ChevronUp className="size-3.5 text-muted-foreground" />
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="شريط التحرير المباشر"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 rounded-2xl border border-accent/40 bg-card/95 p-2 sm:p-2.5 text-foreground shadow-2xl backdrop-blur-xl ring-1 ring-white/10 font-sans">
        {/* Status indicator & Edit Mode Switch */}
        <div className="flex items-center gap-2.5 ps-2 pe-1 border-e border-border/70">
          <div className="relative flex items-center justify-center">
            <span
              className={cn(
                "size-2.5 rounded-full transition-colors",
                isEditMode ? "bg-accent shadow-[0_0_8px_var(--color-accent,#0d9488)] animate-pulse" : "bg-muted-foreground/50",
              )}
            />
          </div>

          <label
            htmlFor="live-edit-switch"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer select-none"
          >
            <Sparkles className="size-3.5 text-accent" />
            <span>وضع التحرير</span>
          </label>

          <Switch
            id="live-edit-switch"
            checked={isEditMode}
            onCheckedChange={toggleEditMode}
            className="data-[state=checked]:bg-accent cursor-pointer"
          />
        </div>

        {/* Dirty Changes Info & Action Buttons */}
        {isEditMode && (
          <div className="flex items-center gap-2">
            {dirtyCount > 0 ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-medium">
                <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>{dirtyCount} تعديل معلق</span>
              </div>
            ) : (
              <span className="hidden md:inline-block text-xs text-muted-foreground px-1">
                انقر على أي نص لتعديله
              </span>
            )}

            <Button
              size="sm"
              variant="default"
              disabled={dirtyCount === 0 || isSaving}
              onClick={() => void saveAllChanges()}
              className="h-8 gap-1.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 px-3 text-xs font-bold shadow-sm cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              <span>حفظ ونشر</span>
              <kbd className="hidden lg:inline-block ms-1 rounded bg-black/20 px-1 py-0.5 text-[9px] font-mono">
                ⌘S
              </kbd>
            </Button>

            {dirtyCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                disabled={isSaving}
                onClick={discardAllChanges}
                className="h-8 gap-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 px-2.5 text-xs cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span className="hidden sm:inline">تراجع</span>
              </Button>
            )}
          </div>
        )}

        {/* Dashboard Link & Minimize Button */}
        <div className="flex items-center gap-1 ps-1">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            title="الانتقال إلى لوحة الإدارة الكاملة"
          >
            <LayoutDashboard className="size-3.5" />
            <span className="hidden sm:inline">لوحة التحكم</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="rounded-xl p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            title="تصغير الشريط"
          >
            <ChevronDown className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
