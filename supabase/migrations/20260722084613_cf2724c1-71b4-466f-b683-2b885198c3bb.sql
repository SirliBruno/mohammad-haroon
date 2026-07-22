ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS showcase_phone_image text,
  ADD COLUMN IF NOT EXISTS showcase_logo_image text,
  ADD COLUMN IF NOT EXISTS showcase_logo_label text,
  ADD COLUMN IF NOT EXISTS featured_project_slugs text[] NOT NULL DEFAULT '{}'::text[];