import { motion } from "framer-motion";
import { Search, Mail, Bot, TrendingUp, Briefcase, Send, ArrowRight, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

const agents = [
  { name: "Preference Analyzer", desc: "Reads your skills & role preferences", icon: Search, gradient: "from-primary/20 to-primary/5" },
  { name: "Job Search Agent", desc: "Searches LinkedIn / job boards", icon: Briefcase, gradient: "from-info/20 to-info/5" },
  { name: "Ranking Agent", desc: "AI-ranks jobs by skill match", icon: TrendingUp, gradient: "from-warning/20 to-warning/5" },
  { name: "Email Generator", desc: "Creates personalized outreach", icon: Mail, gradient: "from-accent/20 to-accent/5" },
  { name: "Outreach Agent", desc: "Sends emails automatically", icon: Send, gradient: "from-success/20 to-success/5" },
];

const Dashboard = () => {
  const { profile, applications, jobs } = useApp();
  const navigate = useNavigate();
  const emailsSent = applications.filter((a) => a.email_sent).length;

  const stats = [
    { label: "Jobs Found", value: String(jobs.length), icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
    { label: "Applications", value: String(applications.length), icon: Send, color: "text-accent", bg: "bg-accent/10" },
    { label: "Emails Sent", value: String(emailsSent), icon: Mail, color: "text-info", bg: "bg-info/10" },
    { label: "Avg Match", value: jobs.length > 0 ? `${Math.round(jobs.reduce((s, j) => s + (j.match_score || 0), 0) / jobs.length)}%` : "—", icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
  ];

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome, <span className="text-gradient-primary">{profile?.name || "User"}</span>
            </h1>
            <p className="text-muted-foreground mt-1">Your AI agents are ready to find your next opportunity.</p>
          </div>
          <Button onClick={() => navigate("/search")} className="bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2">
            <Search className="h-4 w-4" /> New Search <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all hover:shadow-card group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Agent Pipeline */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" /> Agentic AI Pipeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="bg-card border border-border rounded-xl p-5 text-center relative group hover:border-primary/30 transition-all hover:shadow-card"
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center mx-auto mb-3`}>
                  <agent.icon className="h-5 w-5 text-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{agent.desc}</p>
                <span className="inline-block mt-3 text-[10px] font-mono text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
                  ● Ready
                </span>
                {i < agents.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-muted-foreground/40 z-10 hidden xl:block text-lg">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="text-muted-foreground hover:text-foreground gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/20 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{app.job?.title || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{app.job?.company || "Unknown"} · {new Date(app.applied_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    app.status === "emailed" ? "bg-info/10 text-info" :
                    app.status === "interview" ? "bg-success/10 text-success" :
                    app.status === "rejected" ? "bg-destructive/10 text-destructive" :
                    "bg-warning/10 text-warning"
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;
