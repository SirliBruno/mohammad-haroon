import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLiveEdit } from "./live-edit-context";
import { toast } from "sonner";
import { ExternalLink, Sparkles, Check, X } from "lucide-react";

export function QuickCardDrawer() {
  const { activeDrawer, closeDrawer, setLiveDraft, getLiveText } = useLiveEdit();

  // Local state for the card being edited
  const [formFields, setFormFields] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!activeDrawer) {
      setFormFields({});
      return;
    }

    const { type, id, data = {} } = activeDrawer;
    const initial: Record<string, string> = {};

    if (type === "service") {
      initial.title = getLiveText(`service.${id}.title`, data.title || "");
      initial.description = getLiveText(`service.${id}.description`, data.description || "");
      initial.example = getLiveText(`service.${id}.example`, data.example || "");
      initial.timeline = getLiveText(`service.${id}.timeline`, data.timeline || "");
      initial.idealFor = getLiveText(`service.${id}.idealFor`, data.idealFor || "");
      initial.detailedBenefit = getLiveText(
        `service.${id}.detailedBenefit`,
        data.detailedBenefit || "",
      );
      initial.ctaText = getLiveText(`service.${id}.ctaText`, data.ctaText || "");
    } else if (type === "project") {
      initial.title = getLiveText(`project.${id}.title`, data.title || "");
      initial.summary = getLiveText(`project.${id}.summary`, data.summary || "");
      initial.client = getLiveText(`project.${id}.client`, data.client || "");
      initial.live_url = getLiveText(`project.${id}.live_url`, data.live_url || "");
    } else {
      // Generic
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "string") {
          initial[key] = getLiveText(`${type}.${id}.${key}`, data[key]);
        }
      });
    }

    setFormFields(initial);
  }, [activeDrawer, getLiveText]);

  if (!activeDrawer) return null;

  const { type, id } = activeDrawer;

  const handleFieldChange = (key: string, value: string) => {
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyDraft = () => {
    Object.entries(formFields).forEach(([fieldKey, val]) => {
      setLiveDraft(`${type}.${id}.${fieldKey}`, val, type === "service" ? "services" : "projects");
    });
    toast.success("تم إدراج تعديلات البطاقة في المسودة. اضغط 'حفظ ونشر' لتطبيقها!");
    closeDrawer();
  };

  return (
    <Sheet open={!!activeDrawer} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-lg overflow-y-auto font-sans p-6 bg-card border-border/80"
      >
        <SheetHeader className="text-right border-b border-border/60 pb-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
              <Sparkles className="size-3" />
              {type === "service" ? "تعديل بطاقة خدمة" : "تعديل بطاقة عمل"}
            </span>
            <Link
              to={type === "service" ? "/admin/services" : "/admin/projects"}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
              target="_blank"
            >
              <span>لوحة التحكم الكاملة</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
          <SheetTitle className="text-xl font-bold font-display text-foreground mt-2">
            {formFields.title || "تعديل محتوى البطاقة"}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            تعديل فوري لنصوص وبيانات هذه البطاقة. التعديلات تحفظ في المسودة لتتمكن من مراجعتها قبل النشر.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-5 text-right">
          {type === "service" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="service-title" className="text-xs font-semibold">
                  عنوان الخدمة
                </Label>
                <Input
                  id="service-title"
                  value={formFields.title || ""}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="service-desc" className="text-xs font-semibold">
                  الوصف المختصر للخدمة
                </Label>
                <Textarea
                  id="service-desc"
                  rows={2}
                  value={formFields.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="service-example" className="text-xs font-semibold">
                  مثال واقعي يوضح الخدمة
                </Label>
                <Textarea
                  id="service-example"
                  rows={2}
                  value={formFields.example || ""}
                  onChange={(e) => handleFieldChange("example", e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="service-timeline" className="text-xs font-semibold">
                    مدة التنفيذ المتوقعة
                  </Label>
                  <Input
                    id="service-timeline"
                    value={formFields.timeline || ""}
                    onChange={(e) => handleFieldChange("timeline", e.target.value)}
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="service-cta" className="text-xs font-semibold">
                    نص زر الإجراء (CTA)
                  </Label>
                  <Input
                    id="service-cta"
                    value={formFields.ctaText || ""}
                    onChange={(e) => handleFieldChange("ctaText", e.target.value)}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="service-ideal" className="text-xs font-semibold">
                  الخدمة مناسبة لمَن؟
                </Label>
                <Input
                  id="service-ideal"
                  value={formFields.idealFor || ""}
                  onChange={(e) => handleFieldChange("idealFor", e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="service-benefit" className="text-xs font-semibold">
                  القيمة المضافة والتفصيلية
                </Label>
                <Textarea
                  id="service-benefit"
                  rows={3}
                  value={formFields.detailedBenefit || ""}
                  onChange={(e) => handleFieldChange("detailedBenefit", e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </>
          )}

          {type === "project" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="project-title" className="text-xs font-semibold">
                  اسم المشروع
                </Label>
                <Input
                  id="project-title"
                  value={formFields.title || ""}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project-summary" className="text-xs font-semibold">
                  نبذة عن المشروع
                </Label>
                <Textarea
                  id="project-summary"
                  rows={3}
                  value={formFields.summary || ""}
                  onChange={(e) => handleFieldChange("summary", e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="project-client" className="text-xs font-semibold">
                    العميل / الجهة
                  </Label>
                  <Input
                    id="project-client"
                    value={formFields.client || ""}
                    onChange={(e) => handleFieldChange("client", e.target.value)}
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="project-url" className="text-xs font-semibold">
                    رابط المعاينة المباشر
                  </Label>
                  <Input
                    id="project-url"
                    value={formFields.live_url || ""}
                    onChange={(e) => handleFieldChange("live_url", e.target.value)}
                    className="text-left"
                    dir="ltr"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="flex flex-row items-center justify-between gap-3 border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={closeDrawer}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
            <span>إلغاء</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleApplyDraft}
            className="gap-1.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 px-4 text-xs font-bold shadow-sm"
          >
            <Check className="size-3.5" />
            <span>اعتماد في المسودة</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
