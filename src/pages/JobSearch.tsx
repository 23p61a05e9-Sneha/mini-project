import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, X, Sparkles, MapPin, Briefcase, GraduationCap, Zap, Bot } from "lucide-react";
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
      if (profile) {
        await supabase.from("profiles").update({
          skills: preferences.skills,
          preferred_locations: location ? [location] : [],
          experience: preferences.experience,
        }).eq("user_id", profile.user_id);
      }

      const { data: aiResult, error: aiError } = await supabase.functions.invoke('search-jobs', {
        body: { query, skills: preferences.skills, location, experience: preferences.experience },
      });

      if (aiError || !aiResult?.success) {
        toast.error(aiResult?.error || "AI search failed. Please try again.");
        return;
      }

      const results = aiResult.jobs;

      const { data: jobRows, error: jobError } = await supabase
        .from("jobs")
        .insert(results.map((job: any) => ({ ...job })))
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
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-primary/8 text-primary text-xs font-mono px-4 py-2 rounded-full mb-5 border border-primary/15 backdrop-blur-sm"
          >
            <Bot className="h-3.5 w-3.5" />
            <span className="tracking-[0.15em]">5 AI AGENTS · SMART MATCHING</span>
          </motion.div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground font-display">AI Job Search</h1>
          <p className="text-muted-foreground mt-3 text-base max-w-md mx-auto">Our agents analyze your preferences and find the best-matching opportunities.</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-5">
          {/* Main fields */}
          <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-7 space-y-5">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" /> Job Title / Keywords
              </label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Frontend Developer, AI Engineer, Data Scientist"
                className="bg-secondary/30 border-border/60 h-12 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-info" /> Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote, San Francisco, New York"
                className="bg-secondary/30 border-border/60 h-12 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-info/40"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-accent" /> Experience Level
              </label>
              <select
                value={preferences.experience}
                onChange={(e) => setPreferences({ ...preferences, experience: e.target.value })}
                className="w-full rounded-xl border border-border/60 bg-secondary/30 text-foreground px-4 py-3 text-sm h-12 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
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
          <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-7">
            <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" /> Skills
              <span className="text-xs text-muted-foreground font-normal ml-1">(add multiple for better matching)</span>
            </label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter"
                className="bg-secondary/30 border-border/60 h-12 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-warning/40"
              />
              <Button type="button" onClick={addSkill} variant="outline" className="h-12 w-12 shrink-0 rounded-xl border-border/60 hover:border-warning/40 hover:bg-warning/5">
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
                    className="inline-flex items-center gap-1.5 bg-primary/8 text-primary text-xs px-3 py-2 rounded-xl border border-primary/15 font-semibold"
                  >
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="hover:text-destructive transition-colors ml-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity text-base font-semibold rounded-2xl shadow-glow"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 animate-pulse-glow" />
                <span>Agents Searching...</span>
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Search className="h-5 w-5" />
                <span>Launch AI Search</span>
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </AppLayout>
  );
};

export default JobSearch;
