import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const AIChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hey! 👋 I'm your HackTrack AI assistant. I can help you with hackathon preparation, brainstorm ideas, create study plans, and more. What would you like to work on?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulated response for now
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm working on analyzing your request. AI processing will be connected soon — for now this is a preview of the chat interface! 🚀",
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">AI Assistant</h1>
          <p className="text-muted-foreground">Your intelligent hackathon copilot</p>
        </motion.div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${m.role === "assistant" ? "gradient-primary" : "bg-secondary"}`}>
                {m.role === "assistant" ? <Brain className="w-4 h-4 text-primary-foreground" /> : <User className="w-4 h-4 text-foreground" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "assistant" ? "glass text-foreground" : "gradient-primary text-primary-foreground"}`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="glass rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask me anything about hackathons..."
            className="bg-secondary/50 border-border/50 focus:border-primary"
          />
          <Button onClick={send} disabled={loading || !input.trim()} className="gradient-primary text-primary-foreground shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIChatPage;
