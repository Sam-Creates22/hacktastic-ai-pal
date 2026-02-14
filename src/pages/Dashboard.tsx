import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Upload, CheckSquare, Calendar, Brain, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  { to: "/dashboard/upload", icon: Upload, title: "Upload Brochure", desc: "Extract hackathon details with AI", color: "primary" },
  { to: "/dashboard/tasks", icon: CheckSquare, title: "Tasks", desc: "Manage your preparation tasks", color: "primary" },
  { to: "/dashboard/chat", icon: Brain, title: "AI Assistant", desc: "Get help with planning & ideas", color: "accent" },
  { to: "/dashboard/calendar", icon: Calendar, title: "Calendar", desc: "Check schedule availability", color: "primary" },
];

const stats = [
  { label: "Upcoming Events", value: "3", icon: Zap },
  { label: "Tasks Pending", value: "12", icon: CheckSquare },
  { label: "Streak", value: "7 days", icon: TrendingUp },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-1">Welcome back 👋</h1>
          <p className="text-muted-foreground">Here's your hackathon overview</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Link
                  to={c.to}
                  className="glass rounded-xl p-5 block hover:border-primary/30 transition-all duration-300 group h-full"
                >
                  <div className={`w-10 h-10 rounded-lg ${c.color === "accent" ? "bg-accent/10" : "bg-primary/10"} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <c.icon className={`w-5 h-5 ${c.color === "accent" ? "text-accent" : "text-primary"}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Events placeholder */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Events</h2>
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-muted-foreground">No events yet. Upload a hackathon brochure to get started!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
