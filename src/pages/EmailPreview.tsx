import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Copy, Inbox, CheckCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EmailPreview = () => {
  const { applications, setApplications } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pendingEmails = applications.filter((a) => !a.email_sent && a.email_body);
  const selected = pendingEmails.find((a) => a.id === selectedId) || pendingEmails[0];

  const handleSend = async (appId: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ email_sent: true, status: "emailed" })
      .eq("id", appId);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    setApplications(
      applications.map((a) => (a.id === appId ? { ...a, email_sent: true, status: "emailed" } : a))
    );
    toast.success("Email marked as sent!", {
      description: `Outreach to ${applications.find((a) => a.id === appId)?.job?.recruiter_name || "recruiter"}`,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Email Outreach</h1>
          <p className="text-muted-foreground mt-1">AI-generated emails ready to send to recruiters.</p>
        </div>

        {pendingEmails.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground mb-1">No pending emails</p>
            <p className="text-sm text-muted-foreground">Apply to jobs first to generate outreach emails.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground mb-3 px-1">{pendingEmails.length} PENDING EMAILS</p>
              {pendingEmails.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.id === app.id
                      ? "border-primary bg-primary/5 shadow-card"
                      : "border-border bg-card hover:border-primary/20 hover:shadow-card"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground truncate">{app.job?.title || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{app.job?.company || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {app.job?.recruiter_email || "N/A"}
                  </p>
                </button>
              ))}
            </div>

            {/* Preview */}
            {selected && (
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-border">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      To: <span className="text-foreground font-medium">{selected.job?.recruiter_email}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Subject: <span className="text-foreground font-medium">{selected.email_subject || `Application for ${selected.job?.title}`}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(selected.email_body || "")} className="h-9 gap-1.5">
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </Button>
                    <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 h-9 gap-1.5" onClick={() => handleSend(selected.id)}>
                      <Send className="h-3.5 w-3.5" /> Send
                    </Button>
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-5 whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                  {selected.email_body}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  Generated by AI Email Agent · Gemini LLM
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
