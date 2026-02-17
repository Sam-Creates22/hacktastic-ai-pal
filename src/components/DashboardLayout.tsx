import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, LayoutDashboard, Upload, CheckSquare, MessageSquare, Calendar, Bell, Settings, Shield, LogOut, Menu, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/upload", icon: Upload, label: "Upload" },
  { to: "/dashboard/events", icon: CalendarDays, label: "Events" },
  { to: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/dashboard/chat", icon: MessageSquare, label: "AI Chat" },
  { to: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  { to: "/dashboard/reminders", icon: Bell, label: "Reminders" },
];

const adminItems = [
  { to: "/dashboard/admin", icon: Shield, label: "Admin" },
];

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const allItems = isAdmin ? [...navItems, ...adminItems] : navItems;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
          <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">HackTrack</span>
          {isAdmin && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto">Admin</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {allItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary glow-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full relative">
                <Bell className="w-4 h-4" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-bold min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-80 p-0 bg-card border-border">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 text-center">No notifications</p>
                ) : (
                  notifications.slice(0, 20).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`w-full text-left px-4 py-3 border-b border-border/30 hover:bg-secondary/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                    >
                      <p className={`text-sm ${!n.read ? "text-foreground font-medium" : "text-muted-foreground"}`}>{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                    </button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Link
            to="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-14 flex items-center px-4 border-b border-border/50 glass-strong lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="ml-3 font-semibold text-foreground">HackTrack</span>
          {unreadCount > 0 && (
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-bold">
              {unreadCount}
            </span>
          )}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
