import { motion } from "framer-motion";
import { Check, Mail, Clock, XCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import AppLayout from "@/components/AppLayout";

const statusConfig = {
  applied: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Applied" },
  emailed: { icon: Mail, color: "text-info", bg: "bg-info/10", label: "Emailed" },
  interview: { icon: Check, color: "text-success", bg: "bg-success/10", label: "Interview" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
  accepted: { icon: Check, color: "text-success", bg: "bg-success/10", label: "Accepted" },
};

const ApplicationHistory = () => {
  const { applications } = useApp();

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Application History</h1>
        <p className="text-sm text-muted-foreground mb-6">{applications.length} total applications</p>

        {applications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No applications yet. Start by searching for jobs.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left p-4 font-medium">Job</th>
                  <th className="text-left p-4 font-medium">Company</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const cfg = statusConfig[app.status];
                  return (
                    <tr key={app.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="p-4 text-sm font-medium text-foreground">{app.job.title}</td>
                      <td className="p-4 text-sm text-muted-foreground">{app.job.company}</td>
                      <td className="p-4 text-xs text-muted-foreground font-mono">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                          <cfg.icon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="p-4">
                        {app.emailSent ? (
                          <span className="text-xs text-success">Sent ✓</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default ApplicationHistory;
