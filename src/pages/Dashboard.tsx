import { motion } from "framer-motion";
import { Search, Mail, Bot, TrendingUp, Briefcase, Send } from "lucide-react";
import { useApp } from "@/context/AppContext";
import AppLayout from "@/components/AppLayout";

const stats = [
  { label: "Jobs Found", value: "0", icon: Briefcase, color: "text-primary" },
  { label: "Applications", value: "0", icon: Send, color: "text-accent" },
  { label: "Emails Sent", value: "0", icon: Mail, color: "text-info" },
  { label: "Match Rate", value: "—", icon: TrendingUp, color: "text-success" },
];

const agents = [
  { name: "Preference Analyzer", desc: "Reads your skills & role preferences", icon: Search, status: "Ready" },
  { name: "Job Search Agent", desc: "Searches LinkedIn / job boards", icon: Briefcase, status: "Ready" },
  { name: "Ranking Agent", desc: "AI-ranks jobs by skill match", icon: TrendingUp, status: "Ready" },
  { name: "Email Generator", desc: "Creates personalized outreach", icon: Mail, status: "Ready" },
  { name: "Outreach Agent", desc: "Sends emails automatically", icon: Send, status: "Ready" },
];

const Dashboard = () => {
  const { user, applications, jobs } = useApp();
  const emailsSent = applications.filter((a) => a.emailSent).length;

  const liveStats = [
    { ...stats[0], value: String(jobs.length) },
    { ...stats[1], value: String(applications.length) },
    { ...stats[2], value: String(emailsSent) },
    { ...stats[3], value: jobs.length > 0 ? `${Math.round(jobs.reduce((s, j) => s + j.matchScore, 0) / jobs.length)}%` : "—" },
  ];

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, <span className="text-gradient-primary">{user?.name || "User"}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Your AI agents are ready to find your next opportunity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {liveStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-xs text-muted-foreground font-mono">{s.label}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Agent Pipeline */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" /> Agent Pipeline
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="bg-card border border-border rounded-xl p-4 text-center relative group hover:border-primary/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-3">
                  <agent.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground">{agent.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{agent.desc}</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-success bg-success/10 px-2 py-0.5 rounded-full">
                  {agent.status}
                </span>
                {i < agents.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-muted-foreground z-10 hidden xl:block">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;
