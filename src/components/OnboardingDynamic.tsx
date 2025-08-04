import { useEffect, useState } from "react";
import { useOnboardingUserState } from "./OnboardingUserState";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

interface ActionDef {
  id: string;
  type: string;
  target?: string;
  method?: string;
  headers?: Record<string, string>;
  dbType?: string;
  query?: string;
}

interface ButtonDef {
  label: string;
  actionId?: string;
}

interface FlowNode {
  id: string;
  title: string;
  type: string;
  children?: FlowNode[];
  content?: string;
  actions?: ActionDef[];
  buttons?: ButtonDef[];
  static?: unknown;
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

const ORG_ID = "org1";

export default function OnboardingDynamic({ userId = "user1" }: { userId?: string }) {
  const [flow, setFlow] = useState<FlowNode | null>(null);
  const [flowLoading, setFlowLoading] = useState(true);
  const [userState, setUserState, userStateLoading] = useOnboardingUserState(userId);
  const [currentNode, setCurrentNode] = useState<FlowNode | null>(null);

  // Fetch flow from backend
  useEffect(() => {
    setFlowLoading(true);
    fetch(`/api/orgs/${ORG_ID}/onboarding-flow`)
      .then(r => r.json())
      .then(data => { setFlow(data); setFlowLoading(false); })
      .catch(() => setFlowLoading(false));
  }, []);

  useEffect(() => {
    if (!flow || !userState) return;
    const node = findNodeById(flow, userState.currentNodeId);
    setCurrentNode(node);
  }, [userState?.currentNodeId, flow, userState]);

  function handleButtonClick(btn: ButtonDef) {
    if (!userState || !currentNode) return;
    const action = currentNode.actions?.find(a => a.id === btn.actionId);
    if (!action) return;
    if (action.type === "goto" && action.target) {
      setUserState({ currentNodeId: action.target });
      setUserState({ completedNodes: Array.from(new Set([...(userState.completedNodes || []), userState.currentNodeId])) });
    } else if (action.type === "acknowledge") {
      setUserState({ completedNodes: Array.from(new Set([...(userState.completedNodes || []), userState.currentNodeId])) });
    } else if (action.type === "download" && action.target) {
      const link = document.createElement("a");
      link.href = action.target;
      link.download = "";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (action.type === "api" && action.target) {
      fetch(action.target, { method: action.method || "GET", headers: action.headers }).catch(() => {});
    } else if (action.type === "db") {
      fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: action.dbType, query: action.query })
      }).catch(() => {});
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