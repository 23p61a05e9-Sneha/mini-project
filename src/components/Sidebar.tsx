import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Mail, History, Settings, LayoutDashboard, LogOut, Bot, Sparkles, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/search", icon: Search, label: "Job Search" },
  { to: "/results", icon: Sparkles, label: "AI Results" },
  { to: "/email", icon: Mail, label: "Email Outreach" },
  { to: "/history", icon: History, label: "History" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const { signOut, profile } = useApp();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] glass-strong flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3.5 px-6 py-6">
        <div className="relative">
          <div className="h-11 w-11 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-background" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-tight font-display">AgentJob AI</h1>
          <p className="text-[10px] text-muted-foreground font-mono tracking-[0.2em] uppercase">Agentic Outreach</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className="block relative group">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border-glow"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
                <item.icon className={`h-[18px] w-[18px] transition-colors ${active ? "text-primary" : "group-hover:text-foreground"}`} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 text-primary/60" />}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="px-3 py-4 space-y-2">
        {profile && (
          <div className="px-4 py-3 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-accent flex items-center justify-center text-xs font-bold text-accent-foreground font-display shrink-0">
                {profile.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{profile.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{profile.email}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all w-full group"
        >
          <LogOut className="h-[18px] w-[18px] group-hover:text-destructive transition-colors" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
