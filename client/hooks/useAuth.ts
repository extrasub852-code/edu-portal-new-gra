import { useQuery } from "@tanstack/react-query";
import type { AuthMeResponse } from "@shared/api";

const AUTH_ME_KEY = ["auth", "me"] as const;

export function useAuth() {
  const { data, isLoading, refetch } = useQuery<AuthMeResponse>({
    queryKey: AUTH_ME_KEY,
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const login = (returnTo?: string) => {
    const params = new URLSearchParams();
    if (returnTo) params.set("returnTo", returnTo);
    const qs = params.toString();
    window.location.href = `/api/auth/login${qs ? `?${qs}` : ""}`;
  };

  const logout = () => {
    window.location.href = "/api/auth/logout";
  };

  return {
    user: data?.user ?? null,
    loggedIn: !!data?.loggedIn,
    userInfo: data?.userInfo ?? null,
    isLoading,
    refetch,
    login,
    logout,
  };
}
