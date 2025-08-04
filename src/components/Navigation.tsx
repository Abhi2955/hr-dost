import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, Settings, Info, GraduationCap, KanbanSquare } from "lucide-react";

export default function Navigation() {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/onboarding", icon: GraduationCap, label: "Onboarding" },
    { to: "/statistics", icon: BarChart3, label: "Statistics" },
    { to: "/kanban", icon: KanbanSquare, label: "Kanban" },
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/about", icon: Info, label: "About" },
  ];

  return (
    <nav className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              TodoApp
            </h1>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}