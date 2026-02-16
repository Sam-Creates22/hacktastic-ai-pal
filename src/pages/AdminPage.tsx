import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Shield, UserCheck, UserX, Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AccessRequest {
  id: string;
  name: string;
  email: string;
  reason: string | null;
  status: string;
  created_at: string;
}

const AdminPage = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("access_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from("access_requests")
        .update({ status: action })
        .eq("id", id);
      if (error) throw error;

      if (action === "approved") {
        const request = requests.find(r => r.id === id);
        if (request) {
          const { data: fnData, error: fnError } = await supabase.functions.invoke("approve-user", {
            body: { email: request.email, name: request.name },
          });
          if (fnError) throw fnError;
          toast({
            title: "User Approved ✓",
            description: `Account created. Temp password: ${fnData?.tempPassword ?? "check logs"}`,
          });
        }
      } else {
        toast({
          title: "Request Rejected",
          description: "The access request has been rejected.",
        });
      }

      fetchRequests();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const pending = requests.filter(r => r.status === "pending");
  const approved = requests.filter(r => r.status === "approved");
  const rejected = requests.filter(r => r.status === "rejected");

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage access requests and users</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Pending", value: pending.length, icon: Clock, color: "text-warning" },
            { label: "Approved", value: approved.length, icon: CheckCircle, color: "text-success" },
            { label: "Rejected", value: rejected.length, icon: XCircle, color: "text-destructive" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Pending Requests */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Pending Requests ({pending.length})
          </h2>
          {loading ? (
            <div className="glass rounded-xl p-8 text-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Loading requests...</p>
            </div>
          ) : pending.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((r, i) => (
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
                    {r.reason && <p className="text-sm text-muted-foreground mt-1 italic">"{r.reason}"</p>}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleAction(r.id, "approved")}
                      disabled={actionLoading === r.id}
                      className="bg-success/10 text-success hover:bg-success/20 border-0"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      {actionLoading === r.id ? "..." : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(r.id, "rejected")}
                      disabled={actionLoading === r.id}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <UserX className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* All Users */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            All Requests
          </h2>
          <div className="space-y-2">
            {requests.filter(r => r.status !== "pending").map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4 flex items-center gap-3"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${r.status === "approved" ? "bg-success" : "bg-destructive"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "approved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {r.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;
