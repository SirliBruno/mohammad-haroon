/**
 * Lightweight client-side funnel event tracking.
 * Fire-and-forget via sendBeacon with a fetch fallback.
 */

const SESSION_KEY = "lv_sid";
const ENDPOINT = "/api/public/track";

export type FunnelEvent =
  | "page_view"
  | "home_view"
  | "work_view"
  | "project_view"
  | "services_view"
  | "service_view"
  | "contact_view"
  | "contact_start"
  | "contact_submit"
  | "cta_click";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid =
        (crypto?.randomUUID?.() ??
          Math.random().toString(36).slice(2) + Date.now().toString(36));
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export function trackEvent(
  event: FunnelEvent,
  metadata: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    event,
    path: window.location.pathname + window.location.search,
    sessionId: getSessionId(),
    referrer: document.referrer || null,
    metadata,
  });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      const ok = navigator.sendBeacon(ENDPOINT, blob);
      if (ok) return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}
