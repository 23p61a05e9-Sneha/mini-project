import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Search, Mail, TrendingUp, ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Search, title: "AI Job Search", desc: "Agents automatically find jobs matching your skills across multiple platforms." },
  { icon: TrendingUp, title: "Smart Ranking", desc: "LLM-powered scoring ranks jobs by skill match, salary, and fit." },
  { icon: Mail, title: "Auto Outreach", desc: "Personalized recruiter emails generated and sent with one click." },
  { icon: Zap, title: "Agentic Pipeline", desc: "5 specialized AI agents work in sequence for end-to-end automation." },
  { icon: Shield, title: "Professional Emails", desc: "Gemini-powered emails that feel human-written and get responses." },
  { icon: Globe, title: "Multi-Source", desc: "Search LinkedIn, Indeed, and more from a single dashboard." },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />

      {/* Nav */}
      <nav className="relative flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">AgentJob AI</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
          <Button onClick={() => navigate("/register")} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto text-center px-4 pt-20 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full mb-6">
            AGENTIC AI · 5 AGENTS · ZERO EFFORT
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            Your AI Agents Find Jobs <br />
            <span className="text-gradient-primary">& Email Recruiters</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            An agentic AI system with 5 specialized agents that search jobs, rank matches, generate personalized outreach emails, and send them — all automatically.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/register")} className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-8">
              Start Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/20 transition-colors"
            >
              <f.icon className="h-6 w-6 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative text-center py-8 text-xs text-muted-foreground border-t border-border">
        <p>AgentJob AI — BTech Final Year Project · Agentic AI Architecture</p>
      </footer>
    </div>
  );
};

export default Index;
