
-- Fix overly permissive INSERT policy on jobs table
DROP POLICY "Anyone authenticated can insert jobs" ON public.jobs;
CREATE POLICY "Authenticated users can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
