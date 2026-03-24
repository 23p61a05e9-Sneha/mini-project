
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  preferred_roles TEXT[] DEFAULT '{}',
  preferred_locations TEXT[] DEFAULT '{}',
  preferred_job_types TEXT[] DEFAULT '{}',
  min_salary TEXT DEFAULT '',
  experience TEXT DEFAULT '',
  smtp_host TEXT DEFAULT 'smtp.gmail.com',
  smtp_port TEXT DEFAULT '587',
  smtp_email TEXT DEFAULT '',
  smtp_password TEXT DEFAULT '',
  gemini_key TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Full-time',
  salary TEXT DEFAULT '',
  description TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  match_score INTEGER DEFAULT 0,
  recruiter_name TEXT DEFAULT '',
  recruiter_email TEXT DEFAULT '',
  posted_date TEXT DEFAULT '',
  source TEXT DEFAULT 'Mock API',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view jobs" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone authenticated can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (true);

-- Applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'emailed', 'interview', 'rejected', 'accepted')),
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_body TEXT DEFAULT '',
  email_subject TEXT DEFAULT '',
  applied_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON public.applications FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
