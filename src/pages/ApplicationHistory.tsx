import { motion } from "framer-motion";
import { Check, Mail, Clock, XCircle, Briefcase, TrendingUp, History, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

const statusConfig = {
  applied: { icon: Clock, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Applied" },
  emailed: { icon: Mail, color: "text-info", bg: "bg-info/10", border: "border-info/20", label: "Emailed" },
  interview: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Interview" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Rejected" },
  accepted: { icon: Check, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Accepted" },
};

const ApplicationHistory = () => {
  const { applications } = useApp();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <History className="h-4 w-4 text-accent animate-pulse-glow" />
            <span className="text-xs font-mono text-accent tracking-wider">HISTORY</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground font-display">Application History</h1>
          <p className="text-muted-foreground mt-2 text-base">{applications.length} total applications tracked</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-20 w-20 rounded-3xl bg-secondary/50 flex items-center justify-center mx-auto mb-5">
              <Briefcase className="h-9 w-9 text-muted-foreground" />
            </div>
            <p className="text-xl text-muted-foreground mb-2 font-display font-bold">No applications yet</p>
            <p className="text-sm text-muted-foreground mb-8">Start by searching for jobs and applying.</p>
            <Button onClick={() => navigate("/search")} className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-glow h-12 px-8 font-semibold">
              Search Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app, i) => {
              const cfg = statusConfig[app.status as keyof typeof statusConfig] || statusConfig.applied;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-5 flex items-center justify-between hover:border-primary/20 transition-all duration-300 hover:shadow-card group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`h-11 w-11 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <cfg.icon className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate font-display">{app.job?.title || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{app.job?.company || "Unknown"} · {app.job?.location || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-muted-foreground font-mono hidden sm:block">
                      {new Date(app.applied_date).toLocaleDateString()}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                    {app.email_sent ? (
                      <span className="text-xs text-success font-semibold flex items-center gap-1 bg-success/8 px-2.5 py-1 rounded-lg border border-success/15">
                        <Check className="h-3 w-3" /> Sent
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-lg">Pending</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default ApplicationHistory;
