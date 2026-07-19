
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  path text,
  session_id text,
  referrer text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX analytics_events_event_idx ON public.analytics_events(event);
CREATE INDEX analytics_events_created_at_idx ON public.analytics_events(created_at DESC);
CREATE INDEX analytics_events_session_idx ON public.analytics_events(session_id);

GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read analytics" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.is_admin());
