
-- Audit log for admin CMS changes
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  row_id uuid,
  action text NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  actor_id uuid,
  diff jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_log_created_at_idx ON public.audit_log (created_at DESC);
CREATE INDEX audit_log_table_idx ON public.audit_log (table_name, created_at DESC);

GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
ON public.audit_log FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Generic audit trigger
CREATE OR REPLACE FUNCTION public.tg_audit_row()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_row_id uuid;
  v_diff jsonb;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_row_id := (to_jsonb(OLD) ->> 'id')::uuid;
    v_diff := jsonb_build_object('old', to_jsonb(OLD));
  ELSIF (TG_OP = 'INSERT') THEN
    v_row_id := (to_jsonb(NEW) ->> 'id')::uuid;
    v_diff := jsonb_build_object('new', to_jsonb(NEW));
  ELSE
    v_row_id := (to_jsonb(NEW) ->> 'id')::uuid;
    v_diff := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
  END IF;

  INSERT INTO public.audit_log (table_name, row_id, action, actor_id, diff)
  VALUES (TG_TABLE_NAME, v_row_id, TG_OP, v_actor, v_diff);

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Attach to admin-managed content tables
CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_services AFTER INSERT OR UPDATE OR DELETE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_hero_projects AFTER INSERT OR UPDATE OR DELETE ON public.hero_projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_testimonials AFTER INSERT OR UPDATE OR DELETE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_certificates AFTER INSERT OR UPDATE OR DELETE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_experiences AFTER INSERT OR UPDATE OR DELETE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_skills AFTER INSERT OR UPDATE OR DELETE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_blog_posts AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_products AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_ideas AFTER INSERT OR UPDATE OR DELETE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
CREATE TRIGGER audit_site_content AFTER INSERT OR UPDATE OR DELETE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();
