
-- Attach updated_at trigger to all CMS tables
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['blog_posts','certificates','experiences','hero_projects','ideas','media','messages','products','projects','services','site_content','skills','testimonials']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I;', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();', t);
  END LOOP;
END $$;

-- Analytics performance index
CREATE INDEX IF NOT EXISTS analytics_events_event_created_at_idx
  ON public.analytics_events (event, created_at DESC);
