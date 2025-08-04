import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Target, TrendingUp, Calendar, Star, Gift } from "lucide-react";

interface TodoItem {
  _id: string;
  text: string;
  category: "task" | "goal" | "reminder";
  status?: "todo" | "in-progress" | "completed" | "on-hold";
  priority?: "high" | "medium" | "low";
  dueDate?: string;
  createdAt: string;
  comments?: { text: string; createdAt: string }[];
  recurrence?: {
    frequency: string;
    isRecurring: boolean;
  };
}

export default function Statistics() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalGoals: 0,
    totalReminders: 0,
    completedTasks: 0,
    completedGoals: 0,
    activeTasks: 0,
    activeGoals: 0,
    completionRate: 0,
    weeklyGoal: 20,
    tasksThisWeek: 0,
    streak: 0,
    highPriorityTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/items?userId=user1");
      const items: TodoItem[] = await res.json();
      
      // Calculate statistics from real data
      const tasks = items.filter(item => item.category === "task");
      const goals = items.filter(item => item.category === "goal");
      const reminders = items.filter(item => item.category === "reminder");
      
      const completedTasks = tasks.filter(task => task.status === "completed").length;
      const completedGoals = goals.filter(goal => goal.status === "completed").length;
      const activeTasks = tasks.filter(task => task.status !== "completed").length;
      const activeGoals = goals.filter(goal => goal.status !== "completed").length;
      
      const totalTasks = tasks.length;
      const totalGoals = goals.length;
      const totalReminders = reminders.length;
      
      const totalCompletable = totalTasks + totalGoals;
      const totalCompleted = completedTasks + completedGoals;
      const completionRate = totalCompletable > 0 ? Math.round((totalCompleted / totalCompletable) * 100) : 0;
      
      // Calculate tasks completed this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const tasksThisWeek = tasks.filter(task => 
        task.status === "completed" && 
        new Date(task.createdAt) >= oneWeekAgo
      ).length;
      
      // Calculate high priority tasks
      const highPriorityTasks = tasks.filter(task => task.priority === "high").length;
      
      // Calculate overdue tasks
      const today = new Date();
      const overdueTasks = tasks.filter(task => 
        task.dueDate && 
        new Date(task.dueDate) < today && 
        task.status !== "completed"
      ).length;
      
      // Calculate streak (simplified - days with completed tasks)
      const completedDates = new Set(
        tasks
          .filter(task => task.status === "completed")
          .map(task => new Date(task.createdAt).toDateString())
      );
      const streak = Math.min(completedDates.size, 7); // Cap at 7 days for demo
      
      setStats({
        totalTasks,
        totalGoals,
        totalReminders,
        completedTasks,
        completedGoals,
        activeTasks,
        activeGoals,
        completionRate,
        weeklyGoal: 20,
        tasksThisWeek,
        streak,
        highPriorityTasks,
        overdueTasks,
      });
    } catch (err) {
      setError("Failed to load statistics");
      console.error("Error fetching statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const weeklyProgress = Math.min((stats.tasksThisWeek / stats.weeklyGoal) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
        <Navigation />
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-12">
            <p>Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
        <Navigation />
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
            <button onClick={fetchStatistics} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Your Statistics</h1>
          <p className="text-muted-foreground">Track your productivity and progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tasks */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalTasks}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Total Goals */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Goals</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalGoals}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Total Reminders */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reminders</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalReminders}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Completed Tasks */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">{stats.completedTasks + stats.completedGoals}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Active Tasks */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-orange-500">{stats.activeTasks + stats.activeGoals}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </Card>

          {/* High Priority Tasks */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-destructive">{stats.highPriorityTasks}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </Card>

          {/* Overdue Tasks */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">{stats.overdueTasks}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Rate */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Completion Rate</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <Badge variant="secondary">{stats.completionRate}%</Badge>
              </div>
              <Progress value={stats.completionRate} className="h-3" />
              <p className="text-sm text-muted-foreground">
                You've completed {stats.completedTasks + stats.completedGoals} out of {stats.totalTasks + stats.totalGoals} tasks and goals
              </p>
            </div>
          </Card>

          {/* Weekly Goal */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Weekly Goal</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasks This Week</span>
                <Badge variant="secondary">{stats.tasksThisWeek}/{stats.weeklyGoal}</Badge>
              </div>
              <Progress value={weeklyProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {stats.weeklyGoal - stats.tasksThisWeek > 0
                  ? `${stats.weeklyGoal - stats.tasksThisWeek} more tasks to reach your goal`
                  : "🎉 Weekly goal achieved!"
                }
              </p>
            </div>
          </Card>

          {/* Streak */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold">Current Streak</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-500 mb-2">{stats.streak}</div>
              <p className="text-sm text-muted-foreground">
                {stats.streak === 1 ? 'day' : 'days'} of productivity
              </p>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '1.0s' }}>
            <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {(stats.completedTasks + stats.completedGoals) >= 5 && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-success">Task Master</p>
                    <p className="text-sm text-muted-foreground">Completed 5+ tasks</p>
                  </div>
                </div>
              )}
              {stats.streak >= 3 && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10">
                  <Star className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-amber-500">Streak Champion</p>
                    <p className="text-sm text-muted-foreground">3+ day streak</p>
                  </div>
                </div>
              )}
              {stats.completionRate >= 80 && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-primary">High Achiever</p>
                    <p className="text-sm text-muted-foreground">80%+ completion rate</p>
                  </div>
                </div>
              )}
              {stats.highPriorityTasks > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10">
                  <Target className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Priority Focus</p>
                    <p className="text-sm text-muted-foreground">Managing high priority tasks</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}