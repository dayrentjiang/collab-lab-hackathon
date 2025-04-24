import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for the browser
const supabaseUrl = "https://phrvseijpfnsrpjhzupl.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseAnonKey) {
  console.error(
    "Missing Supabase key. Make sure SUPABASE_KEY is set in your environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
