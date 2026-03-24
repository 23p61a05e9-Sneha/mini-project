import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, X, Sparkles, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const JobSearch = () => {
  const { setJobs, setIsSearching, preferences, setPreferences, profile } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !preferences.skills.includes(skillInput.trim())) {
      setPreferences({ ...preferences, skills: [...preferences.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (s: string) => {
    setPreferences({ ...preferences, skills: preferences.skills.filter((sk) => sk !== s) });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSearching(true);

    try {
      // Save preferences to profile
      if (profile) {
        await supabase.from("profiles").update({
          skills: preferences.skills,
          preferred_locations: location ? [location] : [],
          experience: preferences.experience,
        }).eq("user_id", profile.user_id);
      }

      const results = await searchJobs(query, preferences.skills, location, preferences.experience);

      // Store jobs in DB in batch
      const { data: jobRows, error: jobError } = await supabase
        .from("jobs")
        .insert(results.map((job) => ({ ...job })))
        .select();

      if (jobError) {
        console.error("Job insert error:", jobError);
        toast.error("Failed to save job results");
        return;
      }

      if (!jobRows || jobRows.length === 0) {
        toast.info("No jobs found", { description: "Try broadening your search criteria." });
        setJobs([]);
      } else {
        toast.success(`Found ${jobRows.length} jobs`, { description: "AI-ranked by skill match score." });
        setJobs(jobRows);
      }
      navigate("/results");
    } catch (err) {
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-mono px-3 py-1.5 rounded-full mb-4 border border-primary/20">
            <Sparkles className="h-3 w-3" /> 5 AI AGENTS · SMART MATCHING
          </div>
          <h1 className="text-3xl font-bold text-foreground">AI Job Search</h1>
          <p className="text-muted-foreground mt-2">Our agents analyze your preferences and find the best-matching jobs.</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          {/* Query */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" /> Job Title / Keywords
              </label>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Frontend Developer, AI Engineer, Data Scientist" className="bg-secondary/50 border-border h-11" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-info" /> Location
              </label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote, San Francisco, New York, Austin" className="bg-secondary/50 border-border h-11" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-accent" /> Experience Level
              </label>
              <select
                value={preferences.experience}
                onChange={(e) => setPreferences({ ...preferences, experience: e.target.value })}
                className="w-full rounded-lg border border-border bg-secondary/50 text-foreground px-3 py-2.5 text-sm h-11"
              >
                <option value="">Any Level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead / Principal</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="text-sm font-medium text-foreground mb-3 block">Skills (add multiple for better matching)</label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter"
                className="bg-secondary/50 border-border h-11"
              />
              <Button type="button" onClick={addSkill} variant="outline" size="icon" className="h-11 w-11 shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {preferences.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {preferences.skills.map((s) => (
                  <motion.span
                    key={s}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full border border-primary/20 font-medium"
                  >
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity text-base font-medium">
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-pulse-glow" /> Agents Searching...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-5 w-5" /> Launch AI Search
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </AppLayout>
  );
};

export default JobSearch;
