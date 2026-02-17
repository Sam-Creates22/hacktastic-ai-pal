import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, LogIn } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const CalendarPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const hasGoogleProvider = user?.app_metadata?.providers?.includes("google");

  const connectGoogle = async () => {
    setConnecting(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
        extraParams: {
          prompt: "consent",
          access_type: "offline",
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setConnecting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-1">Calendar</h1>
          <p className="text-muted-foreground">Check your schedule availability</p>
        </motion.div>

        {hasGoogleProvider ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-foreground font-semibold mb-2">Google Account Connected</h3>
            <p className="text-sm text-muted-foreground mb-4">Your Google account is linked. Calendar sync is available for approved events.</p>
            <p className="text-xs text-muted-foreground">When events are approved, they will be synced with your calendar automatically.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-foreground font-semibold mb-2">Google Calendar Integration</h3>
            <p className="text-sm text-muted-foreground mb-6">Connect your Google account to sync hackathon events with your calendar and check availability.</p>
            <Button onClick={connectGoogle} disabled={connecting} className="gradient-primary text-primary-foreground font-semibold glow-primary">
              <LogIn className="w-4 h-4 mr-2" />
              {connecting ? "Connecting..." : "Connect Google Calendar"}
            </Button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
