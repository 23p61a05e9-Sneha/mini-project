import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, X, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { searchJobs } from "@/lib/mockApi";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const JobSearch = () => {
  const { setJobs, setIsSearching, preferences, setPreferences } = useApp();
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
      const results = await searchJobs(query, preferences.skills);
      setJobs(results);
      navigate("/results");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-1">AI Job Search</h1>
        <p className="text-sm text-muted-foreground mb-8">Our agents will analyze your preferences and find the best matches.</p>

        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Job Title / Keywords</label>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Frontend Developer, AI Engineer" className="bg-secondary border-border" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote, San Francisco" className="bg-secondary border-border" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Skills</label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter"
                className="bg-secondary border-border"
              />
              <Button type="button" onClick={addSkill} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {preferences.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {preferences.skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Experience Level</label>
            <select
              value={preferences.experience}
              onChange={(e) => setPreferences({ ...preferences, experience: e.target.value })}
              className="w-full rounded-lg border border-border bg-secondary text-foreground px-3 py-2 text-sm"
            >
              <option value="">Any</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead / Principal</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse-glow" /> Agents Searching...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" /> Launch AI Search
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </AppLayout>
  );
};

export default JobSearch;
