DROP POLICY IF EXISTS "hero_projects public read active" ON public.hero_projects;
DROP POLICY IF EXISTS "hero_projects anon read active" ON public.hero_projects;
DROP POLICY IF EXISTS "hero_projects authenticated read active or admin" ON public.hero_projects;

CREATE POLICY "hero_projects anon read active"
ON public.hero_projects
FOR SELECT
TO anon
USING (is_active = true);

CREATE POLICY "hero_projects authenticated read active or admin"
ON public.hero_projects
FOR SELECT
TO authenticated
USING (
  is_active = true
  OR public.has_role(auth.uid(), 'admin')
);