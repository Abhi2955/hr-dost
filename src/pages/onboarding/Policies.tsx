import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Shield,
  FileText,
  Users,
  Clock,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface Policy {
  id: string;
  title: string;
  description: string;
  content: string;
  acknowledged: boolean;
  required: boolean;
}

export default function Policies() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 'handbook',
      title: 'Employee Handbook',
      description: 'Complete guide to company policies and procedures',
      content: 'Our employee handbook covers all aspects of working at our company, including workplace conduct, dress code, attendance policies, and more. Please review this document carefully as it outlines your rights and responsibilities as an employee.',
      acknowledged: false,
      required: true
    },
    {
      id: 'code-of-conduct',
      title: 'Code of Conduct',
      description: 'Standards of behavior and ethical guidelines',
      content: 'Our code of conduct establishes the standards of behavior expected from all employees. This includes professional conduct, conflict of interest policies, confidentiality requirements, and anti-harassment guidelines.',
      acknowledged: false,
      required: true
    },
    {
      id: 'data-security',
      title: 'Data Security Policy',
      description: 'Information security and data protection guidelines',
      content: 'This policy outlines how to handle sensitive information, password requirements, device security, and data protection measures. All employees must follow these guidelines to protect company and customer data.',
      acknowledged: false,
      required: true
    },
    {
      id: 'remote-work',
      title: 'Remote Work Policy',
      description: 'Guidelines for working from home or remote locations',
      content: 'Our remote work policy covers expectations for remote employees, communication protocols, equipment requirements, and productivity standards. This policy ensures consistency and effectiveness for all remote team members.',
      acknowledged: false,
      required: false
    },
    {
      id: 'expense',
      title: 'Expense Policy',
      description: 'Guidelines for business expenses and reimbursements',
      content: 'This policy outlines what expenses are reimbursable, submission procedures, approval processes, and spending limits. Please review this carefully to understand how to properly submit and track business expenses.',
      acknowledged: false,
      required: false
    }
  ]);

  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const completedPolicies = policies.filter(p => p.acknowledged).length;
  const requiredPolicies = policies.filter(p => p.required).length;
  const completedRequired = policies.filter(p => p.required && p.acknowledged).length;
  const progress = (completedPolicies / policies.length) * 100;

  const handleAcknowledge = (policyId: string) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId 
        ? { ...policy, acknowledged: !policy.acknowledged }
        : policy
    ));
  };

  const handleComplete = () => {
    navigate('/onboarding');
  };

  const selectedPolicyData = policies.find(p => p.id === selectedPolicy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Company Policies
          </h1>
          <p className="text-xl text-muted-foreground">
            Review and acknowledge important company policies and guidelines
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progress</h2>
            <Badge variant="secondary">
              {completedPolicies} of {policies.length} policies reviewed
            </Badge>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedRequired} of {requiredPolicies} required policies completed</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Policy List */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Available Policies</h3>
              <div className="space-y-3">
                {policies.map((policy) => (
                  <div
                    key={policy.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPolicy === policy.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPolicy(policy.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{policy.title}</h4>
                          {policy.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {policy.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={policy.acknowledged}
                            onCheckedChange={() => handleAcknowledge(policy.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-sm">
                            {policy.acknowledged ? 'Acknowledged' : 'Not acknowledged'}
                          </span>
                        </div>
                      </div>
                      {policy.acknowledged && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Policy Content */}
          <div className="lg:col-span-2">
            {selectedPolicyData ? (
              <Card className="p-8 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedPolicyData.title}</h2>
                    <p className="text-muted-foreground">{selectedPolicyData.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedPolicyData.content}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Checkbox
                      checked={selectedPolicyData.acknowledged}
                      onCheckedChange={() => handleAcknowledge(selectedPolicyData.id)}
                    />
                    <span className="font-medium">
                      I have read and understood this policy
                    </span>
                  </div>
                  
                  {selectedPolicyData.required && (
                    <p className="text-sm text-muted-foreground">
                      This is a required policy. You must acknowledge it to continue.
                    </p>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-8 shadow-lg">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Select a Policy</h3>
                  <p>Choose a policy from the list to review its content</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
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
            disabled={completedRequired < requiredPolicies}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Policies
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 