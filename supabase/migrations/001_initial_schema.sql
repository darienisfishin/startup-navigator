-- =============================================================
-- LaunchWise Database Schema
-- =============================================================

-- ---------------------------------------------------------------
-- users table (extends auth.users with profile data)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: select own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users: insert own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users: update own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------
-- reports table
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  form_data    JSONB       NOT NULL,  -- serialised IntakeFormData (no File objects)
  report_data  JSONB       NOT NULL,  -- full StartupReport object
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_public    BOOLEAN     DEFAULT FALSE NOT NULL,
  share_token  TEXT        UNIQUE       -- set when is_public = true
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Owners can do everything
CREATE POLICY "reports: select own" ON public.reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "reports: insert own" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reports: update own" ON public.reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reports: delete own" ON public.reports
  FOR DELETE USING (auth.uid() = user_id);

-- Anyone can read a report that has been made public (share-link flow)
CREATE POLICY "reports: select public" ON public.reports
  FOR SELECT USING (is_public = TRUE AND share_token IS NOT NULL);

-- Auto-update updated_at on every row modification
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- Indexes for common query patterns
-- ---------------------------------------------------------------
CREATE INDEX IF NOT EXISTS reports_user_id_idx       ON public.reports (user_id);
CREATE INDEX IF NOT EXISTS reports_share_token_idx   ON public.reports (share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS reports_created_at_idx    ON public.reports (created_at DESC);
