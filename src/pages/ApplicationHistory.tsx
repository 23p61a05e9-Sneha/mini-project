import { motion } from "framer-motion";
import { Check, Mail, Clock, XCircle, Briefcase, TrendingUp } from "lucide-react";
import { useApp } from "@/context/AppContext";
import AppLayout from "@/components/AppLayout";

const statusConfig = {
  applied: { icon: Clock, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Applied" },
  emailed: { icon: Mail, color: "text-info", bg: "bg-info/10", border: "border-info/20", label: "Emailed" },
  interview: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Interview" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Rejected" },
  accepted: { icon: Check, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Accepted" },
};

const ApplicationHistory = () => {
  const { applications } = useApp();

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Application History</h1>
          <p className="text-muted-foreground mt-1">{applications.length} total applications tracked</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground mb-1">No applications yet</p>
            <p className="text-sm text-muted-foreground">Start by searching for jobs and applying.</p>
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
                  className="bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:border-primary/20 transition-all hover:shadow-card"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`h-10 w-10 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <cfg.icon className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{app.job?.title || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{app.job?.company || "Unknown"} · {app.job?.location || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-muted-foreground font-mono hidden sm:block">
                      {new Date(app.applied_date).toLocaleDateString()}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                    {app.email_sent ? (
                      <span className="text-xs text-success font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> Sent
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
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
