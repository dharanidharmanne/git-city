import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const PLACEHOLDER_URL = "https://your-project.supabase.co";
const PLACEHOLDER_KEY = "your-anon-key";

function validateSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isServer = typeof window === "undefined";

  if (!url || url === PLACEHOLDER_URL) {
    const message =
      'NEXT_PUBLIC_SUPABASE_URL is not configured. Replace the placeholder "https://your-project.supabase.co" with your real Supabase project URL in your environment variables (Vercel dashboard → Settings → Environment Variables).';
    if (isServer) {
      throw new Error(message);
    } else {
      console.error(message);
    }
  }

  if (!key || key === PLACEHOLDER_KEY) {
    const message =
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured. Replace the placeholder "your-anon-key" with your real Supabase anonymous key in your environment variables (Vercel dashboard → Settings → Environment Variables).';
    if (isServer) {
      throw new Error(message);
    } else {
      console.error(message);
    }
  }
}

validateSupabaseEnv();

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/** Client-side Supabase client (anon key, respects RLS) — singleton for "use client" */
export function createBrowserSupabase() {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return browserClient;
}

/** Server-side Supabase client (service role, bypasses RLS) */
export function getSupabaseAdmin(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
