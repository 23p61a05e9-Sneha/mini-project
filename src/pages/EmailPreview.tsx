import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Copy, Inbox, CheckCircle, Bot, Sparkles, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EmailPreview = () => {
  const { applications, setApplications } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const pendingEmails = applications.filter((a) => !a.email_sent && a.email_body);
  const selected = pendingEmails.find((a) => a.id === selectedId) || pendingEmails[0];

  const handleSend = async (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: app.job?.recruiter_email,
          subject: app.email_subject || `Application for ${app.job?.title}`,
          body: app.email_body || '',
          applicationId: appId,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setApplications(
        applications.map((a) => (a.id === appId ? { ...a, email_sent: true, status: "emailed" } : a))
      );
      toast.success("Email sent successfully!", {
        description: `Outreach sent to ${app.job?.recruiter_email || "recruiter"}`,
      });
    } catch (err: any) {
      console.error('Send error:', err);
      const msg = err?.message || 'Failed to send email';
      if (msg.includes('SMTP not configured') || msg.includes('Gmail')) {
        toast.error("SMTP not configured", {
          description: "Go to Settings to add your Gmail credentials first.",
        });
      } else {
        toast.error("Failed to send email", { description: msg });
      }
    } finally {
      setSending(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-info animate-pulse-glow" />
            <span className="text-xs font-mono text-info tracking-wider">OUTREACH</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground font-display">Email Outreach</h1>
          <p className="text-muted-foreground mt-2 text-base">AI-generated emails ready to send to recruiters.</p>
        </div>

        {pendingEmails.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-20 w-20 rounded-3xl bg-secondary/50 flex items-center justify-center mx-auto mb-5">
              <Inbox className="h-9 w-9 text-muted-foreground" />
            </div>
            <p className="text-xl text-muted-foreground mb-2 font-display font-bold">No pending emails</p>
            <p className="text-sm text-muted-foreground">Apply to jobs first to generate outreach emails.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* List */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4 px-1">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <p className="text-xs font-mono text-muted-foreground tracking-wider">{pendingEmails.length} PENDING EMAILS</p>
              </div>
              {pendingEmails.map((app, i) => (
                <motion.button
                  key={app.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedId(app.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                    selected?.id === app.id
                      ? "border-primary/30 bg-primary/5 shadow-card border-glow"
                      : "border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/20 hover:shadow-card"
                  }`}
                >
                  <p className="text-sm font-bold text-foreground truncate font-display">{app.job?.title || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">{app.job?.company || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-info" /> {app.job?.recruiter_email || "No email found"}
                  </p>
                </motion.button>
              ))}
            </div>

            {/* Preview */}
            {selected && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-7"
              >
                <div className="flex items-start justify-between mb-6 pb-5 border-b border-border/40">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      To: <span className="text-foreground font-semibold">{selected.job?.recruiter_email || "No email"}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Subject: <span className="text-foreground font-semibold">{selected.email_subject || `Application for ${selected.job?.title}`}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(selected.email_body || "")} className="h-10 gap-1.5 rounded-xl border-border/60">
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-primary text-primary-foreground hover:opacity-90 h-10 gap-1.5 rounded-xl shadow-glow font-semibold"
                      onClick={() => handleSend(selected.id)}
                      disabled={sending || !selected.job?.recruiter_email}
                    >
                      {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      {sending ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
                <div className="bg-secondary/20 rounded-2xl p-6 whitespace-pre-wrap text-sm text-foreground leading-relaxed border border-border/30">
                  {selected.email_body}
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Bot className="h-4 w-4 text-primary" />
                  <span>Generated by AI Email Agent</span>
                  <CheckCircle className="h-3.5 w-3.5 text-success ml-auto" />
                  <span className="text-success font-medium">Ready to send</span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default EmailPreview;
