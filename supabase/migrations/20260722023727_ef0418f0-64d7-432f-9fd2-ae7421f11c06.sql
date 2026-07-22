-- 1) Add tools column
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS tools text[] NOT NULL DEFAULT '{}';

-- 2) Backfill metrics from results where metrics is empty
UPDATE public.projects
SET metrics = results
WHERE (metrics IS NULL OR jsonb_array_length(COALESCE(metrics, '[]'::jsonb)) = 0)
  AND results IS NOT NULL
  AND jsonb_array_length(results) > 0;

-- 3) Drop the redundant results column
ALTER TABLE public.projects
  DROP COLUMN IF EXISTS results;
