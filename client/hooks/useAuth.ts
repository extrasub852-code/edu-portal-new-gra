import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import type { AuthMeResponse } from "@shared/api";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const AUTH_SESSION_KEY = ["auth", "session"] as const;

function sessionToResponse(session: Session | null): AuthMeResponse {
  if (!session?.user) {
    return { loggedIn: false, user: null, userInfo: null };
  }
  const u = session.user;
  return {
    loggedIn: true,
    user: u.email ?? u.id,
    userInfo: {
      id: u.id,
      email: u.email,
      ...u.user_metadata,
    },
  };
}

async function fetchSession() {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: session, isLoading } = useQuery({
    queryKey: AUTH_SESSION_KEY,
    queryFn: fetchSession,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: AUTH_SESSION_KEY });
    });
    return () => subscription.unsubscribe();
  }, [queryClient]);

  const data = sessionToResponse(session ?? null);

  const login = (returnTo?: string) => {
    const from = returnTo && returnTo !== "/login" ? returnTo : "/";
    navigate("/login", { state: { from } });
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await getSupabase().auth.signOut();
    }
    queryClient.setQueryData(AUTH_SESSION_KEY, null);
    await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_KEY });
  };

  return {
    user: data.user,
    loggedIn: data.loggedIn,
    userInfo: data.userInfo,
    isLoading,
    refetch: () => queryClient.invalidateQueries({ queryKey: AUTH_SESSION_KEY }),
    login,
    logout,
  };
}
