import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, ArrowRight, Loader2, User, Mail as MailIcon, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);
    if (error) {
      toast.error("Registration failed", { description: error.message });
    } else {
      toast.success("Account created!", { description: "You're now signed in." });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-[100px]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-[440px] px-4"
      >
        <div className="glass-strong rounded-3xl p-10 shadow-elevated">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-13 w-13 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow-accent" style={{ height: 52, width: 52 }}>
              <Bot className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display">Create Account</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Start your AI-powered job search</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="bg-secondary/40 border-border/60 h-12 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:border-accent/40" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <MailIcon className="h-3.5 w-3.5 text-muted-foreground" /> Email
              </label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-secondary/40 border-border/60 h-12 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:border-accent/40" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Password
              </label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="bg-secondary/40 border-border/60 h-12 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:border-accent/40" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-accent text-accent-foreground hover:opacity-90 transition-opacity font-semibold rounded-xl shadow-glow-accent text-base">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
