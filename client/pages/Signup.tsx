import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_SESSION_KEY } from "@/hooks/useAuth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Signup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await getSupabase().auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
        return;
      }
      if (data.session) {
        await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_KEY });
        toast.success("Account created. You are signed in.");
        navigate("/", { replace: true });
      } else {
        toast.success("Check your email to confirm your account, then sign in.");
        navigate("/login", { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#003057]">Sign up</h1>
        <p className="mt-4 text-[#003057]/80">
          Add Supabase environment variables to your <code className="rounded bg-[#003057]/10 px-1">.env</code> file
          (see <code className="rounded bg-[#003057]/10 px-1">.env.example</code>).
        </p>
        <p className="mt-4">
          <Link to="/login" className="font-semibold text-[#003057] underline">
            Back to log in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-[#003057]">Create an account</h1>
      <p className="mt-2 text-[#003057]/80">Sign up with email and password (Supabase Auth).</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="signup-confirm">Confirm password</Label>
          <Input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#003057] text-[#B3A369] hover:bg-[#003057]/90"
        >
          {submitting ? "Creating account…" : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#003057]/80">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#003057] underline underline-offset-2">
          Log in
        </Link>
      </p>
    </div>
  );
}
