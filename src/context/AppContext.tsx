import { useState, createContext, useContext, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  skills: string[];
  matchScore: number;
  recruiterName: string;
  recruiterEmail: string;
  postedDate: string;
  source: string;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  status: "applied" | "emailed" | "interview" | "rejected" | "accepted";
  appliedDate: string;
  emailSent: boolean;
  emailBody?: string;
}

export interface Preferences {
  roles: string[];
  skills: string[];
  locations: string[];
  jobTypes: string[];
  minSalary: string;
  experience: string;
}

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  jobs: Job[];
  setJobs: (j: Job[]) => void;
  applications: Application[];
  setApplications: (a: Application[]) => void;
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
  isSearching: boolean;
  setIsSearching: (b: boolean) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <AppContext.Provider value={{ user, setUser, jobs, setJobs, applications, setApplications, preferences, setPreferences, isSearching, setIsSearching }}>
      {children}
    </AppContext.Provider>
  );
};
