-- Hero showcase projects table (images shown in homepage mockups)
CREATE TABLE public.hero_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  host text,
  category text,
  year integer,
  status text NOT NULL DEFAULT 'مباشر',
  accent text NOT NULL DEFAULT 'emerald',
  cover_url text,
  mobile_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hero_projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hero_projects TO authenticated;
GRANT ALL ON public.hero_projects TO service_role;

ALTER TABLE public.hero_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_projects public read active"
  ON public.hero_projects FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "hero_projects admin insert"
  ON public.hero_projects FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "hero_projects admin update"
  ON public.hero_projects FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "hero_projects admin delete"
  ON public.hero_projects FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER hero_projects_set_updated_at
  BEFORE UPDATE ON public.hero_projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-grant admin role to first user (bootstrap)
CREATE OR REPLACE FUNCTION public.tg_bootstrap_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bootstrap_first_admin ON auth.users;
CREATE TRIGGER bootstrap_first_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.tg_bootstrap_first_admin();

-- Storage policies for `media` bucket: admins upload/manage, public read
CREATE POLICY "media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "media admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "media admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "media admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));