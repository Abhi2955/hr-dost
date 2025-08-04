import { useEffect, useState } from "react";
import flowJson from "@/lib/onboardingFlow.json";
import { useOnboardingUserState } from "./OnboardingUserState";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

interface FlowNode {
  id: string;
  title: string;
  type: string;
  children?: FlowNode[];
  content?: string;
  buttons?: { label: string; action: string; target?: string }[];
  static?: any;
}

function findNodeById(node: FlowNode, id: string): FlowNode | null {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

export default function OnboardingDynamic({ userId = "user1" }: { userId?: string }) {
  const [flow, setFlow] = useState<FlowNode | null>(null);
  const [flowLoading, setFlowLoading] = useState(true);
  const [userState, setUserState, userStateLoading] = useOnboardingUserState(userId);
  const [currentNode, setCurrentNode] = useState<FlowNode | null>(null);

  // Fetch flow from backend
  useEffect(() => {
    setFlowLoading(true);
    fetch("/api/onboarding-flow")
      .then(r => r.json())
      .then(data => { setFlow(data); setFlowLoading(false); })
      .catch(() => setFlowLoading(false));
  }, []);

  useEffect(() => {
    if (!flow || !userState) return;
    const node = findNodeById(flow, userState.currentNodeId);
    setCurrentNode(node);
  }, [userState?.currentNodeId, flow, userState]);

  function handleButtonClick(btn: any) {
    if (!userState) return;
    if (btn.action === "goto" && btn.target) {
      setUserState({ currentNodeId: btn.target });
      setUserState({ completedNodes: Array.from(new Set([...(userState.completedNodes || []), userState.currentNodeId])) });
    } else if (btn.action === "acknowledge") {
      setUserState({ completedNodes: Array.from(new Set([...(userState.completedNodes || []), userState.currentNodeId])) });
    }
  }

  if (flowLoading || userStateLoading) return <div className="p-6">Loading...</div>;
  if (!flow || !userState) return <div className="p-6 text-red-600">Failed to load onboarding flow or user state.</div>;
  if (!currentNode) return <div className="p-6">Loading current step...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2">{currentNode.title}</h2>
        {currentNode.content && <div className="mb-4 text-muted-foreground">{currentNode.content}</div>}
        {currentNode.static && (
          <div className="mb-4 text-xs text-gray-500">{JSON.stringify(currentNode.static)}</div>
        )}
        <div className="flex flex-col gap-2 mb-4">
          {currentNode.buttons && currentNode.buttons.map((btn, i) => (
            <Button key={i} onClick={() => handleButtonClick(btn)}>{btn.label}</Button>
          ))}
        </div>
        {/* Progress display */}
        <div className="mt-8 text-xs text-muted-foreground">
          Progress: {userState.completedNodes.length} steps completed.
        </div>
      </div>
    </div>
  );
} 