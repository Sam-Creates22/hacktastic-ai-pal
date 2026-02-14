import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Bell } from "lucide-react";

const RemindersPage = () => (
  <DashboardLayout>
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Reminders</h1>
        <p className="text-muted-foreground">Configure smart notifications for your events</p>
      </motion.div>
      <div className="glass rounded-xl p-12 text-center">
        <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-foreground font-semibold mb-2">Smart Reminders</h3>
        <p className="text-sm text-muted-foreground">Set up browser notifications and reminders for upcoming hackathons.</p>
      </div>
    </div>
  </DashboardLayout>
);

export default RemindersPage;
