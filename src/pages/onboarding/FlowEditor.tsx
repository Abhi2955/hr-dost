import Navigation from "@/components/Navigation";
import OnboardingFlowEditor from "@/components/OnboardingFlowEditor";

export default function FlowEditorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <OnboardingFlowEditor />
    </div>
  );
} 