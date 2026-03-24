import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Server, Brain, Loader2, CheckCircle } from "lucide-react";
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
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your email and AI preferences.</p>
        </div>

        <div className="space-y-6">
          {/* SMTP Settings */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-lg bg-info/10 flex items-center justify-center">
                <Server className="h-4 w-4 text-info" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Email (SMTP) Configuration</h2>
                <p className="text-xs text-muted-foreground">Configure Gmail for sending outreach emails</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">SMTP Host</label>
                <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="bg-secondary/50 border-border h-10" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">SMTP Port</label>
                <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="bg-secondary/50 border-border h-10" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                <Input value={smtpEmail} onChange={(e) => setSmtpEmail(e.target.value)} className="bg-secondary/50 border-border h-10" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">App Password</label>
                <Input type="password" value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} placeholder="Gmail App Password" className="bg-secondary/50 border-border h-10" />
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <Brain className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">AI Configuration</h2>
                <p className="text-xs text-muted-foreground">API key for Gemini LLM email generation</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Gemini API Key</label>
              <Input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="Enter your Gemini API key" className="bg-secondary/50 border-border h-10" />
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Used by the Python backend for email generation and job ranking.
              </p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary text-primary-foreground hover:opacity-90 h-11 px-6">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Settings
          </Button>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default SettingsPage;
