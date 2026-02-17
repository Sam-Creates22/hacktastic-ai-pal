import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Phone, CalendarDays, Hash, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const CompleteProfilePage = () => {
  const { user, profileCompleted, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // If already completed, redirect
  if (profileCompleted) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!mobile.trim() || !dob || !rollNumber.trim()) {
      toast({ title: "All fields required", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          mobile: mobile.trim(),
          date_of_birth: dob,
          university_roll_number: rollNumber.trim(),
          profile_completed: true,
        } as any)
        .eq("user_id", user.id);

      if (error) throw error;

      await refreshProfile();
      toast({ title: "Profile completed! ✓", description: "Welcome to HackTrack." });
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full bg-accent/5 blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">HackTrack</span>
        </div>

        <div className="glass rounded-2xl p-8 glow-primary">
          <h1 className="text-2xl font-bold text-foreground mb-1 text-center">Complete Your Profile</h1>
          <p className="text-muted-foreground text-sm text-center mb-6">We need a few more details before you can continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Mobile Number</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 9876543210"
                  className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Date of Birth</Label>
              <div className="relative mt-1.5">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">University Roll Number</Label>
              <div className="relative mt-1.5">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 2024CSE001"
                  className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground font-semibold h-11 glow-primary">
              {loading ? "Saving..." : "Complete Profile"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteProfilePage;
