import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Public site URL for auth redirects (email confirmation, magic links).
 * Set `VITE_APP_URL` in production (e.g. `https://your-app.vercel.app`) so confirmation
 * links match your deployed domain. If unset, uses `window.location.origin` at signup time.
 */
export function getAuthSiteUrl(): string {
  const explicit = import.meta.env.VITE_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function isSupabaseConfigured(): boolean {
  return !!(
    import.meta.env.VITE_SUPABASE_URL?.length &&
    import.meta.env.VITE_SUPABASE_ANON_KEY?.length
  );
}

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to your .env file.",
    );
  }
  client = createClient(url, anonKey, {
    auth: {
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
  return client;
}
