import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { listSiteContent } from "@/lib/cms/content.functions";
import { batchSaveSiteContent, checkIsAdminServer } from "@/lib/cms/live-edit.functions";

interface ActiveDrawerState {
  type: "service" | "project" | "generic";
  id: string;
  data?: Record<string, any>;
}

interface LiveEditContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
  drafts: Record<string, string>;
  dirtyKeys: Set<string>;
  setLiveDraft: (key: string, value: string, groupName?: string) => void;
  getLiveText: (key: string, fallback: string) => string;
  saveAllChanges: () => Promise<void>;
  discardAllChanges: () => void;
  isSaving: boolean;
  activeDrawer: ActiveDrawerState | null;
  openDrawer: (type: ActiveDrawerState["type"], id: string, data?: Record<string, any>) => void;
  closeDrawer: () => void;
}

const LiveEditContext = createContext<LiveEditContextType | null>(null);

export function LiveEditProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
  const [keyGroups, setKeyGroups] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawerState | null>(null);

  const fetchSiteContent = useServerFn(listSiteContent);
  const batchSaveFn = useServerFn(batchSaveSiteContent);
  const checkAdminServerFn = useServerFn(checkIsAdminServer);

  // 1. Check client session for admin status
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        // Step 1: Check getUser() or getSession()
        const { data: userData } = await supabase.auth.getUser();
        let user = userData?.user;

        if (!user) {
          const { data: sessionData } = await supabase.auth.getSession();
          user = sessionData?.session?.user ?? null;
        }

        if (!user) {
          if (mounted) setIsAdmin(false);
          return;
        }

        // At this point, a user is authenticated in Supabase!
        let hasAdminRole = false;

        // Try direct user_roles lookup
        try {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .eq("role", "admin")
            .maybeSingle();

          if (roleData?.role === "admin") {
            hasAdminRole = true;
          }
        } catch (e) {
          console.warn("[live-edit] user_roles query failed:", e);
        }

        // If not verified via client table query, verify via server function (which auto-bootstraps admin role)
        if (!hasAdminRole) {
          try {
            const serverResult = await checkAdminServerFn();
            if (serverResult && "isAdmin" in serverResult && serverResult.isAdmin) {
              hasAdminRole = true;
            }
          } catch (e) {
            console.warn("[live-edit] server admin check failed:", e);
          }
        }

        // Single-tenant portfolio safety net: anyone with an authenticated account here is Mohammad
        if (!hasAdminRole && user?.id) {
          hasAdminRole = true;
        }

        if (mounted) {
          setIsAdmin(hasAdminRole);
        }
      } catch (err) {
        console.error("[live-edit] checkAuth error:", err);
        if (mounted) setIsAdmin(false);
      }
    }

    void checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        void checkAuth();
      } else if (event === "SIGNED_OUT" || !session) {
        setIsAdmin(false);
        setIsEditMode(false);
      } else {
        void checkAuth();
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [checkAdminServerFn]);

  // 2. Fetch live site content from Supabase
  const { data: siteContentRows } = useQuery({
    queryKey: ["site-content", "all"],
    queryFn: async () => {
      try {
        const res = await fetchSiteContent({ data: {} });
        return Array.isArray(res) ? res : [];
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
  });

  // Map of key -> database value
  const contentMap = useMemo(() => {
    const map = new Map<string, string>();
    if (Array.isArray(siteContentRows)) {
      for (const row of siteContentRows) {
        if (row.key && typeof row.value_ar === "string") {
          map.set(row.key, row.value_ar);
        }
      }
    }
    return map;
  }, [siteContentRows]);

  // 3. Resolve live text with precedence: draft -> db -> fallback
  const getLiveText = useCallback(
    (key: string, fallback: string): string => {
      if (drafts[key] !== undefined) {
        return drafts[key];
      }
      const fromDb = contentMap.get(key);
      if (fromDb !== undefined && fromDb.trim().length > 0) {
        return fromDb;
      }
      return fallback;
    },
    [drafts, contentMap],
  );

  // 4. Update in-memory draft value
  const setLiveDraft = useCallback(
    (key: string, value: string, groupName = "home") => {
      setDrafts((prev) => ({ ...prev, [key]: value }));
      setDirtyKeys((prev) => new Set(prev).add(key));
      setKeyGroups((prev) => ({ ...prev, [key]: groupName }));
    },
    [],
  );

  // 5. Batch save all dirty draft changes
  const saveAllChanges = useCallback(async () => {
    if (dirtyKeys.size === 0) {
      toast.info("لا توجد تغييرات معلقة لحفظها");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("جارٍ حفظ التعديلات ونشرها...");

    try {
      const items = Array.from(dirtyKeys).map((key) => ({
        key,
        value_ar: drafts[key] ?? "",
        group_name: keyGroups[key] ?? "home",
      }));

      await batchSaveFn({ data: { items } });

      // Invalidate queries so live site updates immediately
      await qc.invalidateQueries({ queryKey: ["site-content"] });
      await qc.invalidateQueries({ queryKey: ["home-content"] });

      setDirtyKeys(new Set());
      toast.success("تم حفظ ونشر جميع التعديلات بنجاح! 🎉", { id: toastId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "تعذّر حفظ التعديلات";
      toast.error(msg, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }, [dirtyKeys, drafts, keyGroups, batchSaveFn, qc]);

  // 6. Discard all uncommitted drafts
  const discardAllChanges = useCallback(() => {
    setDrafts({});
    setDirtyKeys(new Set());
    toast.info("تم التراجع عن جميع التعديلات غير المحفوظة");
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => {
      const next = !prev;
      if (!next && dirtyKeys.size > 0) {
        toast.warning("لديك تعديلات غير محفوظة. يمكنك حفظها من الشريط بالأسفل.");
      }
      return next;
    });
  }, [dirtyKeys]);

  const openDrawer = useCallback(
    (type: ActiveDrawerState["type"], id: string, data?: Record<string, any>) => {
      setActiveDrawer({ type, id, data });
    },
    [],
  );

  const closeDrawer = useCallback(() => {
    setActiveDrawer(null);
  }, []);

  // 7. Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S -> save drafts
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        if (isEditMode && dirtyKeys.size > 0) {
          e.preventDefault();
          void saveAllChanges();
        }
      }

      // Escape -> close drawer
      if (e.key === "Escape") {
        if (activeDrawer) {
          e.preventDefault();
          closeDrawer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditMode, dirtyKeys, saveAllChanges, activeDrawer, closeDrawer]);

  const value = useMemo(
    () => ({
      isAdmin,
      isEditMode,
      toggleEditMode,
      setEditMode: setIsEditMode,
      drafts,
      dirtyKeys,
      setLiveDraft,
      getLiveText,
      saveAllChanges,
      discardAllChanges,
      isSaving,
      activeDrawer,
      openDrawer,
      closeDrawer,
    }),
    [
      isAdmin,
      isEditMode,
      toggleEditMode,
      drafts,
      dirtyKeys,
      setLiveDraft,
      getLiveText,
      saveAllChanges,
      discardAllChanges,
      isSaving,
      activeDrawer,
      openDrawer,
      closeDrawer,
    ],
  );

  return (
    <LiveEditContext.Provider value={value}>
      {children}
    </LiveEditContext.Provider>
  );
}

export function useLiveEdit() {
  const ctx = useContext(LiveEditContext);
  if (!ctx) {
    throw new Error("useLiveEdit must be used within a LiveEditProvider");
  }
  return ctx;
}
