-- Create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  city text NOT NULL,
  investment_budget text,
  message text,
  form_type text NOT NULL,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Note: We do NOT create any policies that allow operations for `anon` or `authenticated` roles
-- because insertions will ONLY be handled by the server-side Next.js API using the `service_role` key.
-- The `service_role` key automatically bypasses RLS, so it can insert records regardless of policies.
