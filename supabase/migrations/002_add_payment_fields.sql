-- Add payment tracking columns to the reports table
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT FALSE;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free';

-- Index for looking up reports by Stripe session
CREATE INDEX IF NOT EXISTS reports_stripe_session_id_idx
  ON public.reports (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;
