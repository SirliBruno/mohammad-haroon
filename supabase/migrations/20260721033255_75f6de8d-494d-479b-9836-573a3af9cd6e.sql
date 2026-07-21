GRANT SELECT ON public.hero_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_projects TO authenticated;
GRANT ALL ON public.hero_projects TO service_role;