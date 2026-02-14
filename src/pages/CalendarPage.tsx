import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar } from "lucide-react";

const CalendarPage = () => (
  <DashboardLayout>
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Calendar</h1>
        <p className="text-muted-foreground">Check your schedule availability</p>
      </motion.div>
      <div className="glass rounded-xl p-12 text-center">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-foreground font-semibold mb-2">Google Calendar Integration</h3>
        <p className="text-sm text-muted-foreground">Connect your Google Calendar to check availability for hackathon events.</p>
      </div>
    </div>
  </DashboardLayout>
);

export default CalendarPage;
