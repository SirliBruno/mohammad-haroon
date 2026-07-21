-- Tighten SECURITY DEFINER function ACLs.
-- has_role is only used inside RLS policies and by authenticated app code;
-- there is no reason for anon to execute it directly.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- is_admin() is a convenience wrapper over has_role for authenticated users only.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- tg_audit_row is a trigger function; nobody should call it directly.
REVOKE EXECUTE ON FUNCTION public.tg_audit_row() FROM PUBLIC, anon, authenticated;