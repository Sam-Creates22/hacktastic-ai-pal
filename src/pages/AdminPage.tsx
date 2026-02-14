import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Shield, UserCheck, UserX, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockRequests = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", reason: "CS student, hackathon enthusiast", status: "pending" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", reason: "Looking to track my hackathon journey", status: "pending" },
];

const AdminPage = () => (
  <DashboardLayout isAdmin>
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage access requests and users</p>
      </motion.div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-warning" />
          Pending Requests
        </h2>
        <div className="space-y-3">
          {mockRequests.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{r.name}</p>
                <p className="text-sm text-muted-foreground">{r.email}</p>
                <p className="text-sm text-muted-foreground mt-1 italic">"{r.reason}"</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" className="bg-success/10 text-success hover:bg-success/20 border-0">
                  <UserCheck className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10">
                  <UserX className="w-4 h-4 mr-1" /> Reject
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminPage;
