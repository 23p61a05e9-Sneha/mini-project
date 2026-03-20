import { useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useApp } from "@/context/AppContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SettingsPage = () => {
  const { user } = useApp();
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpEmail, setSmtpEmail] = useState(user?.email || "");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [geminiKey, setGeminiKey] = useState("");

  const handleSave = () => {
    toast.success("Settings saved!", { description: "Your configuration has been updated." });
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground mb-8">Configure your email and AI preferences.</p>

        <div className="space-y-8">
          {/* SMTP Settings */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">Email (SMTP) Configuration</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">SMTP Host</label>
                <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">SMTP Port</label>
                <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Email Address</label>
                <Input value={smtpEmail} onChange={(e) => setSmtpEmail(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">App Password</label>
                <Input type="password" value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} placeholder="Gmail App Password" className="bg-secondary border-border" />
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">AI Configuration</h2>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Gemini API Key</label>
              <Input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="Enter your Gemini API key" className="bg-secondary border-border" />
              <p className="text-xs text-muted-foreground mt-1">Used by the Python backend for email generation and job ranking.</p>
            </div>
          </div>

          <Button onClick={handleSave} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Save className="h-4 w-4 mr-2" /> Save Settings
          </Button>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default SettingsPage;
