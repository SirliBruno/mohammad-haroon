import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { countNewMessages } from "@/lib/cms/messages.functions";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; group?: string };

const NAV: NavItem[] = [
  { to: "/admin", label: "الرئيسية", group: "عام" },
  { to: "/admin/content", label: "نصوص وصور الموقع", group: "المحتوى العام" },
  { to: "/admin/hero", label: "قسم الهيرو", group: "الصفحة الرئيسية" },
  { to: "/admin/projects", label: "المشاريع", group: "الأعمال" },
  { to: "/admin/services", label: "الخدمات", group: "الأعمال" },
  { to: "/admin/testimonials", label: "التوصيات", group: "الأعمال" },
  { to: "/admin/blog", label: "المدونة", group: "الكتابة" },
  { to: "/admin/ideas", label: "الأفكار", group: "الكتابة" },
  { to: "/admin/products", label: "المنتجات", group: "الكتابة" },
  { to: "/admin/experiences", label: "الخبرات", group: "السيرة" },
  { to: "/admin/certificates", label: "الشهادات", group: "السيرة" },
  { to: "/admin/skills", label: "المهارات", group: "السيرة" },
  { to: "/admin/messages", label: "الرسائل الواردة", group: "التواصل" },
  { to: "/admin/media", label: "مكتبة الوسائط", group: "التواصل" },
  { to: "/admin/analytics", label: "التحليلات", group: "المراقبة" },
  { to: "/admin/audit", label: "سجل التدقيق", group: "المراقبة" },
];

export function AdminShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const groups = NAV.reduce<Record<string, NavItem[]>>((acc, item) => {
    const g = item.group ?? "عام";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 md:px-8 md:py-10 lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:flex flex-col gap-6 sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
              ← العودة للموقع
            </Link>
            <h2 className="mt-3 text-lg font-semibold">لوحة الإدارة</h2>
            <p className="text-xs text-neutral-500 mt-1">نظام إدارة المحتوى</p>
          </div>
          <nav className="flex flex-col gap-4 text-sm">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} className="flex flex-col gap-1">
                <div className="text-[11px] uppercase tracking-wider text-neutral-400 px-2">
                  {group}
                </div>
                {items.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "rounded-lg px-3 py-2 transition-colors",
                        active
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                          : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <button
            onClick={handleSignOut}
            className="mt-auto rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            تسجيل الخروج
          </button>
        </aside>

        <main className="flex flex-col gap-6 min-w-0">
          {/* Mobile nav */}
          <details className="lg:hidden rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <summary className="cursor-pointer text-sm font-medium">القائمة</summary>
            <div className="mt-3 grid grid-cols-2 gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-2 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>

          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-neutral-500 max-w-2xl">{description}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </header>

          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
