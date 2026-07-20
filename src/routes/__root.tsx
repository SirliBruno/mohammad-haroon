import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { themeInitScript } from "@/features/theme/theme-script";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { buildMeta } from "@/features/seo/build-meta";
import { site } from "@/config/site";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { AuroraBackground } from "@/components/layout/aurora-background";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  sameAs: [] as string[],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  inLanguage: site.locale,
  potentialAction: {
    "@type": "SearchAction",
    target: `${site.url}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
          خطأ 404
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          الصفحة غير موجودة
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          الصفحة التي تبحث عنها غير متاحة، أو نُقلت إلى مكان آخر، أو لا تزال قيد الإعداد. اختر إحدى الوجهات أدناه للمتابعة.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            العودة إلى الرئيسيّة
          </Link>
          <Link
            to="/work"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            استعرض المشاريع
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            تواصل
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          حدث خطأ غير متوقّع
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          يُرجى المحاولة مرّة أخرى، أو العودة إلى الصفحة الرئيسيّة.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            إعادة المحاولة
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            العودة إلى الرئيسيّة
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: buildMeta({
      title: undefined,
      description: site.description,
    }),
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      { children: themeInitScript },
      { type: "application/ld+json", children: JSON.stringify(organizationJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(websiteJsonLd) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang={site.locale} dir={site.direction}>
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:text-background"
        >
          الانتقال إلى المحتوى
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <div className="relative flex min-h-dvh flex-col">
          <AuroraBackground />
          <AnalyticsTracker />
          <ScrollProgress />
          <Nav />
          <main id="main" className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
