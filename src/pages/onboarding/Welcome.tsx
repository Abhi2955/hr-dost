import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Users,
  Target,
  Heart,
  Award,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface WelcomeStep {
  id: number;
  title: string;
  content: string;
  completed: boolean;
}

export default function Welcome() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<WelcomeStep[]>([
    {
      id: 1,
      title: "Welcome to Our Team!",
      content: "We're excited to have you join us. This onboarding journey will help you get familiar with our company culture, policies, and your new role. Let's make this transition smooth and enjoyable!",
      completed: true
    },
    {
      id: 2,
      title: "What to Expect",
      content: "Over the next few modules, you'll learn about our company values, meet your team members, understand our policies, and explore your benefits. Each module is designed to be interactive and engaging.",
      completed: false
    },
    {
      id: 3,
      title: "Your Success Matters",
      content: "We believe that a well-onboarded employee is a successful employee. Take your time with each module, ask questions, and don't hesitate to reach out to your manager or HR team.",
      completed: false
    },
    {
      id: 4,
      title: "Ready to Begin?",
      content: "You're all set to start your onboarding journey! Click 'Complete Welcome' to move on to the next module and continue your progress.",
      completed: false
    }
  ]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSteps(steps.map((step, index) => 
        index === currentStep ? { ...step, completed: true } : step
      ));
    } else {
      // Complete the welcome module
      navigate('/onboarding');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome & Introduction
          </h1>
          <p className="text-xl text-muted-foreground">
            Let's get you started on your onboarding journey
          </p>
        </div>

        {/* Progress */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progress</h2>
            <Badge variant="secondary">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Content Card */}
        <Card className="p-8 mb-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{currentStepData.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {currentStepData.content}
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Welcome
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Quick Preview */}
        <Card className="p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">What's Coming Next</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Company Policies</h4>
              <p className="text-sm text-muted-foreground">Handbook & guidelines</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Company Values</h4>
              <p className="text-sm text-muted-foreground">Mission & culture</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Meet Your Team</h4>
              <p className="text-sm text-muted-foreground">Colleagues & structure</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <Award className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Benefits</h4>
              <p className="text-sm text-muted-foreground">Perks & packages</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 