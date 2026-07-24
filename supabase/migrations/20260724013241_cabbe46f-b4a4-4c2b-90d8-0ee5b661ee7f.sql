
-- Restrict public read on the media bucket to known public asset folders only.
-- Files outside these prefixes are no longer readable by anon/authenticated
-- via storage; admins still have full CRUD via their existing policies.
DROP POLICY IF EXISTS "media public read" ON storage.objects;
DROP POLICY IF EXISTS "media: public read" ON storage.objects;

CREATE POLICY "media: public read scoped"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'media'
    AND (
      (storage.foldername(name))[1] IN (
        'projects','services','products','blog','certificates',
        'experiences','testimonials','content','hero','library','gallery'
      )
    )
  );
