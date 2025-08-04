import { useState, useEffect, useCallback } from "react";

export interface OnboardingUserState {
  userId: string;
  currentNodeId: string;
  progress: Record<string, number>;
  completedNodes: string[];
}

export function useOnboardingUserState(userId: string): [OnboardingUserState | null, (s: Partial<OnboardingUserState>) => void, boolean] {
  const [state, setState] = useState<OnboardingUserState | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch from backend
  useEffect(() => {
    setLoading(true);
    fetch(`/api/onboarding-user-state/${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data) setState(data);
        else setState({ userId, currentNodeId: "welcome-1", progress: {}, completedNodes: [] });
        setLoading(false);
      })
      .catch(() => {
        setState({ userId, currentNodeId: "welcome-1", progress: {}, completedNodes: [] });
        setLoading(false);
      });
  }, [userId]);

  // Save to backend
  const updateState = useCallback((update: Partial<OnboardingUserState>) => {
    setState(prev => {
      if (!prev) return prev;
      const newState = { ...prev, ...update };
      fetch(`/api/onboarding-user-state/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newState)
        }
      );
      return newState;
    });
  }, [userId]);

  return [state, updateState, loading];
} 