import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Server, Brain, Loader2, CheckCircle, Settings, Shield, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SettingsPage = () => {
  const { profile, setProfile, user } = useApp();
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [smtpEmail, setSmtpEmail] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setSmtpHost(profile.smtp_host || "smtp.gmail.com");
      setSmtpPort(profile.smtp_port || "587");
      setSmtpEmail(profile.smtp_email || "");
      setSmtpPassword(profile.smtp_password || "");
      setGeminiKey(profile.gemini_key || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("profiles")
      .update({
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_email: smtpEmail,
        smtp_password: smtpPassword,
        gemini_key: geminiKey,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    setSaving(false);
    if (error) {
      toast.error("Failed to save settings");
    } else {
      if (data) setProfile(data);
      toast.success("Settings saved!", { description: "Your configuration has been updated." });
    }
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground tracking-wider">CONFIGURATION</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground font-display">Settings</h1>
          <p className="text-muted-foreground mt-2 text-base">Configure your email and AI preferences.</p>
        </div>

        <div className="space-y-5">
          {/* SMTP Settings */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-11 w-11 rounded-xl bg-info/10 flex items-center justify-center">
                <Server className="h-5 w-5 text-info" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground font-display">Email (SMTP) Configuration</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Configure Gmail for sending outreach emails</p>
              </div>
              <Shield className="h-4 w-4 text-success ml-auto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">SMTP Host</label>
                <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="bg-secondary/30 border-border/60 h-11 rounded-xl focus:border-info/40" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">SMTP Port</label>
                <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="bg-secondary/30 border-border/60 h-11 rounded-xl focus:border-info/40" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Email Address</label>
                <Input value={smtpEmail} onChange={(e) => setSmtpEmail(e.target.value)} className="bg-secondary/30 border-border/60 h-11 rounded-xl focus:border-info/40" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">App Password</label>
                <Input type="password" value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} placeholder="Gmail App Password" className="bg-secondary/30 border-border/60 h-11 rounded-xl focus:border-info/40" />
              </div>
            </div>
          </motion.div>

          {/* AI Settings */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground font-display">AI Configuration</h2>
                <p className="text-xs text-muted-foreground mt-0.5">API key for Gemini LLM email generation</p>
              </div>
              <Zap className="h-4 w-4 text-warning ml-auto" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Gemini API Key</label>
              <Input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="Enter your Gemini API key" className="bg-secondary/30 border-border/60 h-11 rounded-xl focus:border-accent/40" />
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5 bg-secondary/30 px-3 py-2 rounded-lg">
                <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                Used by the AI backend for email generation and job ranking.
              </p>
            </div>
          </motion.div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90 h-12 px-8 rounded-xl shadow-glow font-semibold text-base"
          >
            {saving ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
            Save Settings
          </Button>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default SettingsPage;
