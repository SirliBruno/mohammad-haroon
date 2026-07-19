import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { trackEvent, type FunnelEvent } from "@/lib/analytics";

const PATH_EVENT: Array<{ match: RegExp; event: FunnelEvent }> = [
  { match: /^\/$/, event: "home_view" },
  { match: /^\/work\/[^/]+/, event: "project_view" },
  { match: /^\/work\/?$/, event: "work_view" },
  { match: /^\/services\/[^/]+/, event: "service_view" },
  { match: /^\/services\/?$/, event: "services_view" },
  { match: /^\/contact\/?$/, event: "contact_view" },
];

/**
 * Fires a page_view on every route change, plus a dedicated funnel event
 * for key pages so conversion analysis is one query away.
 */
export function AnalyticsTracker() {
  const router = useRouter();

  useEffect(() => {
    let lastPath = "";
    const fire = () => {
      const path = window.location.pathname;
      if (path === lastPath) return;
      lastPath = path;
      trackEvent("page_view", { path });
      for (const rule of PATH_EVENT) {
        if (rule.match.test(path)) {
          trackEvent(rule.event, { path });
          break;
        }
      }
    };
    fire();
    const unsub = router.subscribe("onResolved", fire);
    return () => unsub();
  }, [router]);

  return null;
}
