GRANT SELECT ON public.hero_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_projects TO authenticated;
GRANT ALL ON public.hero_projects TO service_role;

DROP POLICY IF EXISTS "hero_projects public read active" ON public.hero_projects;
CREATE POLICY "hero_projects public read active"
ON public.hero_projects
FOR SELECT
TO anon, authenticated
USING (
  is_active = true
  OR public.has_role(auth.uid(), 'admin')
);