import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Zap, User, Mail, MessageSquare, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RequestAccess = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("access_requests").insert({
        name: name.trim(),
        email: email.trim(),
        reason: reason.trim(),
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md glass rounded-2xl p-10 glow-primary">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Request Submitted!</h2>
          <p className="text-muted-foreground mb-6">We'll review your request and get back to you soon. You'll receive an email once approved.</p>
          <Link to="/">
            <Button variant="outline" className="border-border/50">Back to Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">HackTrack</span>
        </Link>

        <div className="glass rounded-2xl p-8 glow-accent">
          <h1 className="text-2xl font-bold text-foreground mb-1 text-center">Request Access</h1>
          <p className="text-muted-foreground text-sm text-center mb-6">Tell us why you'd like to join HackTrack</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Full Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="pl-10 bg-secondary/50 border-border/50 focus:border-primary" required />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 bg-secondary/50 border-border/50 focus:border-primary" required />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Why do you want to join?</Label>
              <div className="relative mt-1.5">
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Tell us about your hackathon experience..." className="bg-secondary/50 border-border/50 focus:border-primary min-h-[100px]" required />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-mixed text-foreground font-semibold h-11 glow-accent">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have access?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestAccess;
