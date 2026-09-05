/**
 * Home page CMS bindings.
 *
 * Uses the `site_content` table under the `home` group. Every editable
 * field on the home page has a stable key here with a hard-coded fallback
 * so the page renders correctly before any admin edits are made.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listSiteContent, upsertSiteContent } from "@/lib/cms/content.functions";
import { site as staticSite } from "@/config/site";

export type HomeFieldKind = "text" | "textarea" | "json";

export type HomeFieldDef = {
  key: string;
  label: string;
  kind: HomeFieldKind;
  help?: string;
  rows?: number;
  defaultValue?: string | Record<string, unknown>;
};

export type HomeSectionDef = {
  id: string;
  label: string;
  description?: string;
  fields: HomeFieldDef[];
};

export const HOME_SECTIONS: HomeSectionDef[] = [
  {
    id: "hero",
    label: "الهيرو (مقدمة الموقع)",
    description: "العنوان الرئيسي، الوصف، نصوص الأزرار، ونقاط الثقة.",
    fields: [
      { key: "home.hero.badge", label: "شارة العرض والسعر", kind: "text", defaultValue: "مشاريع تبدأ من 300 ريال · متاح لمشاريع جديدة" },
      { key: "home.hero.headline_start", label: "السطر الأول من العنوان", kind: "text", defaultValue: "من فكرة في بالك" },
      { key: "home.hero.headline_end", label: "السطر الثاني من العنوان", kind: "text", defaultValue: "إلى مشروع تقدر تستخدمه." },
      { key: "home.hero.description", label: "الوصف تحت العنوان", kind: "textarea", rows: 3, defaultValue: "أصمم وأطوّر مواقع، متاجر وأنظمة إلكترونية مخصصة تخدم هدفك وتزيد مبيعاتك — من الفكرة إلى الإطلاق." },
      { key: "home.hero.cta_primary", label: "نص زر الإجراء الأول", kind: "text", defaultValue: "ابدأ مشروعك الآن" },
      { key: "home.hero.cta_secondary", label: "نص زر الإجراء الثاني", kind: "text", defaultValue: "شاهد أعمالي" },
      { key: "home.hero.microcopy", label: "الملاحظة أسفل الأزرار", kind: "text", defaultValue: "لا تعرف بالضبط وش تحتاج؟ أرسل فكرتك ونحدد الحل المناسب لها معًا." },
      { key: "home.hero.trust_1", label: "ميزة الثقة 1", kind: "text", defaultValue: "تسعير واضح قبل البدء" },
      { key: "home.hero.trust_2", label: "ميزة الثقة 2", kind: "text", defaultValue: "تسليم سريع وجودة عالية" },
      { key: "home.hero.trust_3", label: "ميزة الثقة 3", kind: "text", defaultValue: "تصميم وتطوير مخصص" },
    ],
  },
  {
    id: "services",
    label: "قسم الخدمات (ما أبنيه)",
    description: "ترويسة وعناوين قسم الخدمات والحلول الرقمية.",
    fields: [
      { key: "home.services.eyebrow", label: "الترويسة العلوية", kind: "text", defaultValue: "الخدمات والحلول" },
      { key: "home.services.title", label: "العنوان الرئيسي", kind: "text", defaultValue: "أحوّل أفكارك إلى منتجات رقمية حقيقية" },
      { key: "home.services.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "خدمات مصممة لمساعدتك على إطلاق وتطوير مشروعك الرقمي بأعلى معايير الجودة والسرعة." },
    ],
  },
  {
    id: "featured",
    label: "الأعمال المختارة (أعمالي)",
    description: "التحكم في ترويسة وعناوين ونصوص قسم الأعمال المختارة بالصفحة الرئيسية، وتحديد المشاريع الظاهرة فيه.",
    fields: [
      { key: "home.featured.eyebrow", label: "الترويسة العلوية", kind: "text", defaultValue: "أعمال مختارة" },
      { key: "home.featured.title", label: "العنوان الرئيسي", kind: "text", defaultValue: "أعمالي" },
      { key: "home.featured.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "مشاريع فعلية ونماذج عملية جمعت فيها بين التصميم، التطوير، وحل المشكلة." },
      { key: "home.featured.view_all", label: "نص زر استعراض الكل", kind: "text", defaultValue: "استكشف جميع الأعمال والدراسات" },
      { key: "home.featured.flagship_slug", label: "معرّف (Slug) المشروع الرئيسي الكبير (اختياري)", kind: "text", defaultValue: "", help: "إذا تُرك فارغًا، سيظهر تلقائيًا أول مشروع مفعّل كـ (مشروع مميز) في صفحة المشاريع." },
      { key: "home.featured.secondary_slugs", label: "معرّفات المشاريع الثانوية (مفصولة بفواصل)", kind: "text", defaultValue: "", help: "مثال: speakup, rent-right — إذا تُرك فارغًا، تظهر المشاريع المميزة التالية تلقائيًا." },
      { key: "home.featured.callout_title", label: "عنوان بطاقة الدعوة أسفل القسم", kind: "text", defaultValue: "شفت شغلي؟ عندك فكرة مشابهة؟" },
      { key: "home.featured.callout_description", label: "وصف بطاقة الدعوة", kind: "textarea", rows: 2, defaultValue: "أرسل فكرتك وسأساعدك في تحديد أنسب مسار لتنفيذها بأعلى كفاءة وبسعر عادل." },
      { key: "home.featured.callout_cta_primary", label: "نص الزر الأول في بطاقة الدعوة", kind: "text", defaultValue: "خلنا نبنيها" },
      { key: "home.featured.callout_cta_secondary", label: "نص الزر الثاني في بطاقة الدعوة", kind: "text", defaultValue: "استكشف جميع الأعمال" },
    ],
  },
  {
    id: "process",
    label: "كيف أعمل (خطوات العمل)",
    description: "ترويسة ووصف قسم خطوات تنفيذ المشروع.",
    fields: [
      { key: "home.process.eyebrow", label: "الترويسة العلوية", kind: "text", defaultValue: "كيف أعمل" },
      { key: "home.process.title", label: "العنوان الرئيسي", kind: "text", defaultValue: "من الفكرة إلى الإطلاق في 5 خطوات" },
      { key: "home.process.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "مسار عمل منظم وشفاف يضمن تسليم مشروعك بأعلى جودة وفي الوقت المحدد." },
    ],
  },
  {
    id: "offer",
    label: "عرض الـ 300 ريال",
    description: "نصوص وسعر وزر عرض البداية السريعة.",
    fields: [
      { key: "home.offer.badge", label: "شارة العرض", kind: "text", defaultValue: "عرض البداية السريعة" },
      { key: "home.offer.title", label: "العنوان", kind: "text", defaultValue: "ابدأ مشروعك الرقمي من 300 ريال" },
      { key: "home.offer.price", label: "السعر الظاهر", kind: "text", defaultValue: "300 ريال" },
      { key: "home.offer.description", label: "الوصف", kind: "textarea", rows: 3, defaultValue: "صفحة هبوط احترافية أو موقع تعريفي سريع مصمم ليعرض فكرتك ويبدأ في استقبال العملاء فورًا." },
      { key: "home.offer.cta", label: "نص الزر", kind: "text", defaultValue: "احجز مشروعك الآن" },
    ],
  },
  {
    id: "mvp",
    label: "النموذج الأولي MVP",
    description: "نصوص قسم بناء الأنظمة والمنصات التجريبية.",
    fields: [
      { key: "home.mvp.eyebrow", label: "الترويسة العلوية", kind: "text", defaultValue: "النموذج الأولي MVP" },
      { key: "home.mvp.title", label: "العنوان", kind: "text", defaultValue: "عندك فكرة منصة أو نظام كبير؟" },
      { key: "home.mvp.description", label: "الوصف", kind: "textarea", rows: 3, defaultValue: "لا تبدأ بالبناء الضخم وتكاليف عالية — ابنِ نموذج أولي (MVP) يختبر السوق ويجلب أول عملائك بسرعة وذكاء." },
      { key: "home.mvp.cta", label: "نص الزر", kind: "text", defaultValue: "ناقش فكرة مشروعك" },
    ],
  },
  {
    id: "about",
    label: "عني (النبذة الشخصية)",
    description: "ترويسة وعنوان ووصف قسم التعريف بمحمد هارون.",
    fields: [
      { key: "home.about.eyebrow", label: "الترويسة العلوية", kind: "text", defaultValue: "عني" },
      { key: "home.about.title", label: "العنوان", kind: "text", defaultValue: "وراء كل مشروع شخص يهتم بالتفاصيل" },
      { key: "home.about.description", label: "الوصف", kind: "textarea", rows: 3, defaultValue: "أنا محمد هارون، مطور ومصمم منتجات رقمية. أساعد الشركات الناشئة وأصحاب الأعمال على تحويل أفكارهم إلى منتجات ناجحة تخدم أهدافهم التجارية." },
      { key: "home.about.cta", label: "نص الزر", kind: "text", defaultValue: "تعرف عليّ أكثر" },
    ],
  },
  {
    id: "faq",
    label: "الأسئلة الشائعة",
    description: "ترويسة وعنوان قسم إجابات الأسئلة المتكررة.",
    fields: [
      { key: "home.faq.eyebrow", label: "الترويسة العلوية", kind: "text", defaultValue: "الأسئلة الشائعة" },
      { key: "home.faq.title", label: "العنوان", kind: "text", defaultValue: "إجابات على أكثر ما يدور في بالك" },
    ],
  },
  {
    id: "cta",
    label: "دعوة الختام (Final CTA)",
    description: "العنوان والوصف وأزرار الدعوة للإجراء في نهاية الصفحة.",
    fields: [
      { key: "home.cta.title", label: "العنوان", kind: "text", defaultValue: "جاهز تحوّل فكرتك إلى مشروع فعلي؟" },
      { key: "home.cta.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "تواصل معي اليوم، ونحدد موعد لمناقشة فكرتك والحل الأنسب لها مجانًا وبدون أي التزام." },
      { key: "home.cta.primary_label", label: "نص الزر الرئيسي", kind: "text", defaultValue: "ابدأ مشروعك الآن" },
      { key: "home.cta.secondary_label", label: "نص الزر الثانوي", kind: "text", defaultValue: "تواصل عبر واتساب" },
    ],
  },
];

export type HomeContentRow = {
  id: string;
  key: string;
  group_name: string;
  kind: string;
  value_ar: string | null;
  value_en: string | null;
  metadata: Record<string, unknown> | null;
  image_url: string | null;
  sort_order: number;
};

export function useHomeContent() {
  const fn = useServerFn(listSiteContent);
  return useQuery({
    queryKey: ["home-content"],
    queryFn: async () => (await fn({ data: { group_name: "home" } })) as HomeContentRow[],
    staleTime: 60_000,
  });
}

export function getHomeText(
  rows: HomeContentRow[] | undefined,
  key: string,
  fallback: string,
): string {
  const row = rows?.find((r) => r.key === key);
  const v = row?.value_ar;
  return v && v.trim().length > 0 ? v : fallback;
}

export function getHomeList<T>(
  rows: HomeContentRow[] | undefined,
  key: string,
  fallback: T[],
): T[] {
  const row = rows?.find((r) => r.key === key);
  const items = (row?.metadata as { items?: unknown })?.items;
  return Array.isArray(items) && items.length > 0 ? (items as T[]) : fallback;
}

export function useSaveHomeSection() {
  return useSavePageSection("home");
}

/* =====================================================================
 * Generic page-content bindings.
 *
 * Every content page can register a group of editable fields backed by
 * `site_content`. Public pages consume the group via `usePageContent()`
 * and `getPageText()/getPageList()`. The admin edits them via
 * `useSavePageSection()`, which reuses the same server function.
 * ===================================================================== */

/** Editable page groups exposed to the /admin/pages tab UI. */
export const PAGE_GROUPS: {
  id: string;
  label: string;
  sections: HomeSectionDef[];
}[] = [
  {
    id: "about",
    label: "من أنا",
    sections: [
      {
        id: "header",
        label: "ترويسة الصفحة",
        fields: [
          { key: "about.header.eyebrow", label: "الترويسة", kind: "text", defaultValue: "من أنا" },
          { key: "about.header.title", label: "العنوان", kind: "text", defaultValue: "أُصمّم وأُطوِّر منتجات رقمية بحرفة." },
          { key: "about.header.description", label: "الوصف", kind: "textarea", rows: 3, defaultValue: "مصمّم ومطوّر منتجات، أساعد الفرق في بناء تجارب رقمية هادئة وسريعة." },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "تواصل",
    sections: [
      {
        id: "header",
        label: "ترويسة الصفحة",
        fields: [
          { key: "contact.header.eyebrow", label: "الترويسة", kind: "text", defaultValue: "تواصل" },
          { key: "contact.header.title", label: "العنوان", kind: "text", defaultValue: "لنتحدّث" },
          { key: "contact.header.description", label: "الوصف", kind: "textarea", rows: 3, defaultValue: "شاركني تفاصيل مشروعك، وسأعود إليك خلال يومَي عمل." },
        ],
      },
      {
        id: "direct",
        label: "قسم التواصل المباشر",
        fields: [
          { key: "contact.direct.eyebrow", label: "الترويسة", kind: "text", defaultValue: "تُفضّل الطريق المباشر؟" },
          { key: "contact.direct.title", label: "العنوان", kind: "text", defaultValue: "تجاوز النموذج — راسلني مباشرة." },
          { key: "contact.direct.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "بريد، أو واتساب، أو لينكدإن — اختر ما يناسبك، والرد يصلك بنفس السرعة." },
        ],
      },
      {
        id: "faq",
        label: "الأسئلة الشائعة",
        fields: [
          { key: "contact.faq.eyebrow", label: "الترويسة", kind: "text", defaultValue: "الأسئلة الشائعة" },
          { key: "contact.faq.title", label: "العنوان", kind: "text", defaultValue: "قبل أن ترسل" },
          { key: "contact.faq.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "أسئلة يتكرّر طرحها. إن لم يكن سؤالك هنا، أرسله وسأجيبك بكلّ سرور." },
          {
            key: "contact.faq.items",
            label: "الأسئلة",
            kind: "json",
            help: 'JSON: { "items": [{"q","a"}, ...] }',
            rows: 14,
            defaultValue: {
              items: [
                { q: "كم يستغرق الرد عادةً؟", a: "خلال يومَي عمل، وغالبًا في اليوم نفسه إن وصلت الرسالة قبل الثالثة عصرًا بتوقيت السعوديّة." },
                { q: "هل تقبل المشاريع القصيرة؟", a: "نعم — من صفحة مقصودة خلال أسبوعين، إلى مشروع منتج متكامل. وإن لم أكن الشريك المناسب، أخبرك بصراحة." },
                { q: "ما الذي يُسرّع الرد؟", a: "ملخّص للمشكلة في سطر أو سطرين، والجدول الزمني، ونطاق ميزانيّة تقريبي إن أمكن." },
                { q: "هل تُوقّع اتفاقيّة عدم إفصاح؟", a: "بكلّ سرور — أُوقّع NDA متبادلة قبل المكالمة الأولى للأعمال الحسّاسة." },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: "career",
    label: "المسيرة",
    sections: [
      {
        id: "header",
        label: "ترويسة الصفحة",
        fields: [
          { key: "career.header.eyebrow", label: "الترويسة", kind: "text", defaultValue: "المسيرة" },
          { key: "career.header.title", label: "العنوان", kind: "text", defaultValue: "الخبرة والتعليم وما بينهما" },
          { key: "career.header.description", label: "الوصف", kind: "textarea", rows: 3, defaultValue: "محطات مختصرة، شهادات مختارة، ومهارات صقلتها في أرض الواقع." },
        ],
      },
    ],
  },
  {
    id: "work",
    label: "الأعمال",
    sections: [
      {
        id: "header",
        label: "ترويسة الصفحة",
        fields: [
          { key: "work.header.eyebrow", label: "الترويسة", kind: "text", defaultValue: "المشاريع" },
          { key: "work.header.title", label: "العنوان", kind: "text", defaultValue: "أعمال أفتخر بها" },
          { key: "work.header.description", label: "الوصف", kind: "textarea", rows: 3, defaultValue: "دراسات حالة موجزة لمنتجات حقيقية — من الفكرة إلى الإطلاق." },
        ],
      },
    ],
  },
  {
    id: "services-page",
    label: "الخدمات",
    sections: [
      {
        id: "header",
        label: "ترويسة الصفحة",
        fields: [
          { key: "services.header.eyebrow", label: "الترويسة", kind: "text", defaultValue: "الخدمات" },
          { key: "services.header.title", label: "العنوان", kind: "text", defaultValue: "تصميم وتطوير احترافي متكامل" },
          { key: "services.header.description", label: "الوصف", kind: "textarea", rows: 3, defaultValue: "خدمات مُنظّمة، لكلٍّ منها هدف واضح ونتيجة قابلة للقياس." },
        ],
      },
    ],
  },
  {
    id: "site",
    label: "هوية الموقع",
    sections: [
      {
        id: "identity",
        label: "المعلومات الأساسية",
        description: "تُستخدم في التذييل وبطاقات التواصل وبيانات التعريف.",
        fields: [
          { key: "site.name", label: "الاسم", kind: "text", defaultValue: "محمد هارون" },
          { key: "site.tagline", label: "الشعار المختصر", kind: "text", defaultValue: "أُصمّم وأُطوِّر منتجات رقمية تُحقّق نتائج واضحة." },
          { key: "site.description", label: "الوصف", kind: "textarea", rows: 3, defaultValue: "أعمال ومقالات وأفكار محمد هارون — مهندس منتجات ومصمم واجهات، أبني تجارب رقمية للشركات والعلامات التجارية." },
          { key: "site.email", label: "البريد الإلكتروني", kind: "text", defaultValue: "hello@mohammadharoon.com" },
          { key: "site.whatsapp", label: "رقم واتساب (E.164)", kind: "text", defaultValue: "+966500000000" },
          { key: "site.whatsappDisplay", label: "رقم واتساب (للعرض)", kind: "text", defaultValue: "+966 50 000 0000" },
          { key: "site.location", label: "الموقع", kind: "text", defaultValue: "الرياض · عن بُعد" },
          { key: "site.workingHours", label: "ساعات العمل", kind: "text", defaultValue: "الأحد–الخميس · 9:00 ص – 6:00 م" },
          { key: "site.availabilityLabel", label: "شارة التوفر", kind: "text", defaultValue: "متاح لمشاريع جديدة" },
        ],
      },
    ],
  },
];

/**
 * Merge CMS `site` group values over the static `site` config.
 * Reads from the cache primed by `usePageContent("site")`; returns
 * the static config unchanged until the CMS rows load.
 */
export function useSite() {
  const { data } = usePageContent("site");
  if (!data || data.length === 0) return staticSite;
  const g = (k: string, f: string) => getPageText(data, k, f);
  return {
    ...staticSite,
    name: g("site.name", staticSite.name),
    tagline: g("site.tagline", staticSite.tagline),
    description: g("site.description", staticSite.description),
    email: g("site.email", staticSite.email),
    whatsapp: g("site.whatsapp", staticSite.whatsapp),
    whatsappDisplay: g("site.whatsappDisplay", staticSite.whatsappDisplay),
    location: g("site.location", staticSite.location),
    workingHours: g("site.workingHours", staticSite.workingHours),
    availabilityLabel: g("site.availabilityLabel", staticSite.availabilityLabel),
  };
}

/** Fetch content rows for any group (home, about, contact, career, work, services-page…). */
export function usePageContent(group: string) {
  const fn = useServerFn(listSiteContent);
  return useQuery({
    queryKey: ["page-content", group],
    queryFn: async () => (await fn({ data: { group_name: group } })) as HomeContentRow[],
    staleTime: 60_000,
  });
}

/** Alias of `getHomeText` — kept for clarity when reading non-home groups. */
export const getPageText = getHomeText;

/** Alias of `getHomeList` — kept for clarity when reading non-home groups. */
export const getPageList = getHomeList;

/** Mutation to save a section into any group. */
export function useSavePageSection(group: string) {
  const upsertFn = useServerFn(upsertSiteContent);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      section: HomeSectionDef;
      values: Record<string, string>;
    }) => {
      const { section, values } = payload;
      for (const field of section.fields) {
        const raw = values[field.key];
        const body: Record<string, unknown> = {
          key: field.key,
          group_name: group,
          label: field.label,
          kind:
            field.kind === "json"
              ? "json"
              : field.kind === "textarea"
                ? "richtext"
                : "text",
          sort_order: 0,
        };
        if (field.kind === "json") {
          const parsed = raw && raw.trim().length > 0 ? JSON.parse(raw) : {};
          body.metadata = parsed;
        } else {
          body.value_ar = raw ?? "";
        }
        await upsertFn({ data: body as never });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["page-content", group] });
      if (group === "home") qc.invalidateQueries({ queryKey: ["home-content"] });
      qc.invalidateQueries({ queryKey: ["site_content"] });
      toast.success("تم الحفظ.");
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "تعذّر الحفظ.";
      toast.error(msg);
    },
  });
}

