import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase browser client — used in client components for auth & reads.
 * Uses the anon key (respects RLS policies).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
