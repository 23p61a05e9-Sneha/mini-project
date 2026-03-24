import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Search, Mail, TrendingUp, ArrowRight, Zap, Shield, Globe, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Search, title: "AI Job Search", desc: "Agents automatically find jobs matching your skills across multiple platforms.", color: "text-primary", bg: "bg-primary/10" },
  { icon: TrendingUp, title: "Smart Ranking", desc: "LLM-powered scoring ranks jobs by skill match, salary, and fit.", color: "text-warning", bg: "bg-warning/10" },
  { icon: Mail, title: "Auto Outreach", desc: "Personalized recruiter emails generated and sent with one click.", color: "text-info", bg: "bg-info/10" },
  { icon: Zap, title: "Agentic Pipeline", desc: "5 specialized AI agents work in sequence for end-to-end automation.", color: "text-accent", bg: "bg-accent/10" },
  { icon: Shield, title: "Professional Emails", desc: "Gemini-powered emails that feel human-written and get responses.", color: "text-success", bg: "bg-success/10" },
  { icon: Globe, title: "Multi-Source", desc: "Search LinkedIn, Indeed, and more from a single dashboard.", color: "text-destructive", bg: "bg-destructive/10" },
];

const steps = [
  { step: "01", title: "Set Preferences", desc: "Enter your skills, location, and desired roles." },
  { step: "02", title: "AI Search & Rank", desc: "Agents search and rank jobs by match score." },
  { step: "03", title: "Generate & Send", desc: "AI creates personalized emails and sends them." },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px]" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-info/5 rounded-full blur-[100px]" />

      {/* Nav */}
      <nav className="relative flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground text-lg">AgentJob AI</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")} className="text-muted-foreground hover:text-foreground">Sign In</Button>
          <Button onClick={() => navigate("/register")} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            Get Started <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto text-center px-4 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 px-4 py-2 rounded-full mb-8 border border-primary/20">
            <Sparkles className="h-3 w-3" /> AGENTIC AI · 5 AGENTS · ZERO EFFORT
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6">
            Your AI Agents Find Jobs<br />
            <span className="text-gradient-primary">& Email Recruiters</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            An agentic AI system with 5 specialized agents that search jobs, rank matches,
            generate personalized outreach emails, and send them — all automatically.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/register")} className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-8 h-12 text-base shadow-glow">
              Start Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="h-12 text-base border-border hover:bg-secondary">
              Sign In
            </Button>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-foreground mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 text-center relative"
            >
              <span className="text-4xl font-bold text-primary/20 font-mono">{s.step}</span>
              <h3 className="text-base font-semibold text-foreground mt-2 mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-muted-foreground/30 z-10 hidden md:block text-2xl">→</div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-foreground mb-10">Powered by AI Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/20 transition-all hover:shadow-card group"
            >
              <div className={`h-10 w-10 rounded-lg ${f.bg} flex items-center justify-center mb-4`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-3xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Automate Your Job Search?</h2>
          <p className="text-muted-foreground mb-8">Join now and let AI agents do the heavy lifting.</p>
          <Button size="lg" onClick={() => navigate("/register")} className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-10 h-12 text-base shadow-glow">
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative text-center py-8 text-xs text-muted-foreground border-t border-border">
        <p>AgentJob AI — BTech Final Year Project · Agentic AI Architecture · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
