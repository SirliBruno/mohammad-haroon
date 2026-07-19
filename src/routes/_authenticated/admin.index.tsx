import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHomePage,
  head: () => ({ meta: [{ title: "لوحة الإدارة" }] }),
});

const CARDS: { to: string; title: string; description: string; group: string }[] = [
  { to: "/admin/content", title: "نصوص وصور الموقع", description: "تحكم بعناوين ونصوص وصور الأقسام العامة عبر مفاتيح.", group: "المحتوى" },
  { to: "/admin/hero", title: "قسم الهيرو", description: "مشاريع تظهر في نوافذ الصفحة الرئيسية.", group: "الصفحة الرئيسية" },
  { to: "/admin/projects", title: "المشاريع", description: "معرض الأعمال الكامل مع الحالة والفئات.", group: "الأعمال" },
  { to: "/admin/services", title: "الخدمات", description: "صفحات الخدمات: المزايا، الميزات، الأسعار.", group: "الأعمال" },
  { to: "/admin/testimonials", title: "التوصيات", description: "شهادات العملاء والتقييمات.", group: "الأعمال" },
  { to: "/admin/blog", title: "المدونة", description: "المقالات، الفئات، الوسوم، الجدولة.", group: "الكتابة" },
  { to: "/admin/ideas", title: "الأفكار", description: "مسودات وأفكار قيد التطوير.", group: "الكتابة" },
  { to: "/admin/products", title: "المنتجات", description: "منتجات رقمية للبيع أو العرض.", group: "الكتابة" },
  { to: "/admin/experiences", title: "الخبرات", description: "المسيرة المهنية والمناصب.", group: "السيرة" },
  { to: "/admin/certificates", title: "الشهادات", description: "الشهادات المهنية والاعتمادات.", group: "السيرة" },
  { to: "/admin/skills", title: "المهارات", description: "المهارات مع المستوى والفئات.", group: "السيرة" },
  { to: "/admin/messages", title: "الرسائل الواردة", description: "رسائل من نموذج التواصل.", group: "التواصل" },
  { to: "/admin/analytics", title: "قياس التحويل", description: "أحداث funnel من المشاهدات حتى إرسال التواصل.", group: "التواصل" },
  { to: "/admin/media", title: "مكتبة الوسائط", description: "إدارة الملفات والصور المرفوعة.", group: "التواصل" },
];

function AdminHomePage() {
  const groups = CARDS.reduce<Record<string, typeof CARDS>>((acc, c) => {
    (acc[c.group] ??= []).push(c);
    return acc;
  }, {});

  return (
    <AdminShell
      title="لوحة الإدارة"
      description="مركز التحكم بمحتوى الموقع. اختر قسمًا للبدء بالتعديل."
    >
      <div className="flex flex-col gap-8">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">{group}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((c) => (
                <Link
                  key={c.to}
                  to={c.to}
                  className="group rounded-xl border border-neutral-200 bg-white p-5 hover:border-neutral-400 hover:shadow-sm transition-all dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
                >
                  <h4 className="font-semibold group-hover:underline">{c.title}</h4>
                  <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{c.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
