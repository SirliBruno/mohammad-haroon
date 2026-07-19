/**
 * Client-side auth state for the CMS.
 *
 * Subscribes to Supabase auth events once and exposes a small, ergonomic
 * hook. Business logic (role checks, admin gating) lives here so components
 * stay dumb: `const { user, isAdmin, signIn, signOut } = useAuth()`.
 */
import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
}

async function fetchIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) {
    console.warn("[auth] has_role check failed", error.message);
    return false;
  }
  return Boolean(data);
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    session: null,
    user: null,
    isAdmin: false,
  });

  useEffect(() => {
    let mounted = true;

    // 1) Register listener first — never miss a session event.
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
      const user = session?.user ?? null;
      const isAdmin = user ? await fetchIsAdmin(user.id) : false;
      setState({
        status: user ? "authenticated" : "unauthenticated",
        session,
        user,
        isAdmin,
      });
    });

    // 2) Then read the current session.
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const user = data.session?.user ?? null;
      const isAdmin = user ? await fetchIsAdmin(user.id) : false;
      setState({
        status: user ? "authenticated" : "unauthenticated",
        session: data.session,
        user,
        isAdmin,
      });
    })();

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { ...state, signIn, signUp, signOut };
}
