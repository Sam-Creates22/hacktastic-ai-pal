import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, Plus, Circle, CheckCircle2, Trash2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  done: boolean;
}

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Review hackathon rules", priority: "high", done: false },
    { id: "2", title: "Set up development environment", priority: "medium", done: false },
    { id: "3", title: "Brainstorm project ideas", priority: "medium", done: true },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), title: newTask.trim(), priority: "medium", done: false }]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-1">Tasks</h1>
          <p className="text-muted-foreground">Manage your hackathon preparation tasks</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task..."
            className="bg-secondary/50 border-border/50 focus:border-primary"
          />
          <Button onClick={addTask} className="gradient-primary text-primary-foreground shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </motion.div>

        <div className="space-y-2">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="glass rounded-xl p-4 flex items-center gap-3 group"
            >
              <button onClick={() => toggleTask(task.id)} className="shrink-0">
                {task.done ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>
              <span className={`flex-1 text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.title}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </motion.div>
          ))}
          {tasks.length === 0 && (
            <div className="glass rounded-xl p-8 text-center">
              <CheckSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No tasks yet. Add one above!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TasksPage;
