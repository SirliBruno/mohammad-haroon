import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { countNewMessages } from "@/lib/cms/messages.functions";
import { adminListProjects } from "@/lib/cms/projects.functions";
import { getFunnelSummary } from "@/lib/cms/analytics.functions";
import {
  FileText,
  Sparkles,
  FolderKanban,
  Wrench,
  MessagesSquare,
  BookOpen,
  Lightbulb,
  Package,
  Briefcase,
  Award,
  GraduationCap,
  Inbox,
  Image as ImageIcon,
  LineChart,
  ArrowLeft,
  FileStack,
  ScrollText,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHomePage,
  head: () => ({ meta: [{ title: "لوحة الإدارة" }] }),
});

type Card = { to: string; title: string; description: string; group: string; icon: LucideIcon };

const CARDS: Card[] = [
  { to: "/admin/home", title: "أقسام الصفحة الرئيسية", description: "نصوص وعناوين وأزرار كافة أقسام الصفحة الرئيسية.", group: "الصفحة الرئيسية", icon: LayoutDashboard },
  { to: "/admin/hero", title: "قسم الهيرو التفاعلي", description: "مشاريع تظهر في نوافذ الهيرو التفاعلية.", group: "الصفحة الرئيسية", icon: Sparkles },
  { to: "/admin/content", title: "نصوص وصور الموقع", description: "تحكم بعناوين ونصوص وصور الأقسام العامة.", group: "المحتوى", icon: FileText },
  { to: "/admin/pages", title: "محتوى الصفحات", description: "ترويسات وأوصاف صفحات من أنا، تواصل، الأعمال.", group: "المحتوى", icon: FileStack },
  { to: "/admin/projects", title: "المشاريع", description: "معرض الأعمال الكامل مع الحالة والفئات.", group: "الأعمال", icon: FolderKanban },
  { to: "/admin/services", title: "الخدمات", description: "صفحات الخدمات: المزايا، الميزات، الأسعار.", group: "الأعمال", icon: Wrench },
  { to: "/admin/testimonials", title: "التوصيات", description: "شهادات العملاء والتقييمات.", group: "الأعمال", icon: MessagesSquare },
  { to: "/admin/blog", title: "المدونة", description: "المقالات، الفئات، الوسوم، الجدولة.", group: "الكتابة", icon: BookOpen },
  { to: "/admin/ideas", title: "الأفكار", description: "مسودات وأفكار قيد التطوير.", group: "الكتابة", icon: Lightbulb },
  { to: "/admin/products", title: "المنتجات", description: "منتجات رقمية للبيع أو العرض.", group: "الكتابة", icon: Package },
  { to: "/admin/experiences", title: "الخبرات", description: "المسيرة المهنية والمناصب.", group: "السيرة", icon: Briefcase },
  { to: "/admin/certificates", title: "الشهادات", description: "الشهادات المهنية والاعتمادات.", group: "السيرة", icon: Award },
  { to: "/admin/skills", title: "المهارات", description: "المهارات مع المستوى والفئات.", group: "السيرة", icon: GraduationCap },
  { to: "/admin/messages", title: "الرسائل الواردة", description: "رسائل من نموذج التواصل.", group: "التواصل", icon: Inbox },
  { to: "/admin/analytics", title: "قياس التحويل", description: "أحداث funnel من المشاهدات حتى إرسال التواصل.", group: "التواصل", icon: LineChart },
  { to: "/admin/media", title: "مكتبة الوسائط", description: "إدارة الملفات والصور المرفوعة.", group: "التواصل", icon: ImageIcon },
  { to: "/admin/audit", title: "سجل التدقيق", description: "سجل زمني لكل عملية إضافة أو تعديل أو حذف.", group: "المراقبة", icon: ScrollText },
];

function AdminHomePage() {
  const countFn = useServerFn(countNewMessages);
  const listProjectsFn = useServerFn(adminListProjects);
  const fetchSummaryFn = useServerFn(getFunnelSummary);

  const messages = useQuery({
    queryKey: ["admin", "messages", "new-count"],
    queryFn: () => countFn(),
    staleTime: 30_000,
  });

  const projects = useQuery({
    queryKey: ["admin", "projects", "count"],
    queryFn: async () => {
      const res = await listProjectsFn({ data: { limit: 1, offset: 0 } }) as { count?: number };
      return (res as { count?: number }).count ?? 0;
    },
    staleTime: 60_000,
  });

  const analytics = useQuery({
    queryKey: ["admin", "analytics", { days: 7 }],
    queryFn: () => fetchSummaryFn({ data: { days: 7 } }),
    staleTime: 60_000,
  });

  const groups = CARDS.reduce<Record<string, Card[]>>((acc, c) => {
    (acc[c.group] ??= []).push(c);
    return acc;
  }, {});

  const newCount = messages.data?.count ?? 0;
  const projectCount = projects.data ?? undefined;
  const contactSubmits = analytics.data?.uniqueSessions.contact_submit ?? undefined;

  return (
    <AdminShell
      title="لوحة الإدارة"
      description="مركز التحكم بمحتوى الموقع. استخدم ⌘K للتنقل السريع بين الأقسام."
    >
      <div className="flex flex-col gap-8">
        {/* Quick highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickTile
            to="/admin/messages"
            label="رسائل جديدة"
            value={newCount}
            hint={newCount > 0 ? "بانتظار الرد" : "لا يوجد جديد"}
            icon={Inbox}
            highlight={newCount > 0}
          />
          <QuickTile
            to="/admin/projects"
            label="المشاريع"
            value={projectCount}
            hint={projectCount !== undefined ? "إجمالي المشاريع" : "أضف أو حرر معرض الأعمال"}
            icon={FolderKanban}
          />
          <QuickTile
            to="/admin/analytics"
            label="تحويلات (7 أيام)"
            value={contactSubmits}
            hint={contactSubmits !== undefined ? "إرسال نموذج التواصل" : "تتبع تحويلات التواصل"}
            icon={LineChart}
          />
        </div>

        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{group}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.to}
                    to={c.to}
                    className="group flex flex-col gap-2 rounded-xl border border-border bg-white p-5 hover:border-neutral-400 hover:shadow-sm transition-all dark:border-border dark:bg-neutral-900 dark:hover:border-neutral-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-foreground dark:bg-neutral-800 dark:text-foreground">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                    <h4 className="font-semibold">{c.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

function QuickTile({
  to,
  label,
  value,
  hint,
  icon: Icon,
  highlight,
}: {
  to: string;
  label: string;
  value?: number;
  hint: string;
  icon: LucideIcon;
  highlight?: boolean;
}) {
  return (
    <Link
      to={to}
      className={
        "flex items-center justify-between gap-3 rounded-xl border p-4 transition-all hover:shadow-sm " +
        (highlight
          ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20"
          : "border-border bg-white dark:border-border dark:bg-neutral-900")
      }
    >
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-bold tabular-nums">
          {value !== undefined ? value : "—"}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 truncate">{hint}</div>
      </div>
      <div className={
        "inline-flex h-10 w-10 items-center justify-center rounded-lg " +
        (highlight
          ? "bg-red-500 text-white"
          : "bg-neutral-100 text-foreground dark:bg-neutral-800 dark:text-foreground")
      }>
        <Icon className="h-5 w-5" />
      </div>
    </Link>
  );
}
