// Supabase client — the single connection point to the backend.
//
// The anon key is designed to be public (it ships in the JS bundle by
// design); the database's Row-Level Security policies are the real security
// boundary. See supabase/migrations/0001_case_studies.sql.
//
// Real secrets (service-role key etc.) must NEVER appear here or in any
// VITE_* variable — they belong server-side only.

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** False when env vars are missing — the store degrades gracefully. */
export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. " +
      "Case studies will not load and the Content Studio cannot save. " +
      "Copy .env.example to .env and fill in your Supabase project values."
  );
}

// With missing config we still create a client (never used — every store
// function checks isSupabaseConfigured first) so imports stay simple.
export const supabase = createClient(
  url ?? "http://localhost:54321",
  anonKey ?? "public-anon-key-not-configured"
);
