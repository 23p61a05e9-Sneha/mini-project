import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Check, Copy } from "lucide-react";
import { useApp } from "@/context/AppContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EmailPreview = () => {
  const { applications, setApplications } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pendingEmails = applications.filter((a) => !a.emailSent && a.emailBody);
  const selected = pendingEmails.find((a) => a.id === selectedId) || pendingEmails[0];

  const handleSend = (appId: string) => {
    setApplications(
      applications.map((a) => (a.id === appId ? { ...a, emailSent: true, status: "emailed" as const } : a))
    );
    toast.success("Email sent successfully!", { description: `Outreach email sent to ${applications.find((a) => a.id === appId)?.job.recruiterName}` });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Email Outreach</h1>
        <p className="text-sm text-muted-foreground mb-6">AI-generated emails ready to send to recruiters.</p>

        {pendingEmails.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No pending emails. Apply to jobs first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* List */}
            <div className="space-y-2">
              {pendingEmails.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${
                    selected?.id === app.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/20"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground truncate">{app.job.title}</p>
                  <p className="text-xs text-muted-foreground">{app.job.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">To: {app.job.recruiterEmail}</p>
                </button>
              ))}
            </div>

            {/* Preview */}
            {selected && (
              <div className="col-span-2 bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">To: {selected.job.recruiterEmail}</p>
                    <p className="text-xs text-muted-foreground">Subject: Application for {selected.job.title} at {selected.job.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(selected.emailBody || "")}>
                      <Copy className="h-4 w-4 mr-1" /> Copy
                    </Button>
                    <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90" onClick={() => handleSend(selected.id)}>
                      <Send className="h-4 w-4 mr-1" /> Send
                    </Button>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-4 whitespace-pre-wrap text-sm text-foreground leading-relaxed font-mono text-xs">
                  {selected.emailBody}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default EmailPreview;
