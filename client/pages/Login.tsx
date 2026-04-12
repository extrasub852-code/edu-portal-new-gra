import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { loggedIn, isLoading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/", { replace: true });
      return;
    }
    if (!isLoading) {
      const from = (location.state as { from?: string })?.from ?? location.pathname;
      const returnTo = from && from !== "/login" ? from : "/";
      login(returnTo);
    }
  }, [loggedIn, isLoading, login, location, navigate]);

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-[#003057]">Login with Georgia Tech</h1>
      <p className="mt-4 text-[#003057]/80">
        Redirecting you to the official Georgia Tech SSO (Duo MFA) login...
      </p>
      <div className="mt-6 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B3A369] border-t-transparent" />
      </div>
    </div>
  );
}
