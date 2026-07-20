-- Drop legacy duplicate policies (two migration runs created near-identical sets).
DROP POLICY IF EXISTS "media: public read" ON public.media;
DROP POLICY IF EXISTS "media: auth read" ON public.media;
DROP POLICY IF EXISTS "media: admin insert" ON public.media;
DROP POLICY IF EXISTS "media: admin update" ON public.media;
DROP POLICY IF EXISTS "media: admin delete" ON public.media;
DROP POLICY IF EXISTS "media_admin_insert" ON public.media;
DROP POLICY IF EXISTS "media_admin_update" ON public.media;
DROP POLICY IF EXISTS "media_admin_delete" ON public.media;
DROP POLICY IF EXISTS "media public read" ON public.media;
DROP POLICY IF EXISTS "media admin insert" ON public.media;
DROP POLICY IF EXISTS "media admin update" ON public.media;
DROP POLICY IF EXISTS "media admin delete" ON public.media;

-- Revoke the anon SELECT grant — the media table is now an admin-only asset library.
REVOKE SELECT ON public.media FROM anon;

-- Canonical policies: admin-only read/write. Public site rendering uses
-- signed URLs stored on referencing rows (projects.cover_url, hero_projects.cover_url, …).
CREATE POLICY "media_admin_select"
  ON public.media FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "media_admin_insert"
  ON public.media FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "media_admin_update"
  ON public.media FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "media_admin_delete"
  ON public.media FOR DELETE
  TO authenticated
  USING (public.is_admin());
