import { motion } from "framer-motion";
import { Search, Mail, Bot, TrendingUp, Briefcase, Send, ArrowRight, Zap, Activity, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

const agents = [
  { name: "Preference Analyzer", desc: "Reads your skills & role preferences", icon: Search, gradient: "from-primary/20 to-primary/5", iconColor: "text-primary" },
  { name: "Job Search Agent", desc: "Searches multiple job platforms", icon: Briefcase, gradient: "from-info/20 to-info/5", iconColor: "text-info" },
  { name: "Ranking Agent", desc: "AI-ranks jobs by skill match", icon: TrendingUp, gradient: "from-warning/20 to-warning/5", iconColor: "text-warning" },
  { name: "Email Generator", desc: "Creates personalized outreach", icon: Mail, gradient: "from-accent/20 to-accent/5", iconColor: "text-accent" },
  { name: "Outreach Agent", desc: "Sends emails automatically", icon: Send, gradient: "from-success/20 to-success/5", iconColor: "text-success" },
];

const Dashboard = () => {
  const { profile, applications, jobs } = useApp();
  const navigate = useNavigate();
  const emailsSent = applications.filter((a) => a.email_sent).length;

  const stats = [
    { label: "Jobs Found", value: String(jobs.length), icon: Briefcase, gradient: "from-primary/15 to-primary/5", iconColor: "text-primary", borderColor: "border-primary/15" },
    { label: "Applications", value: String(applications.length), icon: Send, gradient: "from-accent/15 to-accent/5", iconColor: "text-accent", borderColor: "border-accent/15" },
    { label: "Emails Sent", value: String(emailsSent), icon: Mail, gradient: "from-info/15 to-info/5", iconColor: "text-info", borderColor: "border-info/15" },
    { label: "Avg Match", value: jobs.length > 0 ? `${Math.round(jobs.reduce((s, j) => s + (j.match_score || 0), 0) / jobs.length)}%` : "—", icon: TrendingUp, gradient: "from-success/15 to-success/5", iconColor: "text-success", borderColor: "border-success/15" },
  ];

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
        {/* Welcome */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-primary animate-pulse-glow" />
              <span className="text-xs font-mono text-primary tracking-wider">DASHBOARD</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground font-display">
              Welcome, <span className="text-gradient-primary">{profile?.name || "User"}</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-base">Your AI agents are ready to find your next opportunity.</p>
          </div>
          <Button
            onClick={() => navigate("/search")}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2 shadow-glow h-12 px-6 rounded-xl font-semibold"
          >
            <Search className="h-4 w-4" /> New Search <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-card/80 backdrop-blur-sm border ${s.borderColor} rounded-2xl p-6 hover:shadow-card transition-all duration-300 group`}
            >
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <p className="text-3xl lg:text-4xl font-extrabold text-foreground font-display">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium tracking-wide uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Agent Pipeline */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground font-display">Agentic AI Pipeline</h2>
            <span className="ml-auto text-[10px] font-mono text-success tracking-wider">ALL SYSTEMS ONLINE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-5 text-center relative group hover:border-primary/20 transition-all duration-300 hover:shadow-card"
              >
                <div className={`h-13 w-13 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`} style={{ height: 52, width: 52 }}>
                  <agent.icon className={`h-5 w-5 ${agent.iconColor}`} />
                </div>
                <p className="text-sm font-bold text-foreground font-display">{agent.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{agent.desc}</p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-mono text-success bg-success/8 px-2.5 py-1 rounded-full border border-success/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Ready
                </span>
                {i < agents.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden xl:flex items-center justify-center w-6 h-6 rounded-full bg-card border border-border">
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" /> Recent Applications
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="text-muted-foreground hover:text-foreground gap-1 font-medium">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {applications.slice(0, 3).map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-xl p-4 flex items-center justify-between hover:border-primary/20 transition-all duration-200"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{app.job?.title || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{app.job?.company || "Unknown"} · {new Date(app.applied_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                    app.status === "emailed" ? "bg-info/10 text-info border border-info/20" :
                    app.status === "interview" ? "bg-success/10 text-success border border-success/20" :
                    app.status === "rejected" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                    "bg-warning/10 text-warning border border-warning/20"
                  }`}>
                    {app.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;
