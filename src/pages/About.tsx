import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Zap, 
  Palette, 
  Shield, 
  Github, 
  Heart,
  Sparkles,
  Target,
  Gift,
  MessageSquare,
  Filter,
  BarChart3,
  Database
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Target,
      title: "Task Management",
      description: "Create, edit, and organize tasks with status tracking and priority levels",
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set and track personal and professional goals with progress monitoring",
    },
    {
      icon: Gift,
      title: "Smart Reminders",
      description: "Set recurring reminders with customizable frequency options",
    },
    {
      icon: MessageSquare,
      title: "Comments & Notes",
      description: "Add detailed comments and notes to tasks and goals for better context",
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description: "Filter by status, priority, and sort by various criteria",
    },
    {
      icon: BarChart3,
      title: "Statistics Dashboard",
      description: "Track your productivity with detailed analytics and achievements",
    },
    {
      icon: Database,
      title: "Cloud Storage",
      description: "Your data is safely stored in MongoDB with real-time synchronization",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Instant updates across all your devices with live data sync",
    },
  ];

  const techStack = [
    "React", "TypeScript", "Tailwind CSS", "Lucide Icons", 
    "React Router", "Vite", "Radix UI", "MongoDB", "Express.js", "Node.js"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Gotta Do It Now
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            A comprehensive productivity app that helps you manage tasks, achieve goals, and stay organized with powerful features and beautiful design.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">v2.0.0</Badge>
            <Badge variant="outline">Full Stack</Badge>
            <Badge variant="outline">Cloud Powered</Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="p-6 text-center shadow-[var(--shadow-card)] animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <Card className="p-8 mb-12 shadow-[var(--shadow-card)] animate-slide-up">
          <h2 className="text-2xl font-bold text-center mb-6">Built With</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm py-2 px-4">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>

        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 shadow-[var(--shadow-card)] animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Why Gotta Do It Now?</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Gotta Do It Now is a modern productivity app designed for people who want to get things done efficiently. 
                Unlike simple todo apps, we provide a comprehensive solution for managing tasks, goals, and reminders.
              </p>
              <p>
                With our three-tier system (Tasks, Goals, Reminders), you can organize your life at different levels. 
                Tasks for daily activities, goals for long-term achievements, and reminders for important events.
              </p>
              <p>
                Your data is securely stored in the cloud using MongoDB, ensuring your information is always available 
                and synchronized across all your devices.
              </p>
            </div>
          </Card>

          <Card className="p-8 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold">Made with Love</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                This app was crafted with attention to detail and a passion for great user experience. 
                Every feature was designed to enhance your productivity without adding complexity.
              </p>
              <p>
                From the beautiful UI animations to the powerful backend API, every component was carefully 
                considered to provide you with the best possible experience.
              </p>
              <div className="pt-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  View on GitHub
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <Card className="p-8 text-center shadow-[var(--shadow-card)] animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">App Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <div className="text-muted-foreground">Item Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">∞</div>
              <div className="text-muted-foreground">Items You Can Create</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">Real-time</div>
              <div className="text-muted-foreground">Data Sync</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500 mb-2">Cloud</div>
              <div className="text-muted-foreground">Storage</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}