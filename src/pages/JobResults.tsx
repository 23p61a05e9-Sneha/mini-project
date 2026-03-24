import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, Star, Mail, ChevronDown, ChevronUp, Sparkles, Filter, ArrowLeft, ExternalLink } from "lucide-react";
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

const getScoreBar = (score: number) => {
  if (score >= 85) return "bg-success";
  if (score >= 70) return "bg-warning";
  return "bg-muted-foreground";
};

const JobCard = ({ job, onApply, isApplying, index }: { job: JobRow; onApply: (j: JobRow) => void; isApplying: boolean; index: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-6 hover:border-primary/20 transition-all duration-300 hover:shadow-card group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-bold text-foreground truncate font-display">{job.title}</h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${getScoreColor(job.match_score || 0)}`}>
                {job.match_score}%
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-semibold">{job.company}</p>
          <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-lg">
              <MapPin className="h-3.5 w-3.5 text-info" />{job.location}
            </span>
            <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-lg">
              <Briefcase className="h-3.5 w-3.5 text-accent" />{job.type}
            </span>
            {job.salary && (
              <span className="font-mono text-foreground/80 bg-success/8 px-2.5 py-1 rounded-lg border border-success/15">
                {job.salary}
              </span>
            )}
            {job.source && (
              <span className="bg-secondary/50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />{job.source}
              </span>
            )}
          </div>
          {/* Score bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${job.match_score || 0}%` }}
                transition={{ duration: 0.8, delay: index * 0.04 + 0.3 }}
                className={`h-full rounded-full ${getScoreBar(job.match_score || 0)}`}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={() => setExpanded(!expanded)} className="h-10 w-10 p-0 rounded-xl border-border/60">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            disabled={isApplying}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90 h-10 rounded-xl font-semibold px-4"
            onClick={() => onApply(job)}
          >
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
            <div className="mt-5 pt-5 border-t border-border/40 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {(job.skills || []).map((s) => (
                  <span key={s} className="text-xs bg-primary/8 text-primary px-3 py-1.5 rounded-lg font-semibold border border-primary/15">{s}</span>
                ))}
              </div>
              {job.recruiter_name && (
                <div className="flex items-center gap-2 bg-secondary/30 rounded-xl p-3 text-xs text-muted-foreground">
                  <Star className="h-4 w-4 text-warning shrink-0" />
                  <span>Recruiter: <span className="text-foreground font-semibold">{job.recruiter_name}</span> · {job.recruiter_email}</span>
                </div>
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
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/search")} className="h-9 w-9 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground font-display">AI-Ranked Results</h1>
            </div>
            <p className="text-muted-foreground ml-12">
              {jobs.length} jobs found · ranked by AI match score
            </p>
          </div>
          <div className="flex items-center gap-2 bg-primary/8 px-4 py-2 rounded-xl border border-primary/15">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono text-primary tracking-wider">AGENT RANKED</span>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-20 w-20 rounded-3xl bg-secondary/50 flex items-center justify-center mx-auto mb-5">
              <Filter className="h-9 w-9 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-xl mb-2 font-display font-bold">No jobs yet</p>
            <p className="text-sm text-muted-foreground mb-8">Run an AI search to discover matching opportunities.</p>
            <Button onClick={() => navigate("/search")} className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-glow h-12 px-8 font-semibold">
              Go to Search
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={job} onApply={handleApply} isApplying={generatingFor === job.id} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default JobResults;
