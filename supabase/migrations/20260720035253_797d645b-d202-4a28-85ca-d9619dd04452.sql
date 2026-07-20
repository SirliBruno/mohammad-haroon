
ALTER TABLE public.hero_projects
  ADD COLUMN IF NOT EXISTS cover_variants jsonb,
  ADD COLUMN IF NOT EXISTS mobile_variants jsonb;
