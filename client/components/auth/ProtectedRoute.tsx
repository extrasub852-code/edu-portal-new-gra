import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Requires login. Used for Use Case Finder / AI flows; rest of the site stays public.
 */
export function ProtectedRoute() {
  const { loggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-[#B3A369] border-t-transparent"
          aria-hidden
        />
        <p className="text-sm font-medium text-[#003057]/70">Checking your session…</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}
