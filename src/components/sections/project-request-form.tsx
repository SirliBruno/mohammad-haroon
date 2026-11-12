import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Container } from "@/components/layout/container";
import { Reveal, SectionReveal } from "@/components/motion/reveal";
import { CheckCircle2, Shield, Sparkles, MessageCircle, ExternalLink } from "lucide-react";
import { site } from "@/config/site";
import { toast } from "sonner";
import { submitProjectRequest } from "@/lib/project-request.functions";

const PROJECT_TYPES = [
  "موقع",
  "متجر",
  "نظام",
  "منصة",
  "تصميم",
  "غير ذلك",
] as const;

const CURRENT_PROBLEMS = [
  "ما عندي موقع أو صفحة واضحة",
  "متجري يحتاج تحسين",
  "أتابع الشغل يدويًا بين واتساب وExcel",
  "عندي فكرة تطبيق أو منصة",
  "عندي موقع أو نظام يحتاج تطوير",
  "غير متأكد",
] as const;

const NEED_TYPES = [
  "تصميم",
  "برمجة",
  "تصميم + برمجة",
  "تطوير مشروع موجود",
  "غير متأكد",
] as const;

const BUDGET_RANGES = [
  "499 – 1,000 ريال",
  "1,000 – 3,000 ريال",
  "3,000 – 5,000 ريال",
  "أكثر",
  "غير متأكد",
] as const;

export function ProjectRequestForm() {
  const [projectType, setProjectType] = useState<string>("موقع");
  const [currentProblem, setCurrentProblem] = useState<string>("ما عندي موقع أو صفحة واضحة");
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(["تصميم + برمجة"]);
  const [idea, setIdea] = useState("");
  const [budget, setBudget] = useState<string>("499 – 1,000 ريال");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const saveRequest = useServerFn(submitProjectRequest);

  // Listen for problem card clicks from other sections
  useEffect(() => {
    const handleProblemSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ projectType?: string; problem?: string }>;
      if (customEvent.detail) {
        if (customEvent.detail.projectType) {
          setProjectType(customEvent.detail.projectType);
        }
        if (customEvent.detail.problem) {
          setCurrentProblem(customEvent.detail.problem);
        }
      }
    };

    window.addEventListener("select-problem", handleProblemSelect);
    return () => window.removeEventListener("select-problem", handleProblemSelect);
  }, []);

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need)
        ? prev.filter((n) => n !== need)
        : [...prev, need],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error("يرجى كتابة رقم WhatsApp للتواصل");
      return;
    }

    if (!idea.trim()) {
      toast.error("يرجى كتابة وصف مبسط لفكرتك أو مشروعك");
      return;
    }

    const needsString = selectedNeeds.length > 0 ? selectedNeeds.join("، ") : "غير محدد";
    const senderName = name.trim() || "غير محدد";

    const messageText = `السلام عليكم محمد،

أبغى أبدأ مشروع جديد معك.

📌 نوع المشروع:
${projectType}

⚠️ التحدي / المشكلة الحالية:
${currentProblem}

🛠️ الاحتياج:
${needsString}

💡 فكرة المشروع:
${idea.trim()}

💰 الميزانية التقريبية:
${budget}

👤 الاسم: ${senderName}
📱 رقم التواصل: ${phone.trim()}`;

    const cleanWhatsapp = site.whatsapp.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(messageText)}`;

    setGeneratedUrl(whatsappUrl);

    // Save to Supabase first (non-blocking for UX — we open WhatsApp regardless)
    setSaving(true);
    try {
      await saveRequest({
        data: {
          name: senderName,
          phone: phone.trim(),
          projectType,
          currentProblem,
          needs: selectedNeeds,
          idea: idea.trim(),
          budget,
        },
      });
    } catch (err) {
      // Log but don't block — WhatsApp message is the primary channel
      console.warn("[project-request] DB save failed:", err);
    } finally {
      setSaving(false);
    }

    setSubmitted(true);
    toast.success("تم تجهيز رسالتك! جارٍ فتح WhatsApp...");

    try {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch {
      // Fallback in UI
    }
  };

  return (
    <SectionReveal id="contact-form" className="relative overflow-hidden border-t border-border/60 py-16 sm:py-24">
      {/* Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/6 blur-3xl"
      />

      <Container>
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-gradient-accent-subtle px-3 py-0.5 text-xs font-semibold text-accent">
                <Sparkles className="size-3.5" /> نبدأ مباشرة
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-display">
                خلنا نبدأ بفكرتك
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                املأ التفاصيل وسنتواصل معك فورًا عبر WhatsApp لمناقشة الفكرة والبدء بالتنفيذ.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-8 rounded-3xl glass-card glass-specular-eased p-6 sm:p-8 shadow-xl">
              {submitted ? (
                <div className="py-6 text-center space-y-4">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <CheckCircle2 className="size-7" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    تم تجهيز رسالتك بنجاح!
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    تم إعداد رسالتك بالكامل وتحديد المشكلة ونوع المشروع. إذا لم تفتح نافذة WhatsApp تلقائيًا، اضغط على الزر أدناه للمتابعة مباشرة.
                  </p>

                  <div className="pt-2">
                    <a
                      href={generatedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-accent-eased hover:bg-gradient-accent-hover px-7 py-3.5 text-sm font-bold text-accent-foreground shadow-glow shadow-accent/25 transition-all hover:shadow-[0_0_24px_rgba(6,182,212,0.45)]"
                    >
                      <MessageCircle className="size-4.5" />
                      فتح المحادثة في WhatsApp
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>

                  <div className="pt-3 border-t border-border/40">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-xs text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
                    >
                      تعديل البيانات أو إرسال فكرة أخرى
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 1. Project Type */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
                      1. وش نوع مشروعك؟
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PROJECT_TYPES.map((type) => {
                        const active = projectType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setProjectType(type)}
                            className={`flex items-center justify-center rounded-lg border py-2 text-xs font-medium transition-all cursor-pointer ${
                              active
                                ? "border-accent bg-accent/10 text-foreground font-semibold"
                                : "border-border/70 bg-background/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. What is stopping you currently */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
                      2. وش أكثر شيء يوقفك حاليًا؟
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CURRENT_PROBLEMS.map((prob) => {
                        const active = currentProblem === prob;
                        return (
                          <button
                            key={prob}
                            type="button"
                            onClick={() => setCurrentProblem(prob)}
                            className={`flex items-center justify-between rounded-lg border p-2.5 text-right text-xs transition-all cursor-pointer ${
                              active
                                ? "border-accent bg-accent/10 text-foreground font-semibold"
                                : "border-border/70 bg-background/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <span className="truncate">{prob}</span>
                            <span
                              className={`size-3 rounded-full flex items-center justify-center border text-[8px] shrink-0 mr-2 ${
                                active
                                  ? "border-accent bg-accent text-white"
                                  : "border-muted-foreground/40"
                              }`}
                            >
                              {active && "✓"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Needs */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
                      3. وش تحتاج؟
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {NEED_TYPES.map((need) => {
                        const active = selectedNeeds.includes(need);
                        return (
                          <button
                            key={need}
                            type="button"
                            onClick={() => toggleNeed(need)}
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all cursor-pointer ${
                              active
                                ? "border-accent bg-accent/10 text-foreground font-semibold"
                                : "border-border/70 bg-background/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <span
                              className={`size-3 rounded flex items-center justify-center border text-[8px] ${
                                active
                                  ? "border-accent bg-accent text-white"
                                  : "border-muted-foreground/40"
                              }`}
                            >
                              {active && "✓"}
                            </span>
                            {need}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Idea Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="idea-input"
                        className="text-xs sm:text-sm font-semibold text-foreground"
                      >
                        4. احكِ لي عن فكرتك <span className="text-accent">*</span>
                      </label>
                      <span className="text-[11px] text-accent font-medium">مطلوب</span>
                    </div>
                    <textarea
                      id="idea-input"
                      required
                      rows={3}
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="اشرح فكرتك باختصار (مثال: متجر عطور، أو نظام لإدارة الحجوزات والمواعيد)..."
                      className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground input-gradient-focus leading-relaxed"
                    />
                  </div>

                  {/* 5. Budget */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
                      5. الميزانية التقريبية
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {BUDGET_RANGES.map((b) => {
                        const active = budget === b;
                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBudget(b)}
                            className={`rounded-lg border px-3 py-1.5 text-xs transition-all cursor-pointer ${
                              active
                                ? "border-accent bg-accent/10 text-foreground font-semibold"
                                : "border-border/70 bg-background/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6. Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-border/50 pt-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="phone-input"
                          className="text-xs font-semibold text-foreground"
                        >
                          رقم WhatsApp للتواصل <span className="text-accent">*</span>
                        </label>
                        <span className="text-[10px] text-accent font-medium">مطلوب</span>
                      </div>
                      <input
                        id="phone-input"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05XXXXXXXX"
                        className="h-10 w-full rounded-lg border border-border/80 bg-background px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground input-gradient-focus text-left"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="name-input"
                          className="text-xs font-semibold text-foreground"
                        >
                          الاسم الكريم
                        </label>
                        <span className="text-[10px] text-muted-foreground">اختياري</span>
                      </div>
                      <input
                        id="name-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: عبد الله"
                        className="h-10 w-full rounded-lg border border-border/80 bg-background px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground input-gradient-focus"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-accent-eased hover:bg-gradient-accent-hover py-3.5 text-sm font-bold text-accent-foreground shadow-glow shadow-accent/25 transition-all hover:shadow-[0_0_26px_rgba(6,182,212,0.45)] active:scale-[0.99] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                          جارٍ الإرسال…
                        </>
                      ) : (
                        <>
                          <MessageCircle className="size-4.5" />
                          أرسل فكرتي عبر WhatsApp
                        </>
                      )}
                    </button>
                    <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                      <Shield className="size-3 text-accent" />
                      بياناتك في أمان تام وتصل مباشرة لمحمد هارون.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </SectionReveal>
  );
}
