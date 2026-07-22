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
    label: "الهيرو",
    description: "الشارة العلوية، الوصف، والأزرار الرئيسية.",
    fields: [
      { key: "home.hero.badge", label: "شارة الحالة", kind: "text", defaultValue: "متاح لمشاريع جديدة" },
      { key: "home.hero.description", label: "الوصف تحت العنوان", kind: "textarea", rows: 3, defaultValue: "مواقع وأنظمة رقمية تجمع تصميمًا هادئًا بأداءٍ سريع.\nنبنيها معك لتخدم عملك وتليق باسمك." },
      { key: "home.hero.cta_primary_label", label: "نص الزر الرئيسي", kind: "text", defaultValue: "استعرض الأعمال" },
      { key: "home.hero.cta_secondary_label", label: "نص الزر الثانوي", kind: "text", defaultValue: "عندك فكرة ؟" },
    ],
  },
  {
    id: "featured",
    label: "أعمال مختارة",
    description: "ترويسة قسم المشاريع المميزة. البطاقات نفسها تُدار من قسم المشاريع.",
    fields: [
      { key: "home.featured.eyebrow", label: "الترويسة", kind: "text", defaultValue: "أعمال مختارة" },
      { key: "home.featured.title", label: "العنوان", kind: "text", defaultValue: "مختـــــــارات من شغـــــــــلي." },
      { key: "home.featured.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "مشاريع وانظمة برمجية صُممت لتحقيق أهداف فعلية، لا مجرد مظهر جميل." },
      { key: "home.featured.view_all", label: "نص زر (كل الأعمال)", kind: "text", defaultValue: "كل الأعمال" },
    ],
  },
  {
    id: "services",
    label: "الخدمات",
    fields: [
      { key: "home.services.eyebrow", label: "الترويسة", kind: "text", defaultValue: "الخدمات" },
      { key: "home.services.title", label: "العنوان", kind: "text", defaultValue: "ما الذي أُقدّمه." },
      { key: "home.services.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "خدمات قصيرة الوصف، واضحة النتيجة — لا مصطلحات، ولا وعود مفتوحة." },
      { key: "home.services.view_all", label: "نص زر (كل الخدمات)", kind: "text", defaultValue: "كل الخدمات" },
      {
        key: "home.services.items",
        label: "قائمة الخدمات",
        kind: "json",
        help: 'JSON: { "items": [{"slug","title","outcome","tags":[]}, ...] }',
        rows: 14,
        defaultValue: {
          items: [
            { slug: "web-development", title: "مواقع أعمال", outcome: "مواقع حديثة تحوّل الزوّار إلى عملاء.", tags: ["React", "Next.js", "TanStack"] },
            { slug: "ecommerce", title: "متاجر إلكترونية", outcome: "متاجر مكتملة، جاهزة للنموّ من اليوم الأول.", tags: ["Shopify", "WooCommerce", "Stripe"] },
            { slug: "ui-ux-design", title: "تصميم واجهات وتجربة", outcome: "تجارب رقمية يستمتع المستخدمون باستخدامها.", tags: ["Figma", "أنظمة تصميم", "بحث UX"] },
            { slug: "wordpress", title: "ووردبريس", outcome: "مواقع سريعة، قابلة للتوسّع، وسهلة الإدارة.", tags: ["WordPress", "WooCommerce", "SEO"] },
          ],
        },
      },
    ],
  },
  {
    id: "process",
    label: "طريقة العمل",
    fields: [
      { key: "home.process.eyebrow", label: "الترويسة", kind: "text", defaultValue: "طريقة العمل" },
      { key: "home.process.title", label: "العنوان", kind: "text", defaultValue: "من فكرة إلى منتج مُطلَق." },
      { key: "home.process.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "عملية مُنظّمة من ستّ مراحل، مُصمّمة للوضوح وسرعة اتّخاذ القرار." },
      {
        key: "home.process.steps",
        label: "المراحل",
        kind: "json",
        help: 'JSON: { "items": [{"step","title","description"}, ...] }',
        rows: 16,
        defaultValue: {
          items: [
            { step: "01", title: "اكتشاف", description: "أفهم أهدافك وجمهورك ومنافسيك قبل أي خط." },
            { step: "02", title: "استراتيجية", description: "نُحدّد النطاق والنتائج وخارطة الطريق." },
            { step: "03", title: "تصميم", description: "واجهة واضحة، ونظام قابل للتوسّع، ومعاينة قابلة للاختبار." },
            { step: "04", title: "تطوير", description: "كود نظيف، أداء عالٍ، وجاهزية للنشر من اليوم الأول." },
            { step: "05", title: "إطلاق", description: "نشر مُراقَب، وضبط SEO، وتتبّع تحليلات فعلي." },
            { step: "06", title: "دعم", description: "متابعة بعد الإطلاق، وتحديثات، وقياس النتائج." },
          ],
        },
      },
    ],
  },
  {
    id: "experience",
    label: "الخبرات",
    description: "ترويسة القسم فقط — بيانات الخبرات تُدار من صفحة الخبرات.",
    fields: [
      { key: "home.experience.eyebrow", label: "الترويسة", kind: "text", defaultValue: "المسيرة" },
      { key: "home.experience.title", label: "العنوان", kind: "text", defaultValue: "محطات مختصرة." },
      { key: "home.experience.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "نظرة سريعة على الأدوار التي شكّلت طريقتي في العمل." },
      { key: "home.experience.view_all", label: "نص زر (السيرة الكاملة)", kind: "text", defaultValue: "السيرة الكاملة" },
    ],
  },
  {
    id: "certificates",
    label: "الشهادات",
    fields: [
      { key: "home.certificates.eyebrow", label: "الترويسة", kind: "text", defaultValue: "الشهادات" },
      { key: "home.certificates.title", label: "العنوان", kind: "text", defaultValue: "تعلُّم مُستمر." },
      { key: "home.certificates.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "شهادات مختارة من برامج تُواكب صناعة المنتجات الرقمية." },
      {
        key: "home.certificates.items",
        label: "الشهادات الظاهرة في الهوم",
        kind: "json",
        help: 'JSON: { "items": [{"title","issuer","issuedAt"}, ...] }',
        rows: 12,
        defaultValue: {
          items: [
            { title: "مطوّر واجهات أمامية — Meta", issuer: "Meta", issuedAt: "2025" },
            { title: "تصميم تجربة المستخدم — Google", issuer: "Google", issuedAt: "2024" },
            { title: "شهادة شريك Shopify", issuer: "Shopify", issuedAt: "2024" },
            { title: "أنماط React المتقدمة", issuer: "Frontend Masters", issuedAt: "2024" },
          ],
        },
      },
    ],
  },
  {
    id: "testimonials",
    label: "التوصيات",
    description: "ترويسة قسم التوصيات — البطاقات تأتي من قسم التوصيات.",
    fields: [
      { key: "home.testimonials.eyebrow", label: "الترويسة", kind: "text", defaultValue: "شهادات" },
      { key: "home.testimonials.title", label: "العنوان", kind: "text", defaultValue: "بكلمات من عملت معهم." },
    ],
  },
  {
    id: "cta",
    label: "دعوة الختام",
    fields: [
      { key: "home.cta.eyebrow", label: "الترويسة", kind: "text", defaultValue: "لنبدأ" },
      { key: "home.cta.title", label: "العنوان", kind: "text", defaultValue: "لنُطلق معًا شيئًا يستحقّ." },
      { key: "home.cta.description", label: "الوصف", kind: "textarea", rows: 2, defaultValue: "محادثة قصيرة تكفي لنعرف إن كنّا الشريكين المناسبين لهذا المشروع." },
      { key: "home.cta.primary_label", label: "نص الزر الرئيسي", kind: "text", defaultValue: "تواصل معي" },
      { key: "home.cta.secondary_label", label: "نص الزر الثانوي", kind: "text", defaultValue: "استعرض الأعمال" },
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

