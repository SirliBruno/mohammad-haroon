-- Drop the auto-admin bootstrap trigger to prevent privilege escalation
DROP TRIGGER IF EXISTS bootstrap_first_admin ON auth.users;
DROP FUNCTION IF EXISTS public.tg_bootstrap_first_admin();