import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  CheckCircle2, 
  Download, 
  Share2, 
  Calendar,
  User,
  Star
} from "lucide-react";

interface CompletionCertificateProps {
  employeeName: string;
  completionDate: string;
  totalModules: number;
  completedModules: number;
  totalTime: string;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function CompletionCertificate({
  employeeName,
  completionDate,
  totalModules,
  completedModules,
  totalTime,
  onDownload,
  onShare
}: CompletionCertificateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 shadow-2xl">
        {/* Certificate Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Certificate of Completion
          </h1>
          <p className="text-muted-foreground">
            Onboarding Program
          </p>
        </div>

        {/* Certificate Content */}
        <div className="text-center mb-8">
          <p className="text-lg mb-4">
            This is to certify that
          </p>
          <h2 className="text-2xl font-bold mb-4 text-primary">
            {employeeName}
          </h2>
          <p className="text-lg mb-6">
            has successfully completed the company onboarding program
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <div className="text-2xl font-bold text-primary">{completedModules}</div>
              <div className="text-sm text-muted-foreground">Modules Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <div className="text-2xl font-bold text-primary">{totalTime}</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Completion Details */}
        <div className="border-t pt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Completed on: {new Date(completionDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Employee ID: {employeeName.split(' ').map(n => n[0]).join('')}-{Date.now().toString().slice(-4)}</span>
            </div>
          </div>
        </div>

        {/* Modules Completed */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Modules Completed:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">Welcome & Introduction</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">Company Policies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">Company Values</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">Meet Your Team</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">Benefits & Perks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">Onboarding Checklist</span>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="border-t pt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="border-b-2 border-gray-300 w-32 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">HR Director</p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-gray-300 w-32 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Employee Signature</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={onDownload} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Certificate
          </Button>
          <Button onClick={onShare} variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Certificate
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>This certificate is valid and can be verified through the HR department.</p>
          <p className="mt-1">Certificate ID: {Date.now().toString(36).toUpperCase()}</p>
        </div>
      </Card>
    </div>
  );
} 