import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Welcome from "./pages/onboarding/Welcome";
import Policies from "./pages/onboarding/Policies";
import Team from "./pages/onboarding/Team";
import Values from "./pages/onboarding/Values";
import Benefits from "./pages/onboarding/Benefits";
import Checklist from "./pages/onboarding/Checklist";
import FlowEditorPage from "./pages/onboarding/FlowEditor";
import OnboardingDynamicPage from "./pages/onboarding/Dynamic";
import KanbanPage from "./pages/Kanban";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/welcome" element={<Welcome />} />
          <Route path="/onboarding/policies" element={<Policies />} />
          <Route path="/onboarding/team" element={<Team />} />
          <Route path="/onboarding/values" element={<Values />} />
          <Route path="/onboarding/benefits" element={<Benefits />} />
          <Route path="/onboarding/checklist" element={<Checklist />} />
          <Route path="/onboarding/flow-editor" element={<FlowEditorPage />} />
          <Route path="/onboarding/dynamic" element={<OnboardingDynamicPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
