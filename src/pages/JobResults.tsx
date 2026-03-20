import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, Star, Mail, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useApp, Job } from "@/context/AppContext";
import { generateEmail } from "@/lib/mockApi";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, onApply }: { job: Job; onApply: (j: Job) => void }) => {
  const [expanded, setExpanded] = useState(false);

  const scoreColor = job.matchScore >= 85 ? "text-success" : job.matchScore >= 70 ? "text-warning" : "text-muted-foreground";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
            <span className={`text-xs font-mono font-bold ${scoreColor}`}>{job.matchScore}%</span>
          </div>
          <p className="text-sm text-muted-foreground">{job.company}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
            <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.type}</span>
            <span className="font-mono">{job.salary}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90" onClick={() => onApply(job)}>
            <Mail className="h-4 w-4 mr-1" /> Apply
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
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {job.skills.map((s) => (
                  <span key={s} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{s}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                <Star className="inline h-3 w-3 mr-1" />
                Recruiter: {job.recruiterName} · {job.recruiterEmail}
              </p>
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

  const handleApply = async (job: Job) => {
    setGeneratingFor(job.id);
    const email = await generateEmail(job, user?.name || "User", preferences.skills);
    const newApp = {
      id: Date.now().toString(),
      jobId: job.id,
      job,
      status: "applied" as const,
      appliedDate: new Date().toISOString(),
      emailSent: false,
      emailBody: email,
    };
    setApplications([...applications, newApp]);
    setGeneratingFor(null);
    navigate("/email");
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI-Ranked Results</h1>
            <p className="text-sm text-muted-foreground">{jobs.length} jobs found, ranked by AI match score</p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No jobs yet. Run a search first.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/search")}>
              Go to Search
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default JobResults;
