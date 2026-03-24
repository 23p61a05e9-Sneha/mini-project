import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Search, Mail, TrendingUp, ArrowRight, Zap, Shield, Globe, Sparkles, ChevronRight, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Search, title: "AI Job Discovery", desc: "Agents scan and surface opportunities matching your exact skill profile across platforms.", gradient: "from-primary/20 to-primary/5", iconColor: "text-primary" },
  { icon: TrendingUp, title: "Intelligent Ranking", desc: "LLM-powered scoring evaluates job-skill alignment, salary, culture fit, and growth.", gradient: "from-warning/20 to-warning/5", iconColor: "text-warning" },
  { icon: Mail, title: "Auto Email Outreach", desc: "Personalized, professional recruiter emails crafted and sent with a single click.", gradient: "from-info/20 to-info/5", iconColor: "text-info" },
  { icon: Zap, title: "5-Agent Pipeline", desc: "Five specialized AI agents orchestrate end-to-end from search to sent email.", gradient: "from-accent/20 to-accent/5", iconColor: "text-accent" },
  { icon: Shield, title: "Human-Quality Emails", desc: "Gemini-powered messaging that reads naturally and dramatically boosts response rates.", gradient: "from-success/20 to-success/5", iconColor: "text-success" },
  { icon: Globe, title: "Multi-Source Aggregation", desc: "Unified search across LinkedIn, Indeed, Glassdoor, and 50+ job boards.", gradient: "from-destructive/20 to-destructive/5", iconColor: "text-destructive" },
];

const steps = [
  { step: "01", title: "Set Your Profile", desc: "Define skills, preferred locations, experience level, and target roles.", color: "border-primary/30", glow: "shadow-glow" },
  { step: "02", title: "AI Search & Rank", desc: "Five agents search, evaluate, and rank jobs by your unique match score.", color: "border-accent/30", glow: "shadow-glow-accent" },
  { step: "03", title: "Generate & Send", desc: "AI writes personalized outreach emails and sends them to recruiters.", color: "border-info/30", glow: "" },
];

const stats = [
  { value: "10K+", label: "Jobs Processed" },
  { value: "95%", label: "Match Accuracy" },
  { value: "3x", label: "Response Rate" },
  { value: "5", label: "AI Agents" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background mesh */}
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-hero pointer-events-none" />

      {/* Animated orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[100px] animate-float" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-foreground text-lg font-display">AgentJob</span>
            <span className="text-primary font-bold text-lg font-display"> AI</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")} className="text-muted-foreground hover:text-foreground font-medium">
            Sign In
          </Button>
          <Button onClick={() => navigate("/register")} className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow font-semibold px-6">
            Get Started <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-20 lg:pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-xs font-mono text-primary bg-primary/8 px-5 py-2.5 rounded-full mb-8 border border-primary/15 shadow-glow backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="tracking-[0.15em]">AGENTIC AI · 5 AGENTS · ZERO EFFORT</span>
          </motion.span>

          <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold text-foreground leading-[1.05] mb-7 font-display tracking-tight">
            Your AI Agents Find Jobs
            <br />
            <span className="text-gradient-primary">& Email Recruiters</span>
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            An agentic AI system with 5 specialized agents that search jobs, rank matches,
            generate personalized outreach emails, and send them — all automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-10 h-14 text-base font-semibold shadow-glow rounded-2xl"
            >
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="h-14 text-base border-border/60 hover:bg-secondary/50 rounded-2xl px-8 backdrop-blur-sm"
            >
              <Play className="mr-2 h-4 w-4" /> Watch Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-1"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/30 rounded-xl overflow-hidden">
            {stats.map((s) => (
              <div key={s.label} className="bg-card/80 backdrop-blur-sm px-6 py-6 text-center">
                <p className="text-3xl font-extrabold text-foreground font-display">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="text-center mb-14">
            <span className="text-xs font-mono text-primary tracking-[0.2em] uppercase">How it works</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-3 font-display">Three Steps to Automation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative bg-card/80 backdrop-blur-sm border ${s.color} rounded-2xl p-8 text-center group hover:scale-[1.02] transition-transform duration-300 ${s.glow}`}
              >
                <span className="text-6xl font-extrabold text-primary/10 font-display">{s.step}</span>
                <h3 className="text-lg font-bold text-foreground mt-2 mb-2 font-display">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-card border border-border">
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="text-center mb-14">
            <span className="text-xs font-mono text-accent tracking-[0.2em] uppercase">Features</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-3 font-display">Powered by AI Agents</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-7 hover:border-primary/20 transition-all duration-300 group hover:shadow-card"
              >
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2 font-display">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonial / Social proof */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-warning text-warning" />
            ))}
          </div>
          <blockquote className="text-xl lg:text-2xl text-foreground font-medium leading-relaxed mb-6 font-display">
            "AgentJob AI sent personalized emails to 15 recruiters while I was sleeping. Woke up to 3 interview invites."
          </blockquote>
          <p className="text-sm text-muted-foreground">— Built with Agentic AI Architecture</p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/80 backdrop-blur-sm p-12 lg:p-16 text-center shadow-glow">
            <div className="absolute inset-0 bg-gradient-hero opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-5 font-display">
                Ready to Automate Your Job Search?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                Join now and let AI agents handle the heavy lifting while you focus on what matters.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-12 h-14 text-base font-semibold shadow-glow rounded-2xl"
              >
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-10 text-xs text-muted-foreground border-t border-border/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bot className="h-4 w-4 text-primary" />
          <span className="font-display font-semibold text-foreground/80">AgentJob AI</span>
        </div>
        <p>BTech Final Year Project · Agentic AI Architecture · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
