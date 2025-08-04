import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Clock,
  AlertTriangle,
  FileText,
  User,
  Settings,
  Shield,
  Calendar,
  Mail,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'required' | 'recommended' | 'optional';
  deadline?: string;
  completed: boolean;
  required: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function Checklist() {
  const navigate = useNavigate();
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: 'employee-id',
      title: 'Complete Employee ID Setup',
      description: 'Set up your employee ID and access credentials',
      category: 'required',
      deadline: '2024-01-15',
      completed: true,
      required: true,
      priority: 'high'
    },
    {
      id: 'it-setup',
      title: 'IT Equipment Setup',
      description: 'Receive and configure your laptop, monitor, and other equipment',
      category: 'required',
      deadline: '2024-01-16',
      completed: true,
      required: true,
      priority: 'high'
    },
    {
      id: 'email-setup',
      title: 'Email and Communication Setup',
      description: 'Configure your email, Slack, and other communication tools',
      category: 'required',
      deadline: '2024-01-17',
      completed: false,
      required: true,
      priority: 'high'
    },
    {
      id: 'benefits-enrollment',
      title: 'Benefits Enrollment',
      description: 'Complete your health insurance and 401(k) enrollment',
      category: 'required',
      deadline: '2024-01-31',
      completed: false,
      required: true,
      priority: 'high'
    },
    {
      id: 'handbook-acknowledgment',
      title: 'Employee Handbook Acknowledgment',
      description: 'Read and acknowledge the employee handbook',
      category: 'required',
      deadline: '2024-01-20',
      completed: false,
      required: true,
      priority: 'medium'
    },
    {
      id: 'direct-deposit',
      title: 'Set Up Direct Deposit',
      description: 'Configure your bank account for direct deposit',
      category: 'required',
      deadline: '2024-01-25',
      completed: false,
      required: true,
      priority: 'medium'
    },
    {
      id: 'emergency-contacts',
      title: 'Emergency Contact Information',
      description: 'Provide emergency contact details in HR system',
      category: 'required',
      deadline: '2024-01-18',
      completed: false,
      required: true,
      priority: 'medium'
    },
    {
      id: 'tax-forms',
      title: 'Complete Tax Forms',
      description: 'Fill out W-4 and other required tax documentation',
      category: 'required',
      deadline: '2024-01-19',
      completed: false,
      required: true,
      priority: 'medium'
    },
    {
      id: 'team-introductions',
      title: 'Team Introductions',
      description: 'Schedule 1:1 meetings with key team members',
      category: 'recommended',
      deadline: '2024-01-30',
      completed: false,
      required: false,
      priority: 'medium'
    },
    {
      id: 'training-schedule',
      title: 'Schedule Training Sessions',
      description: 'Book your role-specific training sessions',
      category: 'recommended',
      deadline: '2024-02-15',
      completed: false,
      required: false,
      priority: 'low'
    },
    {
      id: 'mentor-assignment',
      title: 'Meet Your Mentor',
      description: 'Connect with your assigned mentor for guidance',
      category: 'recommended',
      deadline: '2024-01-25',
      completed: false,
      required: false,
      priority: 'medium'
    },
    {
      id: 'office-tour',
      title: 'Office Tour and Setup',
      description: 'Tour the office and set up your workspace',
      category: 'optional',
      deadline: '2024-01-22',
      completed: false,
      required: false,
      priority: 'low'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const completedItems = checklistItems.filter(item => item.completed).length;
  const requiredItems = checklistItems.filter(item => item.required).length;
  const completedRequired = checklistItems.filter(item => item.required && item.completed).length;
  const progress = (completedItems / checklistItems.length) * 100;

  const categories = [
    { id: 'all', name: 'All Items', count: checklistItems.length },
    { id: 'required', name: 'Required', count: checklistItems.filter(item => item.required).length },
    { id: 'recommended', name: 'Recommended', count: checklistItems.filter(item => !item.required && item.category === 'recommended').length },
    { id: 'optional', name: 'Optional', count: checklistItems.filter(item => item.category === 'optional').length }
  ];

  const handleToggleItem = (itemId: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleComplete = () => {
    navigate('/onboarding');
  };

  const filteredItems = checklistItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const completionMatch = showCompleted || !item.completed;
    return categoryMatch && completionMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Onboarding Checklist
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete required tasks and acknowledgments to finish your onboarding
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progress</h2>
            <Badge variant="secondary">
              {completedItems} of {checklistItems.length} tasks completed
            </Badge>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedRequired} of {requiredItems} required tasks completed</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Filter by Category</h3>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(checked as boolean)}
              />
              <span className="text-sm">Show completed items</span>
            </div>
          </div>
        </Card>

        {/* Checklist Items */}
        <div className="space-y-4 mb-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className={`font-semibold ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {item.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(item.priority)}`}
                        >
                          {getPriorityIcon(item.priority)} {item.priority}
                        </Badge>
                      </div>
                    </div>
                    {item.deadline && (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4" />
                        <span className={isOverdue(item.deadline) ? 'text-red-600 font-semibold' : 'text-muted-foreground'}>
                          {isOverdue(item.deadline) ? 'Overdue' : new Date(item.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className={`text-sm mb-3 ${item.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    {item.completed && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="p-6 mb-8 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{completedItems}</div>
              <div className="text-sm text-blue-600">Total Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">{completedRequired}</div>
              <div className="text-sm text-green-600">Required Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50">
              <div className="text-2xl font-bold text-orange-600">{requiredItems - completedRequired}</div>
              <div className="text-sm text-orange-600">Required Remaining</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
              <div className="text-sm text-purple-600">Overall Progress</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <Button
            onClick={handleComplete}
            disabled={completedRequired < requiredItems}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Onboarding
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 