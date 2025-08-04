import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Heart,
  DollarSign,
  Calendar,
  Home,
  BookOpen,
  Shield,
  Zap,
  Users,
  Coffee,
  Car,
  Plane
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'health' | 'financial' | 'work-life' | 'development' | 'perks';
  details: string[];
  enrollmentRequired: boolean;
  enrollmentDeadline?: string;
  viewed: boolean;
}

export default function Benefits() {
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState<Benefit[]>([
    {
      id: 'health-insurance',
      title: 'Health Insurance',
      description: 'Comprehensive health, dental, and vision coverage for you and your family',
      icon: Heart,
      category: 'health',
      details: [
        'Medical, dental, and vision coverage',
        'Family coverage options available',
        'Prescription drug coverage',
        'Mental health support included',
        'Coverage starts on your first day'
      ],
      enrollmentRequired: true,
      enrollmentDeadline: '2024-01-31',
      viewed: false
    },
    {
      id: '401k',
      title: '401(k) Retirement Plan',
      description: 'Company-matched retirement savings plan with competitive matching',
      icon: DollarSign,
      category: 'financial',
      details: [
        '6% company match on contributions',
        'Vesting schedule: 25% per year',
        'Multiple investment options available',
        'Roth 401(k) option available',
        'Financial planning resources'
      ],
      enrollmentRequired: true,
      enrollmentDeadline: '2024-02-15',
      viewed: false
    },
    {
      id: 'pto',
      title: 'Paid Time Off',
      description: 'Generous vacation, sick leave, and holiday policies',
      icon: Calendar,
      category: 'work-life',
      details: [
        '20 days of PTO per year',
        '10 paid holidays annually',
        'Sick leave: 5 days per year',
        'Bereavement leave available',
        'PTO accrues monthly'
      ],
      enrollmentRequired: false,
      viewed: false
    },
    {
      id: 'remote-work',
      title: 'Remote Work Options',
      description: 'Flexible work arrangements and home office support',
      icon: Home,
      category: 'work-life',
      details: [
        'Hybrid work model available',
        'Home office stipend: $500/year',
        'Internet reimbursement: $50/month',
        'Flexible working hours',
        'Co-working space access'
      ],
      enrollmentRequired: false,
      viewed: false
    },
    {
      id: 'learning',
      title: 'Professional Development',
      description: 'Continuous learning opportunities and skill development',
      icon: BookOpen,
      category: 'development',
      details: [
        '$2,000 annual learning budget',
        'Conference attendance support',
        'Online course subscriptions',
        'Mentorship programs',
        'Internal training sessions'
      ],
      enrollmentRequired: false,
      viewed: false
    },
    {
      id: 'life-insurance',
      title: 'Life Insurance',
      description: 'Company-provided life insurance coverage',
      icon: Shield,
      category: 'health',
      details: [
        '2x annual salary coverage',
        'Additional coverage available',
        'Spouse coverage options',
        'No medical exam required',
        'Coverage starts immediately'
      ],
      enrollmentRequired: true,
      enrollmentDeadline: '2024-01-31',
      viewed: false
    },
    {
      id: 'wellness',
      title: 'Wellness Programs',
      description: 'Health and wellness initiatives and gym memberships',
      icon: Zap,
      category: 'perks',
      details: [
        'Gym membership reimbursement',
        'Mental health app subscriptions',
        'Wellness challenges and rewards',
        'On-site fitness classes',
        'Nutrition counseling available'
      ],
      enrollmentRequired: false,
      viewed: false
    },
    {
      id: 'social',
      title: 'Social Events',
      description: 'Team building activities and company events',
      icon: Users,
      category: 'perks',
      details: [
        'Monthly team lunches',
        'Quarterly company events',
        'Holiday parties and celebrations',
        'Team building activities',
        'Volunteer opportunities'
      ],
      enrollmentRequired: false,
      viewed: false
    }
  ]);

  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const viewedBenefits = benefits.filter(b => b.viewed).length;
  const progress = (viewedBenefits / benefits.length) * 100;

  const categories = [
    { id: 'all', name: 'All Benefits', icon: Award },
    { id: 'health', name: 'Health & Wellness', icon: Heart },
    { id: 'financial', name: 'Financial', icon: DollarSign },
    { id: 'work-life', name: 'Work-Life Balance', icon: Calendar },
    { id: 'development', name: 'Development', icon: BookOpen },
    { id: 'perks', name: 'Perks', icon: Coffee }
  ];

  const handleViewBenefit = (benefitId: string) => {
    setBenefits(benefits.map(benefit => 
      benefit.id === benefitId ? { ...benefit, viewed: true } : benefit
    ));
  };

  const handleComplete = () => {
    navigate('/onboarding');
  };

  const selectedBenefitData = benefits.find(b => b.id === selectedBenefit);
  const filteredBenefits = selectedCategory === 'all' 
    ? benefits 
    : benefits.filter(b => b.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'from-red-400 to-pink-500';
      case 'financial': return 'from-green-400 to-teal-500';
      case 'work-life': return 'from-blue-400 to-purple-500';
      case 'development': return 'from-yellow-400 to-orange-500';
      case 'perks': return 'from-purple-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Benefits & Perks
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore your comprehensive benefits package and company perks
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progress</h2>
            <Badge variant="secondary">
              {viewedBenefits} of {benefits.length} benefits explored
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Category Filter */}
        <Card className="p-6 mb-8 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits List */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Available Benefits</h3>
              <div className="space-y-3">
                {filteredBenefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedBenefit === benefit.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedBenefit(benefit.id);
                      handleViewBenefit(benefit.id);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{benefit.title}</h4>
                          {benefit.enrollmentRequired && (
                            <Badge variant="destructive" className="text-xs">Enroll</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {benefit.description}
                        </p>
                        {benefit.enrollmentDeadline && (
                          <p className="text-xs text-orange-600 mb-2">
                            Deadline: {new Date(benefit.enrollmentDeadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {benefit.viewed && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Benefit Details */}
          <div className="lg:col-span-2">
            {selectedBenefitData ? (
              <Card className="p-8 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getCategoryColor(selectedBenefitData.category)} flex items-center justify-center`}>
                      <selectedBenefitData.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedBenefitData.title}</h2>
                      <p className="text-muted-foreground">{selectedBenefitData.description}</p>
                    </div>
                  </div>
                  {selectedBenefitData.enrollmentRequired && (
                    <Badge variant="destructive">Enrollment Required</Badge>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">What's Included</h3>
                  <div className="space-y-3">
                    {selectedBenefitData.details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getCategoryColor(selectedBenefitData.category)} mt-2`} />
                        <p className="text-muted-foreground">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedBenefitData.enrollmentRequired && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Enrollment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2">Enrollment Required</h4>
                        <p className="text-sm text-orange-700">
                          You must enroll in this benefit to receive coverage.
                        </p>
                        {selectedBenefitData.enrollmentDeadline && (
                          <p className="text-sm text-orange-600 mt-2">
                            <strong>Deadline:</strong> {new Date(selectedBenefitData.enrollmentDeadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
                        <p className="text-sm text-blue-700">
                          Contact HR or visit the benefits portal to complete your enrollment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <Button variant="outline">
                    Download Summary
                  </Button>
                  <Button variant="outline">
                    Contact HR
                  </Button>
                  {selectedBenefitData.enrollmentRequired && (
                    <Button>
                      Enroll Now
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-8 shadow-lg">
                <div className="text-center text-muted-foreground">
                  <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Select a Benefit</h3>
                  <p>Choose a benefit from the list to view detailed information</p>
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
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Benefits Overview
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 