import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, Star, Mail, ChevronDown, ChevronUp, Sparkles, Filter, ArrowLeft } from "lucide-react";
import { useApp, JobRow } from "@/context/AppContext";
import { generateEmail } from "@/lib/mockApi";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getScoreColor = (score: number) => {
  if (score >= 85) return "text-success bg-success/10 border-success/20";
  if (score >= 70) return "text-warning bg-warning/10 border-warning/20";
  return "text-muted-foreground bg-muted/50 border-border";
};

const JobCard = ({ job, onApply, isApplying }: { job: JobRow; onApply: (j: JobRow) => void; isApplying: boolean }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all hover:shadow-card group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-base font-semibold text-foreground truncate">{job.title}</h3>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${getScoreColor(job.match_score || 0)}`}>
              {job.match_score}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
          <div className="flex items-center flex-wrap gap-3 mt-2.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
            <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.type}</span>
            {job.salary && <span className="font-mono text-foreground/80">{job.salary}</span>}
            {job.source && <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{job.source}</span>}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={() => setExpanded(!expanded)} className="h-9 w-9 p-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button size="sm" disabled={isApplying} className="bg-gradient-primary text-primary-foreground hover:opacity-90 h-9" onClick={() => onApply(job)}>
            <Mail className="h-4 w-4 mr-1.5" /> Apply
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {(job.skills || []).map((s) => (
                  <span key={s} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md font-medium">{s}</span>
                ))}
              </div>
              {job.recruiter_name && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-warning" />
                  Recruiter: <span className="text-foreground font-medium">{job.recruiter_name}</span> · {job.recruiter_email}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const JobResults = () => {
  const { jobs, user, preferences, applications, setApplications } = useApp();
  const navigate = useNavigate();
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const handleApply = async (job: JobRow) => {
    if (!user) return;
    setGeneratingFor(job.id);

    try {
      const email = await generateEmail(job, user.user_metadata?.name || user.email?.split("@")[0] || "User", preferences.skills);

      const { data, error } = await supabase.from("applications").insert({
        user_id: user.id,
        job_id: job.id,
        status: "applied",
        email_body: email,
        email_subject: `Application for ${job.title} at ${job.company}`,
      }).select("*, jobs(*)").single();

      if (error) throw error;

      if (data) {
        setApplications([{ ...data, job: (data as any).jobs }, ...applications]);
        toast.success("Application created!", { description: "Email generated. Review it in Email Outreach." });
        navigate("/email");
      }
    } catch {
      toast.error("Failed to create application");
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/search")} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">AI-Ranked Results</h1>
            </div>
            <p className="text-muted-foreground ml-11">
              {jobs.length} jobs found · ranked by AI match score
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono text-primary">AGENT RANKED</span>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg mb-2">No jobs yet</p>
            <p className="text-sm text-muted-foreground mb-6">Run an AI search to discover matching opportunities.</p>
            <Button onClick={() => navigate("/search")} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Go to Search
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <JobCard job={job} onApply={handleApply} isApplying={generatingFor === job.id} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default JobResults;
