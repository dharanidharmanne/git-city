import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

// 🧩 Read env vars (these are string | undefined by default)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 🧠 Runtime validation (ensures they exist before use)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables."
  );
}

/** Client-side Supabase client (anon key, respects RLS) — singleton for 'use client' */
export function createBrowserSupabase() {
  if (browserClient) return browserClient;

  // ✅ TypeScript now knows these are strings because of the above check
  browserClient = createBrowserClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);
  return browserClient;
}

/** Server-side Supabase client (service role, bypasses RLS) */
export function getSupabaseAdmin(): SupabaseClient {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️ Missing SUPABASE_SERVICE_ROLE_KEY; admin client may not function properly.");
  }

  return createClient(
    SUPABASE_URL as string,
    (SUPABASE_SERVICE_ROLE_KEY ?? "") as string,
    { auth: { persistSession: false } }
  );
}