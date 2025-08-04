import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Users, 
  Heart, 
  Award,
  ArrowRight,
  Play,
  Star,
  Target,
  Calendar,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface OnboardingModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  estimatedTime: string;
  route: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [modules, setModules] = useState<OnboardingModule[]>([
    {
      id: 'welcome',
      title: 'Welcome & Introduction',
      description: 'Get started with your onboarding journey',
      icon: Star,
      status: 'completed',
      progress: 100,
      estimatedTime: '5 min',
      route: '/onboarding/welcome'
    },
    {
      id: 'policies',
      title: 'Company Policies',
      description: 'Handbook, code of conduct, and company guidelines',
      icon: BookOpen,
      status: 'in-progress',
      progress: 60,
      estimatedTime: '15 min',
      route: '/onboarding/policies'
    },
    {
      id: 'values',
      title: 'Company Values',
      description: 'Learn about our mission, vision, and core values',
      icon: Heart,
      status: 'not-started',
      progress: 0,
      estimatedTime: '10 min',
      route: '/onboarding/values'
    },
    {
      id: 'team',
      title: 'Meet Your Team',
      description: 'Get to know your colleagues and team structure',
      icon: Users,
      status: 'not-started',
      progress: 0,
      estimatedTime: '8 min',
      route: '/onboarding/team'
    },
    {
      id: 'benefits',
      title: 'Benefits & Perks',
      description: 'Explore your benefits package and company perks',
      icon: Award,
      status: 'not-started',
      progress: 0,
      estimatedTime: '12 min',
      route: '/onboarding/benefits'
    },
    {
      id: 'checklist',
      title: 'Onboarding Checklist',
      description: 'Complete required tasks and acknowledgments',
      icon: CheckCircle2,
      status: 'not-started',
      progress: 0,
      estimatedTime: '5 min',
      route: '/onboarding/checklist'
    }
  ]);

  const overallProgress = modules.reduce((acc, module) => acc + module.progress, 0) / modules.length;
  const completedModules = modules.filter(m => m.status === 'completed').length;
  const totalModules = modules.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      default: return 'Not Started';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to Your Onboarding Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Complete your onboarding to get fully integrated with our team and company culture.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Overall Progress</h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {Math.round(overallProgress)}% Complete
            </Badge>
          </div>
          <Progress value={overallProgress} className="h-3 mb-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedModules} of {totalModules} modules completed</span>
            <span>Estimated time remaining: 45 min</span>
          </div>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(module.route)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <module.icon className="w-6 h-6 text-primary" />
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(module.status)}`} />
              </div>
              
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {module.description}
              </p>
              
              <div className="space-y-3">
                <Progress value={module.progress} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className={getStatusColor(module.status).replace('bg-', 'text-')}>
                    {getStatusText(module.status)}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.estimatedTime}
                  </span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                {module.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {module.status === 'completed' ? 'Review' : 'Start'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6" />
              <span>Download Handbook</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Calendar className="w-6 h-6" />
              <span>Schedule 1:1</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Target className="w-6 h-6" />
              <span>Set Goals</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 