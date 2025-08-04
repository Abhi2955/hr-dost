import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  title: string;
  subtitle: string;
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  showNavigation?: boolean;
}

export default function OnboardingProgress({
  currentStep,
  totalSteps,
  progress,
  title,
  subtitle,
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Next",
  showNavigation = true
}: OnboardingProgressProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/onboarding');
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {/* Progress Card */}
      <Card className="p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Progress</h2>
          <Badge variant="secondary">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>
        <Progress value={progress} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{Math.round(progress)}% complete</span>
          <span>Estimated time remaining: {Math.ceil((100 - progress) / 10)} min</span>
        </div>
      </Card>

      {/* Navigation */}
      {showNavigation && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Button>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {nextLabel}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 