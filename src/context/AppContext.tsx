import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { Tables } from "@/integrations/supabase/types";

export type JobRow = Tables<"jobs">;
export type ApplicationRow = Tables<"applications">;
export type ProfileRow = Tables<"profiles">;

export interface Preferences {
  roles: string[];
  skills: string[];
  locations: string[];
  jobTypes: string[];
  minSalary: string;
  experience: string;
}

interface AppContextType {
  session: Session | null;
  user: SupabaseUser | null;
  profile: ProfileRow | null;
  setProfile: (p: ProfileRow | null) => void;
  jobs: JobRow[];
  setJobs: (j: JobRow[]) => void;
  applications: (ApplicationRow & { job?: JobRow })[];
  setApplications: (a: (ApplicationRow & { job?: JobRow })[]) => void;
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
  isSearching: boolean;
  setIsSearching: (b: boolean) => void;
  loading: boolean;
  signOut: () => Promise<void>;
}

const defaultPreferences: Preferences = {
  roles: [],
  skills: [],
  locations: [],
  jobTypes: [],
  minSalary: "",
  experience: "",
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [applications, setApplications] = useState<(ApplicationRow & { job?: JobRow })[]>([]);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setProfile(null);
        setApplications([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch profile when session changes
  useEffect(() => {
    if (!session?.user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      if (data) {
        setProfile(data);
        setPreferences({
          roles: data.preferred_roles || [],
          skills: data.skills || [],
          locations: data.preferred_locations || [],
          jobTypes: data.preferred_job_types || [],
          minSalary: data.min_salary || "",
          experience: data.experience || "",
        });
      }
    };
    fetchProfile();
  }, [session?.user?.id]);

  // Fetch applications when session changes
  useEffect(() => {
    if (!session?.user) return;
    const fetchApps = async () => {
      const { data } = await supabase
        .from("applications")
        .select("*, jobs(*)")
        .eq("user_id", session.user.id)
        .order("applied_date", { ascending: false });
      if (data) {
        setApplications(data.map((a: any) => ({ ...a, job: a.jobs })));
      }
    };
    fetchApps();
  }, [session?.user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setJobs([]);
    setApplications([]);
    setPreferences(defaultPreferences);
  };

  return (
    <AppContext.Provider
      value={{
        session,
        user: session?.user || null,
        profile,
        setProfile,
        jobs,
        setJobs,
        applications,
        setApplications,
        preferences,
        setPreferences,
        isSearching,
        setIsSearching,
        loading,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
