import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AUTH_SESSION_KEY, useAuth } from "@/hooks/useAuth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const queryClient = useQueryClient();
  const { loggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from =
    (location.state as { from?: string })?.from ??
    new URLSearchParams(location.search).get("returnTo") ??
    "/";

  useEffect(() => {
    if (!isLoading && loggedIn) {
      navigate(from, { replace: true });
    }
  }, [loggedIn, isLoading, navigate, from]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_KEY });
      toast.success("Signed in");
      navigate(from, { replace: true });
    } finally {
      setSubmitting(false);
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#003057]">Log in</h1>
        <p className="mt-4 text-[#003057]/80">
          Add <code className="rounded bg-[#003057]/10 px-1">VITE_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-[#003057]/10 px-1">VITE_SUPABASE_ANON_KEY</code> to your{" "}
          <code className="rounded bg-[#003057]/10 px-1">.env</code> file (see <code className="rounded bg-[#003057]/10 px-1">.env.example</code>).
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-[#003057]">Log in</h1>
      <p className="mt-2 text-[#003057]/80">Use your EduPortal account (Supabase Auth).</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          disabled={submitting || isLoading}
          className="w-full bg-[#003057] text-[#B3A369] hover:bg-[#003057]/90"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#003057]/80">
        No account?{" "}
        <Link to="/signup" className="font-semibold text-[#003057] underline underline-offset-2">
          Create one
        </Link>
      </p>
    </div>
  );
}
