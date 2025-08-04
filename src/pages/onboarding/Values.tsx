import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Target,
  Users,
  Lightbulb,
  Shield,
  Zap,
  Star,
  Award,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  examples: string[];
  viewed: boolean;
}

export default function Values() {
  const navigate = useNavigate();
  const [values, setValues] = useState<CompanyValue[]>([
    {
      id: 'innovation',
      title: 'Innovation',
      description: 'We embrace creativity and forward-thinking solutions that push boundaries and drive progress.',
      icon: Lightbulb,
      color: 'from-yellow-400 to-orange-500',
      examples: [
        'Encouraging new ideas and experimentation',
        'Investing in cutting-edge technologies',
        'Fostering a culture of continuous learning',
        'Celebrating creative problem-solving'
      ],
      viewed: false
    },
    {
      id: 'collaboration',
      title: 'Collaboration',
      description: 'We believe that the best results come from working together, sharing knowledge, and supporting each other.',
      icon: Users,
      color: 'from-blue-400 to-purple-500',
      examples: [
        'Cross-functional team projects',
        'Open communication and transparency',
        'Mentoring and knowledge sharing',
        'Building strong partnerships'
      ],
      viewed: false
    },
    {
      id: 'excellence',
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do, from our products to our customer service.',
      icon: Star,
      color: 'from-purple-400 to-pink-500',
      examples: [
        'Attention to detail in all work',
        'Continuous improvement processes',
        'High standards for quality',
        'Going above and beyond expectations'
      ],
      viewed: false
    },
    {
      id: 'integrity',
      title: 'Integrity',
      description: 'We act with honesty, transparency, and ethical behavior in all our interactions and decisions.',
      icon: Shield,
      color: 'from-green-400 to-teal-500',
      examples: [
        'Honest communication with stakeholders',
        'Ethical decision-making processes',
        'Accountability for our actions',
        'Building trust through transparency'
      ],
      viewed: false
    },
    {
      id: 'impact',
      title: 'Impact',
      description: 'We focus on creating meaningful, positive change for our customers, communities, and the world.',
      icon: Target,
      color: 'from-red-400 to-pink-500',
      examples: [
        'Customer-centric product development',
        'Social responsibility initiatives',
        'Environmental sustainability efforts',
        'Community engagement programs'
      ],
      viewed: false
    },
    {
      id: 'growth',
      title: 'Growth',
      description: 'We foster personal and professional development, encouraging continuous learning and adaptation.',
      icon: Zap,
      color: 'from-indigo-400 to-blue-500',
      examples: [
        'Professional development opportunities',
        'Skill-building workshops and training',
        'Career advancement pathways',
        'Adapting to change and new challenges'
      ],
      viewed: false
    }
  ]);

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const viewedValues = values.filter(v => v.viewed).length;
  const progress = (viewedValues / values.length) * 100;

  const handleViewValue = (valueId: string) => {
    setValues(values.map(value => 
      value.id === valueId ? { ...value, viewed: true } : value
    ));
  };

  const handleComplete = () => {
    navigate('/onboarding');
  };

  const selectedValueData = values.find(v => v.id === selectedValue);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Our Company Values
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover the core principles that guide our culture and decision-making
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progress</h2>
            <Badge variant="secondary">
              {viewedValues} of {values.length} values explored
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {values.map((value) => (
            <Card 
              key={value.id}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedValue === value.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedValue(value.id);
                handleViewValue(value.id);
              }}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center mx-auto mb-4`}>
                <value.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-center mb-3">{value.title}</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {value.description}
              </p>
              
              <div className="flex items-center justify-center">
                {value.viewed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Value Details */}
        {selectedValueData && (
          <Card className="p-8 mb-8 shadow-lg">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${selectedValueData.color} flex items-center justify-center mx-auto mb-4`}>
                <selectedValueData.icon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">{selectedValueData.title}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {selectedValueData.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">How We Live This Value</h3>
                <div className="space-y-3">
                  {selectedValueData.examples.map((example, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedValueData.color} mt-2`} />
                      <p className="text-muted-foreground">{example}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Your Role</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-2">Embrace the Value</h4>
                    <p className="text-sm text-muted-foreground">
                      Look for opportunities to demonstrate this value in your daily work and interactions.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-2">Share Your Ideas</h4>
                    <p className="text-sm text-muted-foreground">
                      Contribute to discussions about how we can better embody this value as a team.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-2">Lead by Example</h4>
                    <p className="text-sm text-muted-foreground">
                      Model this value for others and recognize when colleagues demonstrate it well.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 shadow-lg">
            <div className="text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To empower individuals and organizations through innovative technology solutions that drive meaningful change and create lasting impact.
              </p>
            </div>
          </Card>

          <Card className="p-6 shadow-lg">
            <div className="text-center">
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-muted-foreground">
                To be the leading force in creating technology that makes a positive difference in people's lives and contributes to a better world.
              </p>
            </div>
          </Card>
        </div>

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
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Values Overview
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 