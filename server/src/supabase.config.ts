/**
 * This file contains the configuration for Supabase, including the Supabase URL and API key.
 * It exports a Supabase client instance that can be used throughout the application to interact with Supabase services.
 * Make sure to replace the placeholders with your actual Supabase project URL and API key.
 */

import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase project URL and API key
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://your-supabase-url.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export { supabase };
