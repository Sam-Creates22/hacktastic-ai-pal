import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Brain, Calendar, CheckCircle, Shield, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const features = [
  { icon: Upload, title: "Smart Upload", desc: "Upload hackathon brochures and let AI extract all the details", route: "/dashboard/upload" },
  { icon: Brain, title: "AI Assistant", desc: "Get personalized prep plans, ideas, and coaching", route: "/dashboard/chat" },
  { icon: Calendar, title: "Calendar Sync", desc: "Check availability and never miss a deadline", route: "/dashboard/calendar" },
  { icon: CheckCircle, title: "Task Manager", desc: "Track preparation tasks with priorities and deadlines", route: "/dashboard/tasks" },
  { icon: Shield, title: "Private & Secure", desc: "Invite-only community with role-based access", route: "/dashboard" },
  { icon: Zap, title: "Smart Reminders", desc: "Configurable notifications so you're always prepared", route: "/dashboard/reminders" },
];

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFeatureClick = (route: string) => {
    if (user) {
      navigate(route);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[120px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">HackTrack</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link to="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link to="/request-access">
            <Button className="gradient-primary text-primary-foreground font-semibold glow-primary">
              Request Access
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI-Powered Hackathon Management
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            <span className="text-foreground">Your AI</span>
            <br />
            <span className="text-primary text-glow">Hackathon Copilot</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload brochures, extract details with AI, sync your calendar, manage tasks, 
            and get intelligent preparation coaching — all in one futuristic interface.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/request-access">
              <Button size="lg" className="gradient-primary text-primary-foreground font-semibold px-8 h-12 text-base glow-primary-strong">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-border/50 text-foreground hover:bg-secondary h-12 px-8 text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              onClick={() => handleFeatureClick(f.route)}
              className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 HackTrack. Private community — invite only.</p>
      </footer>
    </div>
  );
};

export default Landing;
