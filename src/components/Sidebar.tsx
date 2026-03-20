import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Mail, History, Settings, LayoutDashboard, LogOut, Bot } from "lucide-react";
import { useApp } from "@/context/AppContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/search", icon: Search, label: "Job Search" },
  { to: "/results", icon: Bot, label: "AI Results" },
  { to: "/email", icon: Mail, label: "Email Outreach" },
  { to: "/history", icon: History, label: "History" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const { setUser } = useApp();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-tight">AgentJob AI</h1>
          <p className="text-[10px] text-muted-foreground font-mono">AGENTIC OUTREACH</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className="block relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-secondary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={() => setUser(null)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
