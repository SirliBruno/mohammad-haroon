import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { countNewMessages } from "@/lib/cms/messages.functions";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Home,
  FileText,
  LayoutDashboard,
  Sparkles,
  FileStack,
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
  ScrollText,
  Menu,
  Search,
  LogOut,
  ArrowRight,
  Upload,
  FolderTree,
  type LucideIcon,
} from "lucide-react";

type NavItem = { to: string; label: string; group: string; icon: LucideIcon };

const NAV: NavItem[] = [
  { to: "/admin", label: "الرئيسية", group: "عام", icon: Home },
  { to: "/admin/content", label: "نصوص وصور الموقع", group: "المحتوى العام", icon: FileText },
  { to: "/admin/pages", label: "محتوى الصفحات", group: "المحتوى العام", icon: FileStack },
  { to: "/admin/home", label: "الصفحة الرئيسية", group: "الصفحة الرئيسية", icon: LayoutDashboard },
  { to: "/admin/hero", label: "قسم الهيرو", group: "الصفحة الرئيسية", icon: Sparkles },
  { to: "/admin/projects", label: "المشاريع", group: "الأعمال", icon: FolderKanban },
  { to: "/admin/client-works", label: "مجلدات وملفات الأعمال", group: "الأعمال", icon: FolderTree },
  { to: "/admin/my-projects", label: "استيراد أعمالي", group: "الأعمال", icon: Upload },
  { to: "/admin/services", label: "الخدمات", group: "الأعمال", icon: Wrench },
  { to: "/admin/testimonials", label: "التوصيات", group: "الأعمال", icon: MessagesSquare },
  { to: "/admin/blog", label: "المدونة", group: "الكتابة", icon: BookOpen },
  { to: "/admin/ideas", label: "الأفكار", group: "الكتابة", icon: Lightbulb },
  { to: "/admin/products", label: "المنتجات", group: "الكتابة", icon: Package },
  { to: "/admin/experiences", label: "الخبرات", group: "السيرة", icon: Briefcase },
  { to: "/admin/certificates", label: "الشهادات", group: "السيرة", icon: Award },
  { to: "/admin/skills", label: "المهارات", group: "السيرة", icon: GraduationCap },
  { to: "/admin/messages", label: "الرسائل الواردة", group: "التواصل", icon: Inbox },
  { to: "/admin/media", label: "مكتبة الوسائط", group: "التواصل", icon: ImageIcon },
  { to: "/admin/analytics", label: "التحليلات", group: "المراقبة", icon: LineChart },
  { to: "/admin/audit", label: "سجل التدقيق", group: "المراقبة", icon: ScrollText },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const countFn = useServerFn(countNewMessages);
  const newMessages = useQuery({
    queryKey: ["admin", "messages", "new-count"],
    queryFn: () => countFn(),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
  const newCount = newMessages.data?.count ?? 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const groups = NAV.reduce<Record<string, NavItem[]>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  const activeItem = NAV.find((n) => location.pathname === n.to);
  const crumbGroup = activeItem?.group;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-4 text-sm">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="flex flex-col gap-1">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-2">{group}</div>
          {items.map((item) => {
            const active = location.pathname === item.to;
            const badge = item.to === "/admin/messages" && newCount > 0 ? newCount : null;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg px-3 py-2 transition-colors",
                  active
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium"
                    : "text-foreground hover:bg-neutral-100 dark:text-muted-foreground dark:hover:bg-muted",
                )}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon className="h-4 w-4 shrink-0 opacity-80" />
                  <span className="truncate">{item.label}</span>
                </span>
                {badge != null && (
                  <span
                    className={cn(
                      "inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      active ? "bg-white/20 text-current" : "bg-red-500 text-white",
                    )}
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 md:px-8 md:py-10 lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:flex flex-col gap-6 sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-border bg-white p-5 shadow-sm dark:border-border dark:bg-neutral-900">
          <div>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground dark:hover:text-neutral-100 inline-flex items-center gap-1">
              <ArrowRight className="h-3.5 w-3.5" /> العودة للموقع
            </Link>
            <h2 className="mt-3 text-lg font-semibold">لوحة الإدارة</h2>
            <p className="text-xs text-muted-foreground mt-1">نظام إدارة المحتوى</p>
          </div>
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center justify-between gap-2 rounded-lg border border-border bg-neutral-50 px-3 py-2 text-xs text-muted-foreground hover:bg-neutral-100 dark:border-border dark:bg-neutral-950 dark:hover:bg-muted"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5" /> بحث سريع
            </span>
            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] border border-border dark:bg-neutral-900 dark:border-border">⌘K</kbd>
          </button>
          <NavList />
          <button
            onClick={handleSignOut}
            className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-neutral-100 dark:border-border dark:text-muted-foreground dark:hover:bg-muted"
          >
            <LogOut className="h-3.5 w-3.5" /> تسجيل الخروج
          </button>
        </aside>

        <main className="flex flex-col gap-6 min-w-0">
          {/* Mobile top bar */}
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="القائمة"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm dark:border-border dark:bg-neutral-900"
                >
                  <Menu className="h-4 w-4" /> القائمة
                  {newCount > 0 && (
                    <span className="inline-flex min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 py-0.5 text-[9px] font-semibold text-white">
                      {newCount > 99 ? "99+" : newCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>لوحة الإدارة</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <NavList onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex-1 inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs text-muted-foreground dark:border-border dark:bg-neutral-900"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" /> بحث سريع
              </span>
              <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] dark:bg-neutral-800">⌘K</kbd>
            </button>
          </div>

          {/* Breadcrumb */}
          {activeItem && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/admin" className="hover:text-foreground dark:hover:text-neutral-100">لوحة الإدارة</Link>
              {crumbGroup && <><span>/</span><span>{crumbGroup}</span></>}
              <span>/</span>
              <span className="text-foreground dark:text-foreground">{activeItem.label}</span>
            </div>
          )}

          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{description}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </header>

          <div>{children}</div>
        </main>
      </div>

      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput placeholder="ابحث في أقسام لوحة الإدارة..." />
        <CommandList>
          <CommandEmpty>لا توجد نتائج.</CommandEmpty>
          {Object.entries(groups).map(([group, items]) => (
            <CommandGroup key={group} heading={group}>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.to}
                    value={`${group} ${item.label}`}
                    onSelect={() => {
                      setPaletteOpen(false);
                      navigate({ to: item.to });
                    }}
                  >
                    <Icon className="h-4 w-4 opacity-70" />
                    <span>{item.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
