import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Palette, 
  Moon, 
  Sun, 
  Target, 
  Trash2, 
  Download,
  Upload,
  Settings as SettingsIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    weeklyGoal: 20,
    autoDelete: false,
    soundEffects: true,
    userName: "User",
  });

  const { toast } = useToast();

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting updated",
      description: "Your preferences have been saved.",
    });
  };

  const exportData = () => {
    const todos = localStorage.getItem('todos') || '[]';
    const data = {
      todos: JSON.parse(todos),
      settings,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todoapp-backup.json';
    a.click();
    
    toast({
      title: "Data exported",
      description: "Your todo data has been downloaded.",
    });
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to delete all your todos? This cannot be undone.')) {
      localStorage.removeItem('todos');
      toast({
        title: "Data cleared",
        description: "All your todos have been deleted.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your todo app experience</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Profile</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="userName">Display Name</Label>
                <Input
                  id="userName"
                  value={settings.userName}
                  onChange={(e) => updateSetting('userName', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified about important updates</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting('notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sound Effects</p>
                  <p className="text-sm text-muted-foreground">Play sounds when completing tasks</p>
                </div>
                <Switch
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                  </div>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Productivity */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Productivity</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">Weekly Goal</p>
                    <p className="text-sm text-muted-foreground">Number of tasks to complete per week</p>
                  </div>
                  <Badge variant="secondary">{settings.weeklyGoal} tasks</Badge>
                </div>
                <Slider
                  value={[settings.weeklyGoal]}
                  onValueChange={(value) => updateSetting('weeklyGoal', value[0])}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-delete Completed</p>
                  <p className="text-sm text-muted-foreground">Automatically remove completed tasks after 7 days</p>
                </div>
                <Switch
                  checked={settings.autoDelete}
                  onCheckedChange={(checked) => updateSetting('autoDelete', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6 shadow-[var(--shadow-card)] animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Data Management</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-muted-foreground">Download your todos and settings as JSON</p>
                </div>
                <Button variant="outline" onClick={exportData} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-destructive">Clear All Data</p>
                  <p className="text-sm text-muted-foreground">Delete all todos and reset the app</p>
                </div>
                <Button variant="destructive" onClick={clearAllData} className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}