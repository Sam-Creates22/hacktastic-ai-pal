import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, CheckCircle, Clock, Trash2, Eye, EyeOff, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  created_by: string;
  visibility: string;
  approved: boolean;
  created_at: string;
}

const EventsPage = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [visibility, setVisibility] = useState("shared");
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (!error) setEvents((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !eventDate) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("events").insert({
        title: title.trim(),
        description: description.trim() || null,
        event_date: eventDate,
        created_by: user.id,
        visibility,
      } as any);
      if (error) throw error;

      // Self-notify
      await supabase.from("notifications").insert({
        user_id: user.id,
        message: `Your event "${title.trim()}" has been submitted for approval.`,
      } as any);

      toast({ title: "Event submitted!", description: isAdmin ? "Event auto-visible to you." : "Awaiting admin approval." });
      setTitle(""); setDescription(""); setEventDate(""); setVisibility("shared"); setShowForm(false);
      fetchEvents();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    await supabase.from("events").update({ approved: true } as any).eq("id", id);
    const ev = events.find(e => e.id === id);
    if (ev) {
      await supabase.from("notifications").insert({
        user_id: ev.created_by,
        message: `Your event "${ev.title}" has been approved! 🎉`,
      } as any);
    }
    toast({ title: "Event approved ✓" });
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast({ title: "Event deleted" });
    fetchEvents();
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Events</h1>
            <p className="text-muted-foreground">Hackathon events and deadlines</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground">
            {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
            {showForm ? "Cancel" : "New Event"}
          </Button>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm">Event Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Hackathon name" className="mt-1.5 bg-secondary/50 border-border/50 focus:border-primary" required />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Event details..." className="mt-1.5 bg-secondary/50 border-border/50 focus:border-primary min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Event Date</Label>
                  <Input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mt-1.5 bg-secondary/50 border-border/50 focus:border-primary" required />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Visibility</Label>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger className="mt-1.5 bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shared">Shared (visible to all)</SelectItem>
                      <SelectItem value="private">Private (only me)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground font-semibold h-11">
                {submitting ? "Submitting..." : "Submit Event"}
              </Button>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="glass rounded-xl p-8 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No events yet. Create one above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{ev.title}</h3>
                      {ev.approved ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">Approved</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]">Pending</span>
                      )}
                      {ev.visibility === "private" ? (
                        <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                    {ev.description && <p className="text-sm text-muted-foreground mb-2">{ev.description}</p>}
                    <p className="text-xs text-muted-foreground">
                      📅 {new Date(ev.event_date).toLocaleDateString()} at {new Date(ev.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 shrink-0">
                      {!ev.approved && (
                        <Button size="sm" onClick={() => handleApprove(ev.id)} className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/20 border-0">
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(ev.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EventsPage;
