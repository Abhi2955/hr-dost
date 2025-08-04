import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Linkedin,
  Github
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  bio: string;
  startDate: string;
  interests: string[];
  skills: string[];
  isManager: boolean;
  isMentor: boolean;
}

export default function Team() {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Senior Software Engineer',
      department: 'Engineering',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      avatar: '/api/placeholder/150/150',
      bio: 'Sarah is a passionate software engineer with 8+ years of experience in full-stack development. She specializes in React, Node.js, and cloud architecture. Sarah loves mentoring junior developers and contributing to open-source projects.',
      startDate: '2020-03-15',
      interests: ['Open Source', 'Mentoring', 'Cloud Architecture'],
      skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
      isManager: true,
      isMentor: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Product Manager',
      department: 'Product',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      avatar: '/api/placeholder/150/150',
      bio: 'Michael leads our product strategy and roadmap. With 6 years in product management, he has a strong background in user research, data analysis, and agile methodologies. He\'s passionate about creating user-centric solutions.',
      startDate: '2019-08-20',
      interests: ['User Research', 'Data Analysis', 'Product Strategy'],
      skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics'],
      isManager: false,
      isMentor: true
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      department: 'Design',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      avatar: '/api/placeholder/150/150',
      bio: 'Emily creates beautiful and intuitive user experiences. She has 5 years of experience in UX/UI design and is passionate about accessibility and inclusive design. Emily loves collaborating with engineers to bring designs to life.',
      startDate: '2021-01-10',
      interests: ['Accessibility', 'Inclusive Design', 'User Testing'],
      skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
      isManager: false,
      isMentor: false
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'DevOps Engineer',
      department: 'Engineering',
      email: 'david.kim@company.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      avatar: '/api/placeholder/150/150',
      bio: 'David ensures our infrastructure runs smoothly and securely. With expertise in cloud platforms and automation, he helps us scale efficiently. David is always exploring new technologies and best practices.',
      startDate: '2020-11-05',
      interests: ['Cloud Computing', 'Automation', 'Security'],
      skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
      isManager: false,
      isMentor: false
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      role: 'Marketing Manager',
      department: 'Marketing',
      email: 'lisa.thompson@company.com',
      phone: '+1 (555) 567-8901',
      location: 'Chicago, IL',
      avatar: '/api/placeholder/150/150',
      bio: 'Lisa leads our marketing efforts and brand strategy. She has 7 years of experience in digital marketing and is passionate about data-driven campaigns. Lisa loves building relationships with customers and partners.',
      startDate: '2019-05-12',
      interests: ['Digital Marketing', 'Brand Strategy', 'Customer Relations'],
      skills: ['Google Analytics', 'HubSpot', 'Social Media', 'Content Strategy'],
      isManager: true,
      isMentor: false
    }
  ]);

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [viewedMembers, setViewedMembers] = useState<Set<string>>(new Set());

  const handleViewMember = (memberId: string) => {
    setViewedMembers(prev => new Set([...prev, memberId]));
  };

  const handleComplete = () => {
    navigate('/onboarding');
  };

  const selectedMemberData = teamMembers.find(m => m.id === selectedMember);
  const progress = (viewedMembers.size / teamMembers.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Meet Your Team
          </h1>
          <p className="text-xl text-muted-foreground">
            Get to know your colleagues and understand the team structure
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progress</h2>
            <Badge variant="secondary">
              {viewedMembers.size} of {teamMembers.length} team members viewed
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team List */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Team Members</h3>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedMember === member.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedMember(member.id);
                      handleViewMember(member.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {member.isManager && (
                            <Badge variant="secondary" className="text-xs">Manager</Badge>
                          )}
                          {member.isMentor && (
                            <Badge variant="outline" className="text-xs">Mentor</Badge>
                          )}
                        </div>
                      </div>
                      {viewedMembers.has(member.id) && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Member Profile */}
          <div className="lg:col-span-2">
            {selectedMemberData ? (
              <Card className="p-8 shadow-lg">
                <div className="flex items-start gap-6 mb-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={selectedMemberData.avatar} />
                    <AvatarFallback className="text-2xl">
                      {selectedMemberData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedMemberData.name}</h2>
                    <p className="text-lg text-muted-foreground mb-3">{selectedMemberData.role}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedMemberData.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Since {new Date(selectedMemberData.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedMemberData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedMemberData.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Quick Actions</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">About</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedMemberData.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMemberData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMemberData.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 shadow-lg">
                <div className="text-center text-muted-foreground">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Select a Team Member</h3>
                  <p>Choose a team member from the list to view their profile</p>
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
            Complete Team Overview
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 