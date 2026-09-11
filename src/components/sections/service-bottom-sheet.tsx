"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  CheckCircle2,
  Clock,
  Target,
  ArrowLeft,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { site } from "@/config/site";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "./what-i-build";

/**
 * Icons8 icon renderer using CSS mask.
 * Renders Icons8 assets with full currentColor inheritance.
 */
function Icons8Icon({
  id,
  className = "size-5",
  alt = "",
}: {
  id: string;
  className?: string;
  alt?: string;
}) {
  const url = `https://img.icons8.com/?id=${id}&format=png&size=48`;
  return (
    <span
      role="img"
      aria-label={alt}
      className={cn("inline-block shrink-0 bg-current transition-colors", className)}
      style={{
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

export type ServiceBottomSheetService = Partial<ServiceItem> & {
  title: string;
  startingAt?: string;
  overview?: string;
  slug?: string;
};

export interface ServiceBottomSheetProps {
  service: ServiceBottomSheetService | null;
  open: boolean;
  onClose: () => void;
  onOrder?: (service: ServiceBottomSheetService) => void;
}

export function ServiceBottomSheet({ service, open, onClose, onOrder }: ServiceBottomSheetProps) {
  const hydrated = useHydrated();

  // Lock body scroll when the bottom sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!hydrated) return null;

  const whatsappUrl = service
    ? `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `السلام عليكم محمد، أود الاستفسار عن خدمة: ${service.title}`,
      )}`
    : "";

  return createPortal(
    <AnimatePresence>
      {open && service && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={service.title}
          className="fixed inset-0 z-50 pointer-events-auto"
        >
          {/* Backdrop overlay */}
          <motion.div
            key="bottom-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Frosted Glass Container */}
          <motion.div
            key="bottom-sheet-container"
            role="document"
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 350) {
                onClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-[28px] border-t border-x border-border/80 bg-background/85 dark:bg-[#080c16]/90 shadow-2xl glass-specular overflow-hidden"
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            {/* Specular Highlight Rim Line */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent z-10"
              aria-hidden="true"
            />

            {/* Drag Handle Indicator */}
            <div className="pt-2 pb-1 shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30 mx-auto cursor-grab active:cursor-grabbing" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-5 pb-3.5 pt-1 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent shadow-xs backdrop-blur-md">
                  {service.iconId ? (
                    <Icons8Icon
                      id={service.iconId}
                      className="size-6 text-accent"
                      alt={service.title}
                    />
                  ) : (
                    <Sparkles className="size-6 text-accent" />
                  )}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {service.categoryLabel && (
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                        {service.categoryLabel}
                      </span>
                    )}
                    {service.number && (
                      <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                        #{service.number}
                      </span>
                    )}
                    {service.badge && (
                      <span className="rounded-full border border-accent/30 bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="truncate font-display text-lg sm:text-xl font-bold text-foreground leading-tight">
                    {service.title}
                  </h3>
                </div>
              </div>

              {/* Explicit Close Button with min 48x48px touch target */}
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق تفاصيل الخدمة"
                className="inline-flex size-12 min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/60 text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto px-5 pb-6 pt-3 space-y-4 overscroll-contain">
              {/* Detailed Description / Benefit */}
              {(service.detailedBenefit || service.description || service.overview) && (
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                  {service.detailedBenefit || service.description || service.overview}
                </p>
              )}

              {/* Deliverables Checklist */}
              {service.deliverables && service.deliverables.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                    <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      ماذا تستلم في هذا المشروع؟
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {service.deliverables.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-card/60 p-3 text-xs leading-relaxed text-foreground/90 backdrop-blur-xs transition-colors hover:border-accent/30"
                      >
                        <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline & Pricing Badges */}
              {(service.timeline || service.startingAt) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {service.timeline && (
                    <div className="rounded-xl border border-border/60 bg-card/60 p-3 backdrop-blur-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Clock className="size-4 text-accent shrink-0" />
                        <span>المدة المتوقعة:</span>
                      </div>
                      <span className="text-xs font-bold text-accent">{service.timeline}</span>
                    </div>
                  )}
                  {service.startingAt && (
                    <div className="rounded-xl border border-border/60 bg-card/60 p-3 backdrop-blur-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Target className="size-4 text-accent shrink-0" />
                        <span>يبدأ من:</span>
                      </div>
                      <span className="text-xs font-bold text-accent">{service.startingAt}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Target Audience ("الأنسب لمين؟") */}
              {service.idealFor && (
                <div className="rounded-xl border border-border/60 bg-card/60 p-3 sm:p-3.5 backdrop-blur-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-1">
                    <Target className="size-3.5 text-accent shrink-0" />
                    <span>الأنسب لمين؟</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {service.idealFor}
                  </p>
                </div>
              )}

              {/* Real World Example ("مثال واقعي") */}
              {service.example && (
                <div className="rounded-xl border border-accent/30 bg-accent/5 p-3 sm:p-3.5 text-xs leading-relaxed backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 font-bold text-accent mb-1">
                    <Sparkles className="size-3.5 text-accent shrink-0" />
                    <span>مثال واقعي من التطبيق العملي:</span>
                  </div>
                  <p className="text-foreground/90">{service.example}</p>
                </div>
              )}
            </div>

            {/* Fixed / Sticky Bottom CTA Bar */}
            <div className="sticky bottom-0 z-10 mt-auto border-t border-border/80 bg-background/95 dark:bg-[#080c16]/95 p-4 backdrop-blur-md flex flex-col sm:flex-row items-center gap-2.5 shadow-lg shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[48px] h-12 w-full sm:flex-1 items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/70 px-4 text-xs sm:text-sm font-bold text-foreground hover:bg-muted/80 hover:border-accent/40 transition-all shadow-xs"
              >
                <MessageCircle className="size-4 text-accent shrink-0" />
                <span>محادثة واتساب مباشرة</span>
                <ExternalLink className="size-3.5 text-muted-foreground shrink-0" />
              </a>

              <button
                type="button"
                onClick={() => {
                  if (onOrder) {
                    onOrder(service);
                  } else {
                    onClose();
                    if (service.projectType || service.problemScenario) {
                      window.dispatchEvent(
                        new CustomEvent("select-problem", {
                          detail: {
                            projectType: service.projectType,
                            problem: service.problemScenario,
                          },
                        }),
                      );
                    }
                  }
                }}
                className="inline-flex min-h-[48px] h-12 w-full sm:flex-1 items-center justify-center gap-2 rounded-xl bg-accent text-accent-foreground px-5 text-xs sm:text-sm font-bold shadow-md hover:opacity-95 hover:shadow-lg transition-all cursor-pointer"
              >
                <span>طلب هذه الخدمة الآن</span>
                <ArrowLeft className="size-4 shrink-0" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
